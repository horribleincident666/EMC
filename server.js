const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const dataDir = process.env.DATA_DIR || path.join(root, "data");
const emcDataPath = path.join(dataDir, "emc-data.json");
const rackDbPath = path.join(dataDir, "racktrack-db.json");
const online = {};
const sessions = {};

const PASSWORD = process.env.EMC_PASSWORD || "EMC2016";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = process.env.EMC_ADMIN_PASSWORD || "EMC@20162016";
const ROWS = ["A", "B", "C", "D", "E"];
const FLOORS = ["G", "1", "2", "3", "4"];
const POSITIONS = Array.from({ length: 30 }, (_, index) => String(index + 1).padStart(2, "0"));
const PRODUCTS = [
  ["AURABRIDGE XC", "ABG XC"],
  ["AURABRIDGE C", "ABG C"],
  ["BOREMAT C", "BMT C"],
  ["FEBRIBRIDGE", "FBG"],
  ["AURACOAT XC 8", "ACXC 8"],
  ["AURACOAT XC 10", "ACXC 10"],
  ["AURACOAT XC 14", "ACXC 14"],
  ["AURACOAT C", "ACC"],
  ["AURACOAT MC", "ACMC"],
  ["AURACOAT M", "ACM"],
  ["AURACOAT F", "ACF"],
  ["AURACOAT UF", "ACUF"],
  ["AURAFIX UF", "AFUF"]
].map(([name, shortName]) => ({ name, shortName }));

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".ico": "image/x-icon"
};

fs.mkdirSync(dataDir, { recursive: true });
ensureEmcData();
ensureRackDb();

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(self), microphone=(self), geolocation=(), payment=()",
    "Content-Security-Policy": "default-src 'self' data: blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' data: blob:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'"
  });
  res.end(body);
}

function sendJson(res, status, value) {
  send(res, status, JSON.stringify(value), types[".json"]);
}

function sendDownload(res, filename, body, type = "application/octet-stream") {
  res.writeHead(200, {
    "Content-Type": type,
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer"
  });
  res.end(body);
}

function publicBaseUrl(req) {
  const hostHeader = req.headers.host || "localhost:3000";
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || (hostHeader.includes("localhost") || hostHeader.startsWith("127.") ? "http" : "https");
  return `${protocol}://${hostHeader}`;
}

function windowsLauncher(req) {
  const url = publicBaseUrl(req).replace(/"/g, "");
  return `@echo off
set "APP_URL=${url}"
set "EDGE=%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"
set "CHROME=%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"
if exist "%EDGE%" (
  start "" "%EDGE%" --app="%APP_URL%"
  exit /b
)
if exist "%CHROME%" (
  start "" "%CHROME%" --app="%APP_URL%"
  exit /b
)
start "" "%APP_URL%"
`;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 25_000_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function pruneOnline() {
  const now = Date.now();
  for (const [key, entry] of Object.entries(online)) {
    if (now - Number(entry.at || 0) > 90000) delete online[key];
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (req.method === "OPTIONS") {
      send(res, 204, "");
      return;
    }

    if (url.pathname === "/download/windows-app" && req.method === "GET") {
      sendDownload(res, "EMC-Production-App-Windows.cmd", windowsLauncher(req), "application/x-msdownload");
      return;
    }

    if (url.pathname === "/api/online") {
      if (req.method === "GET") {
        pruneOnline();
        sendJson(res, 200, { online });
        return;
      }
      if (req.method === "POST") {
        const data = await readBody(req);
        if (data.id && data.name) online[data.id] = { name: String(data.name).slice(0, 80), role: String(data.role || "").slice(0, 40), accountId: String(data.accountId || "").slice(0, 80), at: Date.now() };
        pruneOnline();
        sendJson(res, 200, { online });
        return;
      }
    }

    if (url.pathname === "/api/login" && req.method === "POST") {
      const body = await readBody(req);
      const data = readEmcData();
      const identifier = String(body.identifier || body.name || "").trim().toLowerCase();
      const password = String(body.password || "");
      const user = (data.users || []).find(item => [item.username, item.email, item.employeeId].some(value => String(value || "").trim().toLowerCase() === identifier));
      if (!user || !["Active", "Disabled"].includes(user.status) || !verifyPassword(user, password)) {
        const pending = user?.status === "Pending" ? " Account is waiting for Admin approval." : "";
        sendJson(res, 403, { error: `Invalid login or disabled account.${pending}` });
        return;
      }
      user.lastLogin = new Date().toISOString();
      const token = crypto.randomUUID();
      sessions[token] = { id: user.id, role: user.role, status: user.status, name: user.name, username: user.username, at: Date.now() };
      writeJson(emcDataPath, data);
      sendJson(res, 200, { token, user: publicUser(user) });
      return;
    }

    if (url.pathname === "/api/signup" && req.method === "POST") {
      const body = await readBody(req);
      const data = readEmcData();
      const username = String(body.username || "").trim().toLowerCase().slice(0, 80);
      const name = String(body.name || "").trim().slice(0, 100);
      const email = String(body.email || "").trim().toLowerCase().slice(0, 160);
      const password = String(body.password || "");
      if (!username || !name || !password) {
        sendJson(res, 400, { error: "Username, name, and password are required." });
        return;
      }
      if (!/^[a-z0-9._-]{2,80}$/.test(username)) {
        sendJson(res, 400, { error: "Username can use letters, numbers, dot, dash, or underscore only." });
        return;
      }
      const duplicate = (data.users || []).find(item => [item.username, item.email, item.employeeId].some(value => value && String(value).trim().toLowerCase() === username) || (email && String(item.email || "").trim().toLowerCase() === email));
      if (duplicate) {
        sendJson(res, 400, { error: "Username or email already exists." });
        return;
      }
      const account = { id: crypto.randomUUID(), username, name, email, employeeId: "", role: "Staff", status: "Pending", createdAt: new Date().toISOString(), lastLogin: "" };
      setPassword(account, password);
      data.users.push(account);
      data.auditTrail ||= [];
      data.auditTrail.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), by: name, action: "signup", target: "user approval", detail: `Pending account request for ${username}` });
      data.auditTrail = data.auditTrail.slice(0, 1000);
      writeJson(emcDataPath, data);
      sendJson(res, 200, { ok: true, message: "Sign up request sent. Admin approval is required before login." });
      return;
    }

    if (url.pathname === "/api/admin-identity" && req.method === "POST") {
      const admin = requireAdmin(req, res);
      if (!admin) return;
      const body = await readBody(req);
      const data = readEmcData();
      const identity = String(body.identity || "").trim().toUpperCase();
      const password = String(body.password || "");
      const email = String(body.email || "").trim().toLowerCase().slice(0, 160);
      if (!["SD", "PJ", "SKM"].includes(identity)) return sendJson(res, 400, { error: "Select SD, PJ, or SKM." });
      if (password.length < 4) return sendJson(res, 400, { error: "Personal admin password must be at least 4 characters." });
      data.adminProfiles ||= {};
      const profile = data.adminProfiles[identity] || { identity, email: "", createdAt: new Date().toISOString() };
      if (!profile.passwordHash) {
        if (email) profile.email = email;
        setPassword(profile, password);
        data.adminProfiles[identity] = profile;
        writeJson(emcDataPath, data);
        admin.displayName = identity;
        admin.callId = adminCommunicationId(admin);
        return sendJson(res, 200, { ok: true, created: true, identity });
      }
      if (!verifyPassword(profile, password)) return sendJson(res, 403, { error: `Wrong personal password for ${identity}.` });
      if (email && !profile.email) {
        profile.email = email;
        writeJson(emcDataPath, data);
      }
      admin.displayName = identity;
      admin.callId = adminCommunicationId(admin);
      sendJson(res, 200, { ok: true, identity });
      return;
    }

    if (url.pathname === "/api/admin-identity-recovery" && req.method === "POST") {
      const admin = requireAdmin(req, res);
      if (!admin) return;
      const body = await readBody(req);
      const data = readEmcData();
      const identity = String(body.identity || "").trim().toUpperCase();
      const email = String(body.email || "").trim().toLowerCase().slice(0, 160);
      const newPassword = String(body.newPassword || "");
      const profile = data.adminProfiles?.[identity];
      if (profile?.email && email && profile.email === email && newPassword.length >= 4) {
        setPassword(profile, newPassword);
        writeJson(emcDataPath, data);
        sendJson(res, 200, { ok: true, message: `${identity} personal password reset successfully.` });
        return;
      }
      data.passwordRequests ||= [];
      data.passwordRequests.unshift({
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        identifier: `${identity} admin identity`,
        matchedUserId: "",
        matchedName: identity,
        status: "Open",
        note: email ? `Recovery email entered: ${email}` : "No recovery email entered"
      });
      data.passwordRequests = data.passwordRequests.slice(0, 100);
      writeJson(emcDataPath, data);
      sendJson(res, 200, { ok: true, message: `Recovery request for ${identity} recorded in Admin notifications.` });
      return;
    }

    if (url.pathname === "/api/password-reset" && req.method === "POST") {
      const body = await readBody(req);
      const data = readEmcData();
      const identifier = String(body.identifier || "").trim().slice(0, 160);
      if (!identifier) {
        sendJson(res, 400, { error: "Username or email is required." });
        return;
      }
      data.passwordRequests ||= [];
      const matched = (data.users || []).find(item => [item.username, item.email, item.employeeId].some(value => String(value || "").trim().toLowerCase() === identifier.toLowerCase()));
      data.passwordRequests.unshift({
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        identifier,
        matchedUserId: matched?.id || "",
        matchedName: matched?.name || "",
        status: "Open"
      });
      data.passwordRequests = data.passwordRequests.slice(0, 100);
      data.auditTrail ||= [];
      data.auditTrail.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), by: identifier, action: "password reset", target: "admin notification", detail: matched ? `Password reset requested by ${matched.name}` : `Password reset requested for ${identifier}` });
      data.auditTrail = data.auditTrail.slice(0, 1000);
      writeJson(emcDataPath, data);
      sendJson(res, 200, { ok: true, message: "Admin has been notified. Please wait for password reset." });
      return;
    }

    if (url.pathname === "/api/users") {
      const admin = requireAdmin(req, res);
      if (!admin) return;
      const data = readEmcData();
      if (req.method === "GET") {
        sendJson(res, 200, { users: (data.users || []).map(publicUser), passwordRequests: data.passwordRequests || [] });
        return;
      }
      if (req.method === "POST") {
        const body = await readBody(req);
        const incoming = body.user || {};
        const id = incoming.id || crypto.randomUUID();
        let account = (data.users || []).find(item => item.id === id);
        if (!account) {
          account = { id, createdAt: new Date().toISOString() };
          data.users.push(account);
        }
        account.username = String(incoming.username || incoming.employeeId || "").trim().toLowerCase().slice(0, 80);
        account.name = String(incoming.name || "").trim().slice(0, 100);
        account.email = String(incoming.email || "").trim().toLowerCase().slice(0, 160);
        account.employeeId = String(incoming.employeeId || "").trim().toUpperCase().slice(0, 80);
        account.role = incoming.role === "Admin" ? "Admin" : (incoming.role || "Staff");
        account.status = ["Active", "Pending", "Disabled"].includes(incoming.status) ? incoming.status : "Active";
        if (incoming.password) setPassword(account, String(incoming.password));
        if (!account.passwordHash) {
          sendJson(res, 400, { error: "Password is required for a new user." });
          return;
        }
        if (!account.username || !account.name) {
          sendJson(res, 400, { error: "Username and name are required." });
          return;
        }
        if (!/^[a-z0-9._-]{2,80}$/.test(account.username)) {
          sendJson(res, 400, { error: "Username can use letters, numbers, dot, dash, or underscore only." });
          return;
        }
        const employeeKey = account.employeeId.toLowerCase();
        const emailKey = account.email.toLowerCase();
        const usernameKey = account.username.toLowerCase();
        const duplicate = data.users.find(item => item.id !== account.id && ((usernameKey && String(item.username || "").toLowerCase() === usernameKey) || (employeeKey && String(item.employeeId || "").toLowerCase() === employeeKey) || (emailKey && String(item.email || "").toLowerCase() === emailKey)));
        if (duplicate) {
          sendJson(res, 400, { error: "Username, employee ID, or email already exists." });
          return;
        }
        writeJson(emcDataPath, data);
        sendJson(res, 200, { user: publicUser(account), users: data.users.map(publicUser) });
        return;
      }
    }

    if (url.pathname.startsWith("/api/users/") && req.method === "DELETE") {
      const admin = requireAdmin(req, res);
      if (!admin) return;
      const id = decodeURIComponent(url.pathname.split("/").pop() || "");
      if (id === admin.id) {
        sendJson(res, 400, { error: "You cannot remove your own admin account." });
        return;
      }
      const data = readEmcData();
      data.users = (data.users || []).filter(item => item.id !== id);
      for (const [token, session] of Object.entries(sessions)) {
        if (session.id === id) delete sessions[token];
      }
      writeJson(emcDataPath, data);
      sendJson(res, 200, { users: data.users.map(publicUser) });
      return;
    }

    if (url.pathname.startsWith("/api/password-requests/") && req.method === "DELETE") {
      const admin = requireAdmin(req, res);
      if (!admin) return;
      const id = decodeURIComponent(url.pathname.split("/").pop() || "");
      const data = readEmcData();
      data.passwordRequests = (data.passwordRequests || []).filter(item => item.id !== id);
      writeJson(emcDataPath, data);
      sendJson(res, 200, { passwordRequests: data.passwordRequests });
      return;
    }

    if (url.pathname === "/api/formulations") {
      if (req.method === "GET") {
        const data = readEmcData();
        const productId = url.searchParams.get("productId");
        const history = productId ? data.formulationHistory.filter(item => item.productId === productId) : data.formulationHistory;
        sendJson(res, 200, { history });
        return;
      }
      if (req.method === "POST") {
        const actor = requireWritableSession(req, res);
        if (!actor) return;
        const body = await readBody(req);
        const data = readEmcData();
        const record = {
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
          by: String(body.by || "Unknown").slice(0, 100),
          productId: String(body.productId || ""),
          productName: String(body.productName || ""),
          productShort: String(body.productShort || ""),
          containerNo: String(body.containerNo || ""),
          formulation: body.formulation || {}
        };
        data.formulationHistory.unshift(record);
        writeJson(emcDataPath, data);
        sendJson(res, 200, { record, history: data.formulationHistory });
        return;
      }
    }

    if (url.pathname === "/api/audit") {
      if (req.method === "GET") {
        const data = readEmcData();
        sendJson(res, 200, { audit: data.auditTrail || [] });
        return;
      }
      if (req.method === "POST") {
        const actor = requireWritableSession(req, res);
        if (!actor) return;
        const body = await readBody(req);
        const data = readEmcData();
        const entry = {
          id: body.id || crypto.randomUUID(),
          at: body.at || new Date().toISOString(),
          by: String(body.by || "Unknown").slice(0, 100),
          action: String(body.action || "").slice(0, 80),
          target: String(body.target || "").slice(0, 120),
          detail: String(body.detail || "").slice(0, 500)
        };
        data.auditTrail.unshift(entry);
        data.auditTrail = data.auditTrail.slice(0, 1000);
        writeJson(emcDataPath, data);
        sendJson(res, 200, { entry, audit: data.auditTrail });
        return;
      }
    }

    if (url.pathname === "/api/app-state") {
      if (req.method === "GET") {
        const data = readEmcData();
        if (data.appState) {
          delete data.appState.dashboardPhotos;
          delete data.appState.dashboardSlideIndex;
        }
        sendJson(res, 200, { version: data.appStateVersion || 0, state: data.appState || null, updatedAt: data.appStateUpdatedAt || "" });
        return;
      }
      if (req.method === "POST") {
        const actor = requireWritableSession(req, res);
        if (!actor) return;
        const body = await readBody(req);
        const data = readEmcData();
        data.appState = mergeProtectedAppState(data.appState || {}, body.state || {});
        delete data.appState.dashboardPhotos;
        delete data.appState.dashboardSlideIndex;
        data.appStateVersion = Number(data.appStateVersion || 0) + 1;
        data.appStateUpdatedAt = new Date().toISOString();
        data.appStateBy = String(body.by || "Unknown").slice(0, 100);
        writeJson(emcDataPath, data);
        sendJson(res, 200, { version: data.appStateVersion, updatedAt: data.appStateUpdatedAt, by: data.appStateBy });
        return;
      }
    }

    if (url.pathname === "/api/live") {
      if (req.method === "GET") {
        const data = readEmcData();
        const since = Number(url.searchParams.get("since") || 0);
        sendJson(res, 200, { seq: data.liveSeq || 0, events: (data.liveEvents || []).filter(event => Number(event.seq || 0) > since) });
        return;
      }
      if (req.method === "POST") {
        const actor = requireWritableSession(req, res);
        if (!actor) return;
        const body = await readBody(req);
        const data = readEmcData();
        data.liveSeq = Number(data.liveSeq || 0) + 1;
        const event = {
          seq: data.liveSeq,
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          userId: String(body.userId || ""),
          by: String(body.by || "Unknown").slice(0, 100),
          page: String(body.page || "").slice(0, 80),
          area: String(body.area || "").slice(0, 120),
          field: String(body.field || "").slice(0, 120),
          value: String(body.value || "").slice(0, 300)
        };
        data.liveEvents ||= [];
        data.liveEvents.push(event);
        data.liveEvents = data.liveEvents.slice(-250);
        writeJson(emcDataPath, data);
        sendJson(res, 200, { seq: data.liveSeq, event });
        return;
      }
    }

    if (url.pathname === "/api/backups" && req.method === "GET") {
      const admin = requireAdmin(req, res);
      if (!admin) return;
      sendJson(res, 200, { backups: listBackups() });
      return;
    }

    if (url.pathname === "/api/backups/download" && req.method === "GET") {
      const admin = requireAdmin(req, res);
      if (!admin) return;
      const file = String(url.searchParams.get("file") || "");
      const backupPath = safeBackupPath(file);
      if (!backupPath || !fs.existsSync(backupPath)) {
        sendJson(res, 404, { error: "Backup not found." });
        return;
      }
      const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));
      const filename = path.basename(backupPath, ".json").replace(/[^a-z0-9_.-]/gi, "_");
      sendDownload(res, `${filename}.xls`, backupWorkbookXml(backup, file), "application/vnd.ms-excel; charset=utf-8");
      return;
    }

    if (url.pathname === "/api/chat") {
      const actor = requireSession(req, res);
      if (!actor) return;
      const data = readEmcData();
      data.chatMessages ||= [];
      if (req.method === "GET") {
        const since = String(url.searchParams.get("since") || "");
        const channel = String(url.searchParams.get("channel") || "group");
        const peerId = String(url.searchParams.get("peerId") || "");
        const rowsAll = filterChatMessages(data.chatMessages, actor, channel, peerId);
        const rows = since ? rowsAll.filter(message => String(message.at || "") > since) : rowsAll.slice(-250);
        sendJson(res, 200, { messages: rows, latestAt: data.chatMessages.at(-1)?.at || "" });
        return;
      }
      if (req.method === "POST") {
        const body = await readBody(req);
        const channel = body.channel === "direct" ? "direct" : "group";
        const peerId = String(body.peerId || "");
        if (channel === "direct" && !peerId) {
          sendJson(res, 400, { error: "Select a user for individual chat." });
          return;
        }
        const message = {
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          userId: communicationId(actor),
          by: communicationName(actor),
          channel,
          participants: channel === "direct" ? [communicationId(actor), peerId].sort() : [],
          text: String(body.text || "").slice(0, 2000),
          sticker: String(body.sticker || "").slice(0, 80),
          attachment: normalizeChatAttachment(body.attachment),
          audio: normalizeChatAttachment(body.audio),
          unsent: false
        };
        if (!message.text && !message.sticker && !message.attachment && !message.audio) {
          sendJson(res, 400, { error: "Message, sticker, audio, or attachment is required." });
          return;
        }
        data.chatMessages.push(message);
        data.chatMessages = data.chatMessages.slice(-2000);
        writeJson(emcDataPath, data);
        sendJson(res, 200, { message, messages: filterChatMessages(data.chatMessages, actor, channel, peerId).slice(-250) });
        return;
      }
    }

    if (url.pathname === "/api/people" && req.method === "GET") {
      const actor = requireSession(req, res);
      if (!actor) return;
      const data = readEmcData();
      pruneOnline();
      const baseUsers = (data.users || []).filter(account => account.status !== "Pending" && account.role !== "Admin").map(publicUser);
      const onlineUsers = Object.entries(online)
        .filter(([id]) => String(id).startsWith("admin:"))
        .map(([id, entry]) => ({ id, username: id, name: entry.name || id.replace("admin:", ""), email: "", employeeId: id.replace("admin:", ""), role: "Admin", status: "Active", readOnly: false, online: true }));
      const byId = new Map([...baseUsers, ...onlineUsers].map(item => [item.id, item]));
      sendJson(res, 200, { users: [...byId.values()] });
      return;
    }

    if (url.pathname === "/api/calls") {
      const actor = requireSession(req, res);
      if (!actor) return;
      const data = readEmcData();
      data.callEvents ||= [];
      if (req.method === "GET") {
        const since = Number(url.searchParams.get("since") || 0);
        const me = communicationId(actor);
        sendJson(res, 200, { seq: Number(data.callSeq || 0), events: data.callEvents.filter(event => event.to === me && Number(event.seq || 0) > since) });
        return;
      }
      if (req.method === "POST") {
        const body = await readBody(req);
        const to = String(body.to || "");
        if (!to) {
          sendJson(res, 400, { error: "Call target is required." });
          return;
        }
        data.callSeq = Number(data.callSeq || 0) + 1;
        const event = {
          seq: data.callSeq,
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          type: String(body.type || "").slice(0, 40),
          callId: String(body.callId || crypto.randomUUID()),
          from: communicationId(actor),
          fromName: communicationName(actor),
          to,
          payload: body.payload || null
        };
        data.callEvents.push(event);
        data.callEvents = data.callEvents.slice(-1000);
        writeJson(emcDataPath, data);
        sendJson(res, 200, { event, seq: data.callSeq });
        return;
      }
    }

    if (url.pathname.startsWith("/api/chat/") && req.method === "DELETE") {
      const actor = requireSession(req, res);
      if (!actor) return;
      const messageId = decodeURIComponent(url.pathname.split("/").pop() || "");
      const data = readEmcData();
      const message = (data.chatMessages || []).find(item => item.id === messageId);
      if (!message) {
        sendJson(res, 404, { error: "Message not found." });
        return;
      }
      const ageMs = Date.now() - new Date(message.at).getTime();
      const canUnsend = actor.role === "Admin" || (message.userId === actor.id && ageMs <= 60 * 60 * 1000);
      if (!canUnsend) {
        sendJson(res, 403, { error: "Messages can be unsent only within 60 minutes." });
        return;
      }
      message.unsent = true;
      message.text = "";
      message.sticker = "";
      message.attachment = null;
      message.audio = null;
      message.unsentAt = new Date().toISOString();
      message.unsentBy = actor.name || actor.username || "User";
      writeJson(emcDataPath, data);
      sendJson(res, 200, { message, messages: data.chatMessages.slice(-250) });
      return;
    }

    if (url.pathname === "/api/state" && req.method === "GET") {
      sendJson(res, 200, publicRackState());
      return;
    }

    if (url.pathname === "/api/pallets" && req.method === "POST") {
      const body = await readBody(req);
      if (!checkRackPassword(body.password)) return sendJson(res, 403, { error: "Edit password is required." });
      const db = readRackDb();
      const pallet = makePallet(body.pallet || {});
      if (!pallet.locationId) return sendJson(res, 400, { error: "Location is required." });
      const duplicate = db.pallets.find(entry => entry.locationId === pallet.locationId && entry.id !== pallet.id);
      if (duplicate) return sendJson(res, 409, { error: `${pallet.locationId} already has a pallet.` });
      const existing = db.pallets.findIndex(entry => entry.id === pallet.id);
      if (existing >= 0) db.pallets[existing] = pallet;
      else db.pallets.push(pallet);
      db.activity.unshift(activity(`${pallet.shortName} ${displayBatch(pallet)} saved at ${pallet.locationId}.`));
      saveRackDb(db);
      sendJson(res, 200, publicRackState());
      return;
    }

    if (url.pathname.startsWith("/api/pallets/") && req.method === "DELETE") {
      const body = await readBody(req);
      if (!checkRackPassword(body.password)) return sendJson(res, 403, { error: "Edit password is required." });
      const palletId = decodeURIComponent(url.pathname.split("/").pop());
      const db = readRackDb();
      const pallet = db.pallets.find(entry => entry.id === palletId);
      if (!pallet) return sendJson(res, 404, { error: "Pallet not found." });
      db.pallets = db.pallets.filter(entry => entry.id !== palletId);
      db.activity.unshift(activity(`${pallet.shortName} ${displayBatch(pallet)} deleted from ${pallet.locationId}.`));
      saveRackDb(db);
      sendJson(res, 200, publicRackState());
      return;
    }

    if (url.pathname === "/api/sample" && req.method === "POST") {
      const body = await readBody(req);
      if (!checkRackPassword(body.password)) return sendJson(res, 403, { error: "Edit password is required." });
      const db = readRackDb();
      db.locations = generateLocations();
      db.pallets = samplePallets();
      db.activity.unshift(activity("Sample EMC stock loaded."));
      saveRackDb(db);
      sendJson(res, 200, publicRackState());
      return;
    }

    if (url.pathname === "/api/reset-layout" && req.method === "POST") {
      const body = await readBody(req);
      if (!checkRackPassword(body.password)) return sendJson(res, 403, { error: "Edit password is required." });
      const db = readRackDb();
      db.locations = generateLocations();
      db.activity.unshift(activity("EMC rack locations refreshed from guide."));
      saveRackDb(db);
      sendJson(res, 200, publicRackState());
      return;
    }

    if (url.pathname === "/api/clear-activity" && req.method === "POST") {
      const body = await readBody(req);
      if (!checkRackPassword(body.password)) return sendJson(res, 403, { error: "Edit password is required." });
      const db = readRackDb();
      db.activity = [];
      saveRackDb(db);
      sendJson(res, 200, publicRackState());
      return;
    }

    if (url.pathname === "/api/import" && req.method === "POST") {
      const body = await readBody(req);
      if (!checkRackPassword(body.password)) return sendJson(res, 403, { error: "Edit password is required." });
      const imported = body.state || {};
      const db = {
        locations: Array.isArray(imported.locations) && imported.locations.length ? imported.locations : generateLocations(),
        pallets: Array.isArray(imported.pallets) ? imported.pallets.map(makePallet) : [],
        activity: Array.isArray(imported.activity) ? imported.activity : []
      };
      db.activity.unshift(activity("RackTrack data imported."));
      saveRackDb(db);
      sendJson(res, 200, publicRackState());
      return;
    }

    if (url.pathname === "/api/recover" && req.method === "POST") {
      sendJson(res, 200, { ok: true, message: "RackTrack uses the EMC app password." });
      return;
    }

    serveStatic(url, res);
  } catch (error) {
    sendJson(res, 500, { error: "Server error", detail: error.message });
  }
});

function serveStatic(url, res) {
  let urlPath = decodeURIComponent(url.pathname);
  if (urlPath === "/" || urlPath === "") urlPath = "/index.html";
  if (urlPath === "/racktrack" || urlPath === "/racktrack/") urlPath = "/racktrack/index.html";
  if (isBlockedStaticPath(urlPath)) {
    send(res, 403, "Forbidden");
    return;
  }
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(root, "index.html"), (fallbackErr, fallback) => {
        if (fallbackErr) send(res, 404, "Not found");
        else send(res, 200, fallback, types[".html"]);
      });
      return;
    }
    send(res, 200, data, types[path.extname(filePath).toLowerCase()] || "application/octet-stream");
  });
}

function isBlockedStaticPath(urlPath) {
  const lower = String(urlPath || "").replace(/\\/g, "/").toLowerCase();
  if (lower.includes("/.") || lower.startsWith("/data/") || lower.includes("/data/")) return true;
  const blockedFiles = new Set([
    "/server.js",
    "/package.json",
    "/railway.json",
    "/render.yaml",
    "/nixpacks.toml",
    "/procfile",
    "/deployment.md",
    "/readme.md",
    "/install-as-windows-android-app.txt",
    "/start-local-app.bat",
    "/server-debug.log"
  ]);
  if (blockedFiles.has(lower)) return true;
  return [".log", ".bat", ".cmd", ".ps1", ".env", ".pem", ".key"].some(ext => lower.endsWith(ext));
}

function ensureEmcData() {
  if (!fs.existsSync(emcDataPath)) writeJson(emcDataPath, { formulationHistory: [], auditTrail: [], appState: null, appStateVersion: 0, liveSeq: 0, liveEvents: [], users: defaultUsers() });
  const data = readEmcData();
  if (!data.users || !data.users.length) {
    data.users = defaultUsers();
    writeJson(emcDataPath, data);
    return;
  }
  let changed = false;
  changed = ensureAdminAccount(data) || changed;
  if (changed) {
    writeJson(emcDataPath, data);
  }
}

function readEmcData() {
  const data = JSON.parse(fs.readFileSync(emcDataPath, "utf8"));
  data.formulationHistory ||= [];
  data.auditTrail ||= [];
  data.appStateVersion ||= 0;
  data.liveSeq ||= 0;
  data.liveEvents ||= [];
  data.passwordRequests ||= [];
  data.adminProfiles ||= {};
  data.chatMessages ||= [];
  data.callEvents ||= [];
  data.callSeq ||= 0;
  data.users ||= defaultUsers();
  normalizeUsers(data);
  return data;
}

function defaultUsers() {
  const users = [
    seedUser("SD", "Admin", ADMIN_PASSWORD, "Admin", "subratadutta66666@gmail.com", ADMIN_USERNAME),
    seedUser("EMC", "View only", PASSWORD, "EMC Visitor", "", "emc")
  ];
  return users;
}

function seedUser(code, role, password, name = code, email = "", username = code.toLowerCase()) {
  const account = {
    id: crypto.randomUUID(),
    username,
    name,
    email,
    employeeId: code,
    role,
    status: "Active",
    createdAt: new Date().toISOString(),
    lastLogin: ""
  };
  setPassword(account, password);
  return account;
}

function ensureAdminAccount(data) {
  let changed = false;
  let admin = (data.users || []).find(user => String(user.username || "").toLowerCase() === ADMIN_USERNAME);
  if (!admin) {
    admin = seedUser("Admin", "Admin", ADMIN_PASSWORD, "Admin", "subratadutta66666@gmail.com", ADMIN_USERNAME);
    data.users.push(admin);
    return true;
  }
  if (admin.role !== "Admin" || admin.status !== "Active" || admin.name !== "Admin") {
    admin.role = "Admin";
    admin.status = "Active";
    admin.name = "Admin";
    changed = true;
  }
  if (admin.employeeId !== "SD") {
    admin.employeeId = "SD";
    changed = true;
  }
  if (admin.email !== "subratadutta66666@gmail.com") {
    admin.email = "subratadutta66666@gmail.com";
    changed = true;
  }
  if (!verifyPassword(admin, ADMIN_PASSWORD)) {
    setPassword(admin, ADMIN_PASSWORD);
    changed = true;
  }
  changed = ensureVisitorAccount(data) || changed;
  return changed;
}

function ensureVisitorAccount(data) {
  let visitor = (data.users || []).find(user => String(user.username || "").toLowerCase() === "emc");
  let changed = false;
  if (!visitor) {
    data.users.push(seedUser("EMC", "View only", PASSWORD, "EMC Visitor", "", "emc"));
    return true;
  }
  if (visitor.name !== "EMC Visitor") {
    visitor.name = "EMC Visitor";
    changed = true;
  }
  if (visitor.employeeId !== "EMC") {
    visitor.employeeId = "EMC";
    changed = true;
  }
  if (visitor.role !== "View only") {
    visitor.role = "View only";
    changed = true;
  }
  if (visitor.status !== "Active") {
    visitor.status = "Active";
    changed = true;
  }
  if (!verifyPassword(visitor, PASSWORD)) {
    setPassword(visitor, PASSWORD);
    changed = true;
  }
  return changed;
}

function runAdminOnlyUserMigration(data) {
  if (data.userCleanupVersion === "admin-only-20260704b") return false;
  const admins = (data.users || []).filter(user => String(user.username || "").toLowerCase() === ADMIN_USERNAME);
  data.users = admins.slice(0, 1);
  data.userCleanupVersion = "admin-only-20260704b";
  return true;
}

function purgeSeedStaffUsers(data) {
  const removeIds = new Set(["SKM", "SM", "SN", "SR", "PP", "KP", "PJ", "TS"]);
  const before = (data.users || []).length;
  data.users = (data.users || []).filter(user => {
    const employee = String(user.employeeId || "").toUpperCase();
    const username = String(user.username || "").toUpperCase();
    if (employee === "SD" && username !== "ADMIN") return false;
    return !removeIds.has(employee) && !removeIds.has(username);
  });
  return data.users.length !== before;
}

function normalizeUsers(data) {
  let changed = false;
  (data.users || []).forEach(user => {
    if (!user.username) {
      user.username = String(user.employeeId || user.email || user.name || "").trim().toLowerCase().replace(/\s+/g, ".");
      changed = true;
    }
    if (!user.status) {
      user.status = "Active";
      changed = true;
    }
  });
  return changed;
}

function setPassword(user, password) {
  user.passwordSalt = crypto.randomBytes(16).toString("hex");
  user.passwordHash = crypto.pbkdf2Sync(password, user.passwordSalt, 120000, 32, "sha256").toString("hex");
}

function verifyPassword(user, password) {
  if (!user.passwordHash || !user.passwordSalt) return password === PASSWORD && user.role === "Admin";
  const hash = crypto.pbkdf2Sync(password, user.passwordSalt, 120000, 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passwordHash, "hex"));
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username || "",
    name: user.name,
    email: user.email || "",
    employeeId: user.employeeId || "",
    role: user.role || "Staff",
    status: user.status || "Active",
    createdAt: user.createdAt || "",
    lastLogin: user.lastLogin || ""
    ,readOnly: user.status === "Disabled" || user.role === "View only"
  };
}

function requireAdmin(req, res) {
  const session = requireSession(req, res);
  if (!session) return null;
  if (session.role !== "Admin") {
    sendJson(res, 403, { error: "Admin access required." });
    return null;
  }
  return session;
}

function requireSession(req, res) {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const session = sessions[token];
  if (!session) {
    sendJson(res, 403, { error: "Verified login required." });
    return null;
  }
  const data = readEmcData();
  const account = (data.users || []).find(user => user.id === session.id);
  if (!account || !["Active", "Disabled"].includes(account.status || "")) {
    sendJson(res, 403, { error: "Account is not active." });
    return null;
  }
  session.role = account.role || session.role;
  session.status = account.status || session.status;
  session.name = account.name || session.name;
  session.username = account.username || session.username;
  const displayHeader = String(req.headers["x-emc-display-name"] || "").trim().toUpperCase();
  if (session.role === "Admin" && ["SD", "PJ", "SKM"].includes(displayHeader)) session.displayName = displayHeader;
  session.at = Date.now();
  return session;
}

function dataRichness(value) {
  if (!value) return 0;
  if (Array.isArray(value)) return value.reduce((total, item) => total + dataRichness(item), value.length * 20);
  if (typeof value === "object") return Object.entries(value).reduce((total, [key, item]) => total + String(key).length + dataRichness(item), Object.keys(value).length * 10);
  const text = String(value || "").trim();
  return text && !text.startsWith("data:image") ? text.length : Math.min(text.length, 800);
}

function mergeProtectedAppState(existing, incoming) {
  const merged = { ...(incoming || {}) };
  delete merged.dashboardPhotos;
  delete merged.dashboardSlideIndex;
  const current = existing || {};
  const keepExistingIfRicher = key => {
    if (dataRichness(current[key]) > dataRichness(merged[key])) merged[key] = current[key];
  };
  ["tasks", "stockVariants", "machines", "screenDetails", "formulationHistory", "kpi", "longPlans", "ideas", "grn", "mesh", "audit", "products"].forEach(keepExistingIfRicher);
  ["stockDays", "activity", "breakdowns"].forEach(keepExistingIfRicher);
  if ((current.blendPlan?.plan || current.blendPlan?.target) && !(merged.blendPlan?.plan || merged.blendPlan?.target)) merged.blendPlan = current.blendPlan;
  return merged;
}

function adminCommunicationId(session) {
  const identity = String(session?.displayName || "").trim().toUpperCase();
  return identity && ["SD", "PJ", "SKM"].includes(identity) ? `admin:${identity}` : session?.id;
}

function communicationId(session) {
  if (!session) return "";
  if (session.role === "Admin") return adminCommunicationId(session) || session.id;
  return session.id;
}

function communicationName(session) {
  if (!session) return "User";
  if (session.role === "Admin" && session.displayName) return session.displayName;
  return session.name || session.username || "User";
}

function requireWritableSession(req, res) {
  const session = requireSession(req, res);
  if (!session) return null;
  if (session.status === "Disabled" || session.role === "View only") {
    sendJson(res, 403, { error: "Your account is read-only. You can view the app but cannot change data." });
    return null;
  }
  return session;
}

function normalizeChatAttachment(file) {
  if (!file || !file.data) return null;
  const data = String(file.data || "");
  if (data.length > 12_000_000) return { name: "Attachment too large", type: "blocked", data: "" };
  return {
    name: String(file.name || "attachment").slice(0, 180),
    type: String(file.type || "application/octet-stream").slice(0, 120),
    data
  };
}

function filterChatMessages(messages, actor, channel = "group", peerId = "") {
  const rows = messages || [];
  if (actor.role === "Admin" && channel === "all-direct") return rows.filter(message => message.channel === "direct");
  if (channel === "direct") {
    const participants = [communicationId(actor), peerId].sort();
    return rows.filter(message => message.channel === "direct" && JSON.stringify(message.participants || []) === JSON.stringify(participants));
  }
  return rows.filter(message => !message.channel || message.channel === "group");
}

function ensureRackDb() {
  if (!fs.existsSync(rackDbPath)) {
    writeJson(rackDbPath, {
      locations: generateLocations(),
      pallets: [],
      activity: [activity("EMC online RackTrack database created.")]
    });
  }
}

function readRackDb() {
  return JSON.parse(fs.readFileSync(rackDbPath, "utf8"));
}

function saveRackDb(db) {
  db.locations ||= generateLocations();
  db.pallets ||= [];
  db.activity = (db.activity || []).slice(0, 200);
  writeJson(rackDbPath, db);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  backupDataFile(filePath, "before-write");
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function backupDataFile(filePath, reason = "backup") {
  try {
    if (!fs.existsSync(filePath)) return;
    const baseName = path.basename(filePath, ".json");
    const backupDir = path.join(dataDir, "backups", baseName);
    fs.mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(filePath, path.join(backupDir, `${stamp}-${reason}.json`));
    const backups = fs.readdirSync(backupDir)
      .filter(name => name.endsWith(".json"))
      .sort()
      .reverse();
    backups.slice(500).forEach(name => fs.unlinkSync(path.join(backupDir, name)));
  } catch (error) {
    console.warn("Could not create data backup:", error.message);
  }
}

function backupsRoot() {
  return path.join(dataDir, "backups");
}

function listBackups() {
  const rootDir = backupsRoot();
  if (!fs.existsSync(rootDir)) return [];
  const results = [];
  for (const folder of fs.readdirSync(rootDir, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    const folderPath = path.join(rootDir, folder.name);
    for (const file of fs.readdirSync(folderPath, { withFileTypes: true })) {
      if (!file.isFile() || !file.name.endsWith(".json")) continue;
      const filePath = path.join(folderPath, file.name);
      const stat = fs.statSync(filePath);
      results.push({
        type: folder.name,
        file: `${folder.name}/${file.name}`,
        size: stat.size,
        createdAt: stat.mtime.toISOString()
      });
    }
  }
  return results.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 500);
}

function safeBackupPath(relativeFile) {
  const rootDir = backupsRoot();
  const normalized = path.normalize(relativeFile).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(rootDir, normalized);
  if (!fullPath.startsWith(rootDir) || !fullPath.endsWith(".json")) return "";
  return fullPath;
}

function backupWorkbookXml(backup, sourceFile) {
  const app = backup.appState || backup;
  const sheets = [
    { name: "Backup Summary", rows: [["Field", "Value"], ["Source backup file", sourceFile], ["Created / updated", backup.appStateUpdatedAt || backup.createdAt || ""], ["Updated by", backup.appStateBy || ""], ["App state version", backup.appStateVersion || ""]] }
  ];
  if (Array.isArray(app.stockVariants)) sheets.push({ name: "Raw Material Stock", rows: [["ID", "Category", "Material", "Raw Of", "Opening", "PSD"], ...app.stockVariants.map(v => [v.id, v.category, v.name, v.rawOf, v.opening, compactJson(v.psd)])] });
  if (app.stockDays) sheets.push({ name: "Daily Stock Records", rows: objectTableRows(app.stockDays, ["Date", "Variant ID", "Opening", "Day production", "Night production", "Consumption day", "Consumption night", "Closing", "Remarks"], (date, variantId, row) => [date, variantId, row.opening, row.dayProd, row.nightProd, row.consDay, row.consNight, row.closing, row.remarks]) });
  if (Array.isArray(app.products)) sheets.push({ name: "Products", rows: [["ID", "Product", "Short", "Mesh Product", "D90", "D50", "D10", "Target kg"], ...app.products.map(p => [p.id, p.name, p.short, p.meshProduct, p.d90, p.d50, p.d10, p.targetKg])] });
  if (Array.isArray(app.products)) sheets.push({ name: "Formulation Current", rows: [["Product", "Short", "Component", "Stock", "Percent", "PSD"], ...app.products.flatMap(p => (p.formulation?.components || []).map(c => [p.name, p.short, c.name, c.stock, c.percent, compactJson(c.psd)]))] });
  if (Array.isArray(app.formulationHistory || backup.formulationHistory)) sheets.push({ name: "Formulation History", rows: [["Saved At", "By", "Product", "Short", "Container No", "Formulation"], ...(app.formulationHistory || backup.formulationHistory || []).map(f => [f.savedAt, f.by, f.productName, f.productShort, f.containerNo, compactJson(f.formulation)])] });
  if (Array.isArray(app.machines)) sheets.push({ name: "Machinery Library", rows: [["ID", "Machine", "Category", "Screens", "Current Setup", "Outputs", "Notes"], ...app.machines.map(m => [m.id, m.name, m.category, m.screens, m.currentSetup, (m.outputNames || []).join(", "), m.notes])] });
  if (Array.isArray(app.machines)) sheets.push({ name: "Machine Spares", rows: [["Machine", "Order", "Spare Part", "Specification", "Stock", "Minimum"], ...app.machines.flatMap(m => (m.spares || []).map(s => [m.name, s.order, s.part, s.specification, s.stock, s.reorder]))] });
  if (app.breakdowns) sheets.push({ name: "Breakdowns", rows: objectTableRows(app.breakdowns, ["Machine ID", "Breakdown ID", "Date", "Hours", "Status", "Details", "Photo/File"], (machineId, breakdownId, row) => [machineId, breakdownId, row.date, row.hours, row.status, row.details, row.photo]) });
  if (app.activity) sheets.push({ name: "Activity And Plans", rows: activityBackupRows(app.activity) });
  if (Array.isArray(app.tasks)) sheets.push({ name: "Task Allocation", rows: [["Type", "Category", "Work", "Priority", "Responsible", "Assistant", "Allocation Date", "Timeline", "Status", "Completion Date", "Achievement Day", "Rating", "Remarks"], ...app.tasks.map(t => [t.kind, t.category, t.work, t.priority, t.responsible, t.assistant, t.allocationDate, t.timeline, t.status, t.completionDate, t.achievementDay, t.rating, t.remarks])] });
  if (Array.isArray(app.kpi)) sheets.push({ name: "KPI", rows: [["Date", "Category", "Product", "Objective", "Target", "Achieved", "Achieved %", "Owner", "Remarks"], ...app.kpi.map(k => [k.date, k.category, k.product, k.objective, k.target, k.achieved, k.achievedPercent, k.owner, k.remarks])] });
  if (Array.isArray(app.longPlans)) sheets.push({ name: "Long Term Plans", rows: [["Date", "Plan", "Timeline", "Allotted By"], ...app.longPlans.map(p => [p.date, p.plan, p.timeline, p.allottedBy])] });
  if (Array.isArray(app.ideas)) sheets.push({ name: "Suggestions", rows: [["By", "Date", "Regarding", "Details", "Status", "Approved By", "Attachment"], ...app.ideas.map(i => [i.by, i.date, i.regarding, i.details, i.status, i.approvedBy, i.attachmentName])] });
  if (Array.isArray(app.grn)) sheets.push({ name: "GRN", rows: [["Type", "Date", "Party", "Invoice", "Material", "Qty", "PSD", "Remarks"], ...app.grn.map(g => [g.type, g.date, g.party, g.invoice, g.material, g.qty, g.psd, g.remarks])] });
  if (Array.isArray(app.mesh)) sheets.push({ name: "Mesh Micron", rows: [["Mesh", "Microns", "Inches", "Millimeters"], ...app.mesh.map(m => [m.mesh, m.microns, m.inches, m.millimeters])] });
  if (Array.isArray(backup.users)) sheets.push({ name: "Users", rows: [["Username", "Name", "Email", "Employee ID", "Role", "Status", "Created At", "Last Login"], ...backup.users.map(u => [u.username, u.name, u.email, u.employeeId, u.role, u.status, u.createdAt, u.lastLogin])] });
  if (Array.isArray(backup.chatMessages || app.chatMessages)) sheets.push({ name: "Chats", rows: [["At", "By", "Text", "Sticker", "Attachment", "Audio", "Unsent"], ...(backup.chatMessages || app.chatMessages || []).map(m => [m.at, m.by, m.unsent ? "Message unsent" : m.text, m.sticker, m.attachment?.name || "", m.audio?.name || "", m.unsent ? "Yes" : "No"])] });
  if (Array.isArray(backup.chatMessages || app.chatMessages)) sheets.push({ name: "Chat Attachments", rows: [["At", "By", "Kind", "File Name", "File Type", "Stored In Backup"], ...(backup.chatMessages || app.chatMessages || []).flatMap(m => [["Attachment", m.attachment], ["Audio", m.audio]].filter(([, file]) => file).map(([kind, file]) => [m.at, m.by, kind, file.name, file.type, file.data ? "Yes" : "No"]))] });
  if (Array.isArray(backup.callEvents || app.callEvents)) sheets.push({ name: "Call Logs", rows: [["At", "Type", "From", "To", "Call ID"], ...(backup.callEvents || app.callEvents || []).map(c => [c.at, c.type, c.fromName || c.from, c.to, c.callId])] });
  if (Array.isArray(backup.auditTrail || app.audit)) sheets.push({ name: "Audit Trail", rows: [["At", "By", "Action", "Target", "Detail"], ...(backup.auditTrail || app.audit || []).map(a => [a.at, a.by, a.action, a.target, a.detail])] });
  if (Array.isArray(backup.locations)) sheets.push({ name: "Rack Locations", rows: [["ID", "Row", "Floor", "Position", "Code"], ...backup.locations.map(l => [l.id, l.row, l.floor, l.position, l.code])] });
  if (Array.isArray(backup.pallets)) sheets.push({ name: "Rack Pallets", rows: [["Product", "Short", "Batch", "Location", "Packaging", "Weight Class", "Bag Weight", "Bag Count", "Net kg", "FIFO Date", "Notes"], ...backup.pallets.map(p => [p.productName, p.shortName, p.batch, p.locationId, p.packaging, p.weightClass, p.bagWeight, p.bagCount, p.netKg, p.fifoDate, p.notes])] });
  if (Array.isArray(backup.activity) && !app.activity) sheets.push({ name: "Rack Activity", rows: [["At", "Message"], ...backup.activity.map(a => [a.at, a.message])] });
  return spreadsheetXml(sheets);
}

function objectTableRows(obj, headers, mapper) {
  const rows = [headers];
  Object.entries(obj || {}).forEach(([outerKey, inner]) => {
    Object.entries(inner || {}).forEach(([innerKey, value]) => rows.push(mapper(outerKey, innerKey, value || {})));
  });
  return rows;
}

function activityBackupRows(activity) {
  const rows = [["Date", "Type", "Shift", "Person", "Details"]];
  Object.entries(activity || {}).forEach(([key, rec]) => {
    const [date] = key.split("|");
    (rec.work || []).forEach(r => rows.push([date, "Activity", r.shift, r.person || r.employee, r.text]));
    (rec.plan || []).forEach(r => rows.push([date, "Tomorrow Plan", r.shift, r.person || r.employee, r.text]));
  });
  return rows;
}

function compactJson(value) {
  if (!value || (typeof value === "object" && !Object.keys(value).length)) return "";
  return typeof value === "string" ? value : JSON.stringify(value);
}

function spreadsheetXml(sheets) {
  const columnXml = rows => {
    const maxCols = Math.max(...rows.map(r => r.length || 1), 1);
    return Array.from({ length: maxCols }, (_, i) => {
      const width = Math.min(260, Math.max(80, ...rows.map(r => String(r[i] ?? "").length * 7 + 24)));
      return `<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`;
    }).join("");
  };
  return `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
<Style ss:ID="header"><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#2D7A55" ss:Pattern="Solid"/><Borders>${borderXml("#163d2c")}</Borders></Style>
<Style ss:ID="cell"><Alignment ss:Vertical="Top" ss:WrapText="1"/><Borders>${borderXml("#D4E4DA")}</Borders></Style>
</Styles>
${sheets.map(sheet => `<Worksheet ss:Name="${xmlEsc(sheet.name.slice(0, 31))}"><Table>${columnXml(sheet.rows)}${sheet.rows.map((row, index) => `<Row>${(row.length ? row : [""]).map(cell => `<Cell ss:StyleID="${index === 0 ? "header" : "cell"}"><Data ss:Type="${typeof cell === "number" ? "Number" : "String"}">${xmlEsc(cell ?? "")}</Data></Cell>`).join("")}</Row>`).join("")}</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>1</SplitHorizontal><TopRowBottomPane>1</TopRowBottomPane><ActivePane>2</ActivePane></WorksheetOptions></Worksheet>`).join("")}
</Workbook>`;
}

function borderXml(color) {
  return ["Bottom", "Left", "Right", "Top"].map(pos => `<Border ss:Position="${pos}" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="${color}"/>`).join("");
}

function xmlEsc(value) {
  return String(value ?? "").replace(/[<>&'"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));
}

function publicRackState() {
  const db = readRackDb();
  db.pallets = (db.pallets || []).map(makePallet);
  return { ...db, products: PRODUCTS };
}

function checkRackPassword(password) {
  return String(password || "") === PASSWORD;
}

function generateLocations() {
  return ROWS.flatMap(row => FLOORS.flatMap(floor => POSITIONS.map(position => ({
    id: `${row}-${floor}-${position}`,
    row,
    floor,
    position,
    code: `${row}-${floor}-${position}`
  }))));
}

function samplePallets() {
  return [
    makePallet({ productName: "AURACOAT C", batch: "B250601", locationId: "A-G-01", packaging: "Paper sacks", bagWeight: 13, bagCount: 42, fifoDate: "2026-06-01", notes: "Guide sample." }),
    makePallet({ productName: "AURACOAT M", batch: "B250602", locationId: "C-2-15", packaging: "Jumbo bag", weightClass: 650, fifoDate: "2026-06-02", notes: "Guide sample." }),
    makePallet({ productName: "AURABRIDGE XC", batch: "B250610", locationId: "B-1-08", packaging: "Paper sacks", bagWeight: 15.5, bagCount: 42, fifoDate: "2026-06-10", notes: "" }),
    makePallet({ productName: "AURAFIX UF", batch: "B250611", locationId: "D-G-22", packaging: "Jumbo bag", weightClass: 550, fifoDate: "2026-06-11", notes: "" })
  ];
}

function normalizePackaging(packaging) {
  return packaging === "Paper sack pallet" ? "Paper sacks" : (packaging || "Paper sacks");
}

function packagingRule(packaging, weightClass, bagWeight, bagCount) {
  if (packaging === "Jumbo bag") return { bagWeight: Number(weightClass || 550), bagCount: 1, netKg: Number(weightClass || 550) };
  const sackWeight = Number(bagWeight || (Number(weightClass) === 650 ? 15.5 : 13));
  const sackCount = Number(bagCount || 42);
  return { bagWeight: sackWeight, bagCount: sackCount, netKg: Number((sackWeight * sackCount).toFixed(1)) };
}

function makePallet(input) {
  const product = PRODUCTS.find(entry => entry.name === input.productName) || PRODUCTS[0];
  const weightClass = Number(input.weightClass || 550);
  const packaging = normalizePackaging(input.packaging);
  const rule = packagingRule(packaging, weightClass, input.bagWeight, input.bagCount);
  return {
    id: input.id || crypto.randomUUID(),
    productName: product.name,
    shortName: product.shortName,
    batch: String(input.batch || "").trim(),
    locationId: String(input.locationId || "").trim(),
    packaging,
    weightClass,
    bagWeight: rule.bagWeight,
    bagCount: rule.bagCount,
    netKg: rule.netKg,
    fifoDate: input.fifoDate || new Date().toISOString().slice(0, 10),
    notes: String(input.notes || "").trim()
  };
}

function activity(message) {
  return { id: crypto.randomUUID(), at: new Date().toISOString(), message };
}

function displayBatch(pallet) {
  return pallet.batch ? `batch ${pallet.batch}` : "without batch no.";
}

server.listen(port, host, () => {
  console.log(`EMC Production Management running on ${host}:${port}`);
});
