const PASSWORD = "EMC2016";
const STORAGE_KEY = "emcCommandCenter.v1";
const BELL_READ_KEY = "emcActivityBell.read.v1";
const BELL_POS_KEY = "emcActivityBell.position.v1";
const BELL_BUTTON_POS_KEY = "emcActivityBell.buttonPosition.v1";
const TASK_REFERENCE_VERSION = "260625-skm-reference";
const DATE_MIN = "2026-07-01";
const DATE_MAX = "2126-07-01";
const RECOVERY_EMAIL = "subratadutta66666@gmail.com";
const IDLE_TIMEOUT_MS = 10 * 60 * 1000;

const pages = [
  ["dashboard", "Dashboard"],
  ["notification", "General Notification"],
  ["chat", "Team Chat"],
  ["kpi", "KPI"],
  ["stock", "Raw Material Stock"],
  ["racktrack", "Rack Tracking"],
  ["grn", "Incoming / Outgoing Material"],
  ["formulation", "Formulation"],
  ["production", "Machinery Library"],
  ["taskAllocation", "Task Allocation"],
  ["longPlans", "Long Term Plans"],
  ["activity", "Activity Log"],
  ["tomorrow", "Tomorrow's Plan"],
  ["ideas", "Suggestions"],
  ["mesh", "Mesh Micron"],
  ["audit", "Audit Trail"],
  ["admin", "Admin"]
];

const machineCategories = ["Sieving machine", "Grinding machine", "Blending machine", "Material handling equipments"];

const productSeeds = [
  ["FEBRIBRIDGE", "FBG"], ["AURABRIDGE XC", "ABG XC"], ["AURABRIDGE C", "ABG C"],
  ["BOREMAT C", "BMT C"], ["BOREMAT M", "BMT M"], ["AURACOAT XC 8", "ACXC 8"],
  ["AURACOAT XC 10", "ACXC 10"], ["AURACOAT XC 14", "ACXC 14"], ["AURACOAT C", "ACC"],
  ["AURACOAT MC", "ACMC"], ["AURACOAT M", "ACM"], ["AURACOAT F", "ACF"],
  ["AURACOAT UF", "ACUF"], ["AURAFIX UF", "AFUF"]
];

const meshSeed = [
  [3, 6730, 0.2650, 6.730], [4, 4760, 0.1870, 4.760], [5, 4000, 0.1570, 4.000],
  [6, 3360, 0.1320, 3.360], [7, 2830, 0.1110, 2.830], [8, 2380, 0.0937, 2.380],
  [10, 2000, 0.0787, 2.000], [12, 1680, 0.0661, 1.680], [14, 1410, 0.0555, 1.410],
  [16, 1190, 0.0469, 1.190], [18, 1000, 0.0394, 1.000], [20, 841, 0.0331, 0.841],
  [25, 707, 0.0280, 0.707], [30, 595, 0.0232, 0.595], [35, 500, 0.0197, 0.500],
  [40, 400, 0.0165, 0.400], [45, 354, 0.0138, 0.354], [50, 297, 0.0117, 0.297],
  [60, 250, 0.0098, 0.250], [70, 210, 0.0083, 0.210], [80, 177, 0.0070, 0.177],
  [100, 149, 0.0059, 0.149], [120, 125, 0.0049, 0.125], [140, 105, 0.0041, 0.105],
  [170, 88, 0.0035, 0.088], [200, 74, 0.0029, 0.074], [230, 63, 0.0024, 0.063],
  [270, 53, 0.0021, 0.053], [325, 44, 0.0017, 0.044], [400, 37, 0.0015, 0.037]
];

const stockSeeds = [
  ["UNP materials", "TNC raw grit", 50000], ["UNP materials", "MLP raw grit", 10000],
  ["UNP materials", "Fibre cnt TNC", 5000], ["UNP materials", "UNP ECR", 4000],
  ["UNP materials", "TNC 100#", 20000], ["LCM raw", "TNC 8/10#", 0],
  ["LCM raw", "TNC 10/14#", 0], ["LCM raw", "TNC 16/18#", 1200],
  ["LCM raw", "TNC 16/20", 400], ["LCM raw", "TNC 18/25#", 2000],
  ["LCM raw", "TNC 14/16#", 800], ["LCM raw", "TNC 20/25#", 1500],
  ["LCM raw", "TNC 25/30", 300], ["LCM raw", "TNC 30/40#", 3500],
  ["NIF raw", "RLP 40/200#", 4695], ["NIF raw", "UFDP", 12000]
];

const taskReference = window.taskReferenceSeed || {
  headers: ["Category", "Work to be done", "Priority", "Responsible", "Assistant", "Allocation date", "Timeline", "Status", "Completion date", "Achv. day( Early/ Late)", "Rating ( Quality, execution, timeline))"],
  projects: [],
  completed: [],
  performance: []
};

function seededReferenceTasks() {
  return [...(taskReference.projects || []), ...(taskReference.completed || [])].map(task => normalizeReferenceTask({ id: id(), ...task }));
}

function normalizeReferenceTask(task) {
  return {
    id: task.id || id(),
    kind: task.kind || (task.completionDate ? "Completed" : "Open"),
    category: task.category || "",
    work: task.work || task.task || "",
    priority: task.priority || "",
    responsible: task.responsible || task.assignedTo || "",
    assistant: task.assistant || "",
    allocationDate: task.allocationDate || task.date || "",
    timeline: task.timeline || task.dueDate || "",
    status: task.status || "",
    completionDate: task.completionDate || "",
    achievementDay: task.achievementDay || "",
    rating: task.rating || "",
    remarks: task.remarks || ""
  };
}

const psdMeshDefault = ["8#", "10#", "14#", "18#", "30#", "40#", "60#", "Pan"];
const formulationReference = {
  title: "ACMC Formulation calculation and Stock Calculation",
  targetTotal: 26000,
  targetBatch: 1800,
  components: [
    { name: "Delta", stock: 15000, percent: 20, psd: { 50: 0.29, 60: 19.45, 70: 43.1, 80: 34.38, 100: 2.11, 120: 0.64, 200: 0, Pan: 0 } },
    { name: "CNC 60/120", stock: 3500, percent: 5, psd: { 50: 0, 60: 62, 70: 33, 80: 0, 100: 0, 120: 0, 200: 0, Pan: 0 } },
    { name: "EMC 60/100", stock: 4500, percent: 15, psd: { 50: 0, 60: 8, 70: 58, 80: 34, 100: 0, 120: 0, 200: 0, Pan: 0 } },
    { name: "Imported Component", stock: 11000, percent: 6, psd: { 50: 0, 60: 0, 70: 0, 80: 0, 100: 0, 120: 0, 200: 0, Pan: 0 } },
    { name: "Delta 60/100#", stock: 0, percent: 0, psd: { 50: 0, 60: 0, 70: 0, 80: 0, 100: 0, 120: 0, 200: 0, Pan: 0 } },
    { name: "CNC 60/120", stock: 0, percent: 0, psd: { 50: 0, 60: 0, 70: 0, 80: 0, 100: 0, 120: 0, 200: 0, Pan: 0 } },
    { name: "Walnut 60/80", stock: 2000, percent: 5, psd: { 50: 0, 60: 62, 70: 33, 80: 0, 100: 0, 120: 0, 200: 0, Pan: 0 } },
    { name: "EMC Factory100-200", stock: 7000, percent: 15, psd: { 50: 0, 60: 0, 70: 0, 80: 0, 100: 0, 120: 0, 200: 0, Pan: 0 } },
    { name: "Poplar", stock: 5000, percent: 5, psd: { 50: 0, 60: 0, 70: 0, 80: 0, 100: 0, 120: 0, 200: 0, Pan: 0 } }
  ],
  meshes: [
    { mesh: 50, ideal: "<1.5" },
    { mesh: 60, ideal: "13-15" },
    { mesh: 70, ideal: "18-20" },
    { mesh: 80, ideal: "18-20" },
    { mesh: 100, ideal: "15-17" },
    { mesh: 120, ideal: "10-12" },
    { mesh: 200, ideal: "10-12" },
    { mesh: "Pan", ideal: "3-5" }
  ]
};

let state = migrateState(loadState());
let user = JSON.parse(sessionStorage.getItem("emcUser") || "null");
let activePage = "dashboard";
let sharedOnlineAvailable = true;
let rackState = { locations: [], pallets: [], activity: [], products: [] };
let rackView = "dashboard";
let sharedStateVersion = 0;
let liveSeq = 0;
let stateSyncTimer = null;
let liveInputTimer = null;
let applyingRemoteState = false;
let accountUsers = [];
let adminRequests = [];
let adminUnlocked = false;
let adminUnlockTarget = "admin";
let deferredInstallPrompt = null;
let idleTimer = null;
let chatMessages = [];
let chatPollTimer = null;
let mediaRecorder = null;
let recordedAudio = null;
let chatChannel = "group";
let directPeerId = "";
let people = [];
let dashboardSlideTimer = null;
let dashboardClockTimer = null;
let coverDrag = null;
let photoViewerSuppressUntil = 0;
let callSeq = 0;
let activeCall = null;
let peerConnection = null;
let localCallStream = null;
let ringtoneAudio = null;
let ringtoneContext = null;
let ringtoneTimer = null;
let ringbackContext = null;
let ringbackTimer = null;
let callStartedAt = null;
let callDurationTimer = null;
let liveNotificationBuffer = [];
let pendingIncomingCall = null;
let pendingIceCandidates = [];
let handledCallEvents = new Set(JSON.parse(localStorage.getItem("emcHandledCallEvents") || "[]"));
let audioPrimed = false;

function freshState() {
  const products = productSeeds.map(([name, short], idx) => ({
    id: id(), name, short, meshProduct: "", d90: "", d50: "", d10: "", targetKg: 2000,
    specs: psdMeshDefault.map((mesh, i) => ({ mesh, min: i < 2 ? 0 : "", max: i < 2 ? 10 : "", ideal: [2, 8, 24, 30, 10, 10, 8, 8][i] || 0 })),
    blend: defaultBlend(short),
    formulation: defaultFormulation(short)
  }));
  return {
    products,
    stockCategories: [...new Set(stockSeeds.map(([category]) => category))],
    stockVariants: stockSeeds.map(([category, name, opening]) => ({ id: id(), category, name, rawOf: "", psd: {}, opening })),
    stockDays: {},
    machines: [
      { id: id(), name: "CFS 1", screens: 2 },
      { id: id(), name: "MTR 2", screens: 3 },
      { id: id(), name: "MTR 1", screens: 3 }
    ],
    machineDays: {},
    breakdowns: {},
    screenDetails: [],
    activity: {},
    kpi: [],
    tasks: seededReferenceTasks(),
    taskReferenceLoaded: true,
    taskReferenceVersion: TASK_REFERENCE_VERSION,
    longPlans: [],
    ideas: [],
    grn: [],
    grnHeadings: [],
    mesh: meshSeed.map(([mesh, microns, inches, millimeters]) => ({ id: id(), mesh, microns, inches, millimeters })),
    skm: { text: "General notice: Add staff leave, visitor, safety, dispatch, or urgent plant information here.", receipts: [] },
    dashboardPhotos: [],
    dashboardSlideIndex: 0,
    formulationHistory: [],
    format: { size: "14", color: "#12211a", style: "normal" },
    audit: [],
    online: {}
  };
}

function defaultFormulation(short) {
  const clone = JSON.parse(JSON.stringify(formulationReference));
  clone.title = `${short} Formulation calculation and Stock Calculation`;
  clone.targetTotal = "";
  clone.targetBatch = "";
  clone.components = clone.components.map(() => ({ id: id(), name: "", stock: "", percent: "", psd: {} }));
  return clone;
}

function migrateState(existing) {
  const s = existing || freshState();
  s.products ||= [];
  s.stockVariants ||= [];
  s.stockCategories ||= [];
  s.stockCategories = [...new Set([...s.stockCategories, ...s.stockVariants.map(v => v.category).filter(Boolean), ...stockSeeds.map(([category]) => category)])];
  s.stockDays ||= {};
  s.machines ||= [];
  s.machines = s.machines.map(m => ({ ...m, category: normalizeMachineCategory(m.category || "Sieving machine") }));
  s.machineDays ||= {};
  s.breakdowns ||= {};
  s.screenDetails ||= [];
  s.screenDetails = s.screenDetails.map(row => ({ history: [], ...row }));
  s.activity ||= {};
  s.kpi ||= [];
  s.tasks ||= [];
  s.tasks = s.tasks.map(normalizeReferenceTask);
  if (s.taskReferenceVersion !== TASK_REFERENCE_VERSION) {
    const seeded = seededReferenceTasks();
    const seen = new Set(seeded.map(t => `${t.category}|${t.work}|${t.allocationDate}|${t.timeline}`));
    const existingUseful = s.tasks.filter(t => (t.work || t.category) && !seen.has(`${t.category}|${t.work}|${t.allocationDate}|${t.timeline}`));
    s.tasks = [...seeded, ...existingUseful];
    s.taskReferenceLoaded = true;
    s.taskReferenceVersion = TASK_REFERENCE_VERSION;
  }
  s.longPlans ||= [];
  s.ideas ||= [];
  s.ideas = s.ideas.map(i => ({ details: "", attachmentName: "", attachmentData: "", ...i }));
  s.grn ||= [];
  s.grnHeadings ||= [];
  s.grn = s.grn.map(g => ({ custom: {}, ...g }));
  s.mesh ||= meshSeed.map(([mesh, microns, inches, millimeters]) => ({ id: id(), mesh, microns, inches, millimeters }));
  s.skm ||= { text: "SKM instruction: Keep PSD updated for every produced batch and verify closing stock before shift handover.", receipts: [] };
  s.dashboardPhotos ||= [];
  s.dashboardSlideIndex ||= 0;
  if (String(s.skm.text || "").startsWith("SKM instruction:")) {
    s.skm.text = "General notice: Add staff leave, visitor, safety, dispatch, or urgent plant information here.";
    s.skm.receipts = [];
  }
  s.audit ||= [];
  s.formulationHistory ||= [];
  s.format ||= { size: "14", color: "#12211a", style: "normal" };
  s.online ||= {};
  const shouldBlankSeedFormulations = !s.formulationSeedBlanked;
  s.products.forEach(p => {
    p.formulation ||= defaultFormulation(p.short || p.name || "Product");
    p.formulation.components ||= defaultFormulation(p.short || p.name).components;
    p.formulation.meshes ||= defaultFormulation(p.short || p.name).meshes;
    if (shouldBlankSeedFormulations && isSeededReferenceFormulation(p.formulation)) {
      const clean = defaultFormulation(p.short || p.name || "Product");
      p.formulation.targetTotal = clean.targetTotal;
      p.formulation.targetBatch = clean.targetBatch;
      p.formulation.components = clean.components;
    }
  });
  s.formulationSeedBlanked = true;
  stockSeeds.forEach(([category, name, opening], i) => {
    const existing = s.stockVariants.find(v => v.category === category && v.name === name) || s.stockVariants[i];
    if (existing && !existing.name) {
      existing.category = category;
      existing.name = name;
      existing.opening = existing.opening || opening;
    }
    if (!s.stockVariants.some(v => v.category === category && v.name === name)) {
      s.stockVariants.push({ id: id(), category, name, rawOf: "", psd: {}, opening });
    }
  });
  s.machines.forEach(m => {
    m.outputs ||= "";
    m.outputNames ||= Array.from({ length: Number(m.screens || 1) + 1 }, (_, i) => `Output ${i + 1}`);
    m.photo ||= "";
    m.currentSetup ||= Array(m.screens || 1).fill("").join(", ");
    m.spares ||= [
      { id: id(), part: "Screen clamp", specification: "", stock: 0, reorder: 2 },
      { id: id(), part: "Bearing", specification: "", stock: 0, reorder: 1 }
    ];
    m.photoFit ||= { x: 50, y: 50, zoom: 1 };
    m.spares.forEach(s => s.specification ||= "");
  });
  return s;
}

function isSeededReferenceFormulation(formulation) {
  const names = (formulation?.components || []).map(c => String(c.name || "").trim().toLowerCase()).filter(Boolean);
  if (!names.length) return false;
  const seeded = new Set(formulationReference.components.map(c => String(c.name || "").trim().toLowerCase()));
  return names.some(name => seeded.has(name));
}

function defaultBlend(productShort) {
  const materials = ["TNC 10/14#", "TNC 16/20", "TNC 20/25#", "TNC 30/40#", "RLP 40/200#"];
  return materials.map((name, i) => ({
    id: id(), name, stock: stockSeeds.find(s => s[1] === name)?.[2] || 1000,
    percent: [25, 25, 20, 15, 15][i],
    psd: psdMeshDefault.reduce((acc, mesh, j) => {
      acc[mesh] = Math.max(0, Math.min(100, ([0, 5, 20, 30, 20, 15, 8, 2][j] || 0) + i * (j % 3)));
      return acc;
    }, {})
  }));
}

function id() { return Math.random().toString(36).slice(2, 10); }
function today() { return new Date().toISOString().slice(0, 10); }
function clampDate(value) { return value < DATE_MIN ? DATE_MIN : value > DATE_MAX ? DATE_MAX : value; }
function toIsoDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
  if (!match) return "";
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${year}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}
function ratioToPercent(value) {
  const text = String(value || "").trim();
  if (!text) return 0;
  const ratio = text.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/);
  if (ratio && Number(ratio[2])) return Number(ratio[1]) / Number(ratio[2]) * 100;
  const number = Number(text.replace("%", ""));
  return Number.isFinite(number) ? number : 0;
}
function money(n) { return `${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })} kg`; }
function saveState(options = {}) {
  if (isVisitorUser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!options.localOnly && !applyingRemoteState) scheduleSharedStateSync();
}
function loadState() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || freshState(); }
function mergeProtectedState(localState, remoteState) {
  const merged = migrateState(remoteState || {});
  const local = migrateState(localState || {});
  if (!remoteState || !Object.keys(remoteState).length) return local;
  const preferLonger = key => {
    const localRows = Array.isArray(local[key]) ? local[key] : [];
    const remoteRows = Array.isArray(merged[key]) ? merged[key] : [];
    if (localRows.length > remoteRows.length) merged[key] = localRows;
  };
  ["formulationHistory", "tasks", "kpi", "longPlans", "ideas", "grn", "stockVariants", "machines", "screenDetails", "mesh", "audit"].forEach(preferLonger);
  if (Object.keys(local.stockDays || {}).length > Object.keys(merged.stockDays || {}).length) merged.stockDays = local.stockDays;
  if (Object.keys(local.activity || {}).length > Object.keys(merged.activity || {}).length) merged.activity = local.activity;
  if (Object.keys(local.breakdowns || {}).length > Object.keys(merged.breakdowns || {}).length) merged.breakdowns = local.breakdowns;
  if ((local.products || []).length >= (merged.products || []).length) {
    const remoteProducts = new Map((merged.products || []).map(product => [product.id, product]));
    merged.products = (local.products || []).map(product => ({ ...(remoteProducts.get(product.id) || {}), ...product }));
  }
  return migrateState(merged);
}
function q(sel) { return document.querySelector(sel); }
function qa(sel) { return [...document.querySelectorAll(sel)]; }
function apiPath(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (location.protocol === "file:") return `http://127.0.0.1:8891${normalized}`;
  return normalized;
}

function authHeaders() {
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
}

function isAdmin() {
  return user?.role === "Admin";
}

function isVisitorUser() {
  return String(user?.username || "").toLowerCase() === "emc" || String(user?.employeeId || "").toUpperCase() === "EMC";
}

function currentUserName() {
  return user?.displayName || user?.name || "Unknown";
}

function communicationId() {
  if (!user) return "";
  if (user.role === "Admin" && user.displayName) return `admin:${String(user.displayName).trim().toUpperCase()}`;
  return user.id || "";
}

function chooseAdminDisplayName(fallbackPassword = "") {
  return new Promise(resolve => {
    const modal = q("#adminIdentityModal");
    const select = q("#adminIdentitySelect");
    const password = q("#adminIdentityPassword");
    const email = q("#adminIdentityEmail");
    const error = q("#adminIdentityError");
    const confirmBtn = q("#adminIdentityConfirmBtn");
    const recoverBtn = q("#adminIdentityRecoverBtn");
    if (!modal || !select || !confirmBtn) {
      resolve("SD");
      return;
    }
    error.textContent = "";
    select.value = "SD";
    password.value = "";
    email.value = "";
    modal.classList.remove("hidden");
    const finish = async () => {
      const normalized = String(select.value || "").trim().toUpperCase();
      if (!["SD", "PJ", "SKM"].includes(normalized)) {
        error.textContent = "Select SD, PJ, or SKM.";
        return;
      }
      const identityPassword = password.value || fallbackPassword;
      if (!identityPassword) {
        error.textContent = "Enter the personal password for this admin name.";
        return;
      }
      try {
        const response = await fetch(apiPath("/api/admin-identity"), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ identity: normalized, password: identityPassword, email: email.value })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Admin identity verification failed");
      } catch (err) {
        error.textContent = err.message;
        return;
      }
      confirmBtn.onclick = null;
      if (recoverBtn) recoverBtn.onclick = null;
      modal.classList.add("hidden");
      resolve(normalized);
    };
    confirmBtn.onclick = finish;
    if (recoverBtn) recoverBtn.onclick = async () => {
      const normalized = String(select.value || "").trim().toUpperCase();
      try {
        const response = await fetch(apiPath("/api/admin-identity-recovery"), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ identity: normalized, email: email.value, newPassword: password.value || fallbackPassword })
        });
        const data = await response.json();
        error.textContent = data.message || data.error || "Recovery request recorded.";
      } catch {
        error.textContent = "Recovery request could not be sent.";
      }
    };
    [select, password, email].forEach(input => input.onkeydown = event => {
      if (event.key === "Enter") finish();
    });
  });
}

function isEditableElement(element = document.activeElement) {
  return !!element && ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
}

function scheduleSharedStateSync() {
  if (!user || isVisitorUser()) return;
  clearTimeout(stateSyncTimer);
  stateSyncTimer = setTimeout(syncSharedState, 900);
}

async function syncSharedState() {
  if (!user || isVisitorUser()) return;
  try {
    const response = await fetch(apiPath("/api/app-state"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ by: currentUserName(), state })
    });
    if (!response.ok) throw new Error("state sync failed");
    const data = await response.json();
    sharedStateVersion = Math.max(sharedStateVersion, Number(data.version || 0));
  } catch (error) {
    // Local saving still works if shared sync is temporarily unavailable.
  }
}

async function loadSharedStateOnce() {
  try {
    const response = await fetch(apiPath("/api/app-state"), { cache: "no-store" });
    if (!response.ok) throw new Error("shared state unavailable");
    const data = await response.json();
    sharedStateVersion = Number(data.version || 0);
    if (data.state && Object.keys(data.state).length) {
      applyingRemoteState = true;
      const localBeforeRemote = loadState();
      state = mergeProtectedState(localBeforeRemote, data.state);
      saveState({ localOnly: true });
      applyingRemoteState = false;
      if (JSON.stringify(state) !== JSON.stringify(data.state)) syncSharedState();
      render();
    } else {
      syncSharedState();
    }
  } catch (error) {
    // Continue with local state.
  }
}

async function pollSharedState() {
  if (!user) return;
  try {
    const response = await fetch(apiPath("/api/app-state"), { cache: "no-store" });
    if (!response.ok) throw new Error("shared state unavailable");
    const data = await response.json();
    const version = Number(data.version || 0);
    if (data.state && version > sharedStateVersion) {
      sharedStateVersion = version;
      if (!isEditableElement()) {
        applyingRemoteState = true;
        const localBeforeRemote = loadState();
        state = mergeProtectedState(localBeforeRemote, data.state);
        saveState({ localOnly: true });
        applyingRemoteState = false;
        render();
      } else {
        showLiveActivity([{ by: currentUserName(), area: "Shared update", field: "Saved changes", value: "New saved data is available. It will refresh after you finish typing." }]);
      }
    }
  } catch (error) {
    // Shared state polling is best-effort.
  } finally {
    setTimeout(pollSharedState, 2500);
  }
}

async function broadcastLiveEdit(event) {
  if (!user || !event) return;
  try {
    const response = await fetch(apiPath("/api/live"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ userId: user.id, by: currentUserName(), ...event })
    });
    if (response.ok) {
      const data = await response.json();
      liveSeq = Math.max(liveSeq, Number(data.seq || 0));
    }
  } catch (error) {
    // Live typing is best-effort.
  }
}

async function pollLiveEvents() {
  if (!user) return;
  try {
    const response = await fetch(apiPath(`/api/live?since=${liveSeq}`), { cache: "no-store" });
    if (!response.ok) throw new Error("live unavailable");
    const data = await response.json();
    liveSeq = Math.max(liveSeq, Number(data.seq || 0));
    const events = (data.events || []).filter(event => event.userId !== user.id);
    if (events.length) showLiveActivity(events.slice(-4));
  } catch (error) {
    // Continue silently.
  } finally {
    setTimeout(pollLiveEvents, 1000);
  }
}

function startCollaboration() {
  loadSharedStateOnce();
  pollSharedState();
  pollLiveEvents();
}

function showLiveActivity(events) {
  if (!events.length) return;
  events.forEach(applyRemoteLiveEdit);
  liveNotificationBuffer = [...liveNotificationBuffer, ...events.map(event => ({
    at: event.at || new Date().toISOString(),
    title: `${event.by || "Someone"} is editing ${event.area || event.page || "the app"}`,
    detail: `${event.field || "Field"}${event.value ? ` = ${event.value}` : ""}`,
    page: event.page,
    locator: event.locator
  }))].slice(-20);
  renderActivityBell();
}

function applyRemoteLiveEdit(event) {
  if (!event?.locator || event.page !== activePage) return;
  const target = findLiveTarget(event.locator);
  if (!target || target === document.activeElement) return;
  target.value = event.value ?? "";
  if (target.closest("#stockTable")) recalcStockRow(target.closest("tr"));
  target.classList.add("search-field-focus");
  setTimeout(() => target.classList.remove("search-field-focus"), 1600);
}

function findLiveTarget(locator = {}) {
  if (locator.page === "grn" && locator.rowId) {
    const row = q(`#grnTable tr[data-grn="${CSS.escape(locator.rowId)}"]`);
    if (!row) return null;
    if (locator.customId) return row.querySelector(`[data-gcustom="${CSS.escape(locator.customId)}"]`);
    if (locator.field) return row.querySelector(`[data-gfield="${CSS.escape(locator.field)}"]`);
  }
  if (locator.page === "stock" && locator.rowId && locator.field) {
    return q(`#stockTable tr[data-variant="${CSS.escape(locator.rowId)}"] [data-field="${CSS.escape(locator.field)}"]`);
  }
  if (locator.id) return q(`#${CSS.escape(locator.id)}`);
  return null;
}

function audit(action, target, detail) {
  const entry = { id: id(), at: new Date().toISOString(), by: currentUserName(), action, target, detail };
  state.audit.unshift(entry);
  state.audit = state.audit.slice(0, 500);
  saveState();
  if (isVisitorUser()) return;
  postSharedAudit(entry);
}

async function postSharedAudit(entry) {
  try {
    const response = await fetch(apiPath("/api/audit"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(entry)
    });
    if (!response.ok) throw new Error("audit API unavailable");
    const data = await response.json();
    mergeAudit(data.audit || (data.entry ? [data.entry] : []));
  } catch (error) {
    // Local audit remains available when the shared server is offline.
  }
}

async function refreshSharedAudit(renderAfter = false) {
  try {
    const response = await fetch(apiPath("/api/audit"), { cache: "no-store" });
    if (!response.ok) throw new Error("audit API unavailable");
    const data = await response.json();
    mergeAudit(data.audit || []);
    saveState();
    if (activePage === "audit") paintAuditRows();
    if (activePage === "dashboard" && q("#recentAudit")) paintRecentAudit();
    if (renderAfter) render();
  } catch (error) {
    // Keep local audit visible if server audit cannot be reached.
  }
}

function mergeAudit(records) {
  const byId = new Map(state.audit.map(item => [item.id, item]));
  records.forEach(item => {
    if (item?.id) byId.set(item.id, item);
  });
  state.audit = [...byId.values()].sort((a, b) => String(b.at || "").localeCompare(String(a.at || ""))).slice(0, 1000);
}

function requireUser() {
  if (!user) return false;
  if (!user.token) {
    sessionStorage.removeItem("emcUser");
    user = null;
    return false;
  }
  if (user.role === "Admin" && !user.displayName) {
    user.displayName = user.employeeId || "SD";
    sessionStorage.setItem("emcUser", JSON.stringify(user));
  }
  if (user.role === "Admin") adminUnlocked = true;
  q("#loginView").classList.add("hidden");
  q("#appView").classList.remove("hidden");
  q("#userBadge").textContent = `${currentUserName()} signed in${user.role ? ` (${user.role})` : ""}`;
  resetIdleTimer();
  refreshSharedAudit(false);
  heartbeat();
  startCollaboration();
  loadPeople();
  startCallPolling();
  primeCallAudio();
  startDashboardClock();
  setTimeout(showWelcomeAssistant, 350);
  return true;
}

function init() {
  registerServiceWorker();
  bindInstallPrompt();
  setDateLimits();
  q("#loginBtn").onclick = login;
  ["#loginName", "#loginPassword"].forEach(selector => {
    q(selector).onkeydown = event => {
      if (event.key === "Enter") login();
    };
  });
  q("#signupBtn").onclick = signup;
  q("#forgotPasswordBtn").onclick = requestPasswordReset;
  q("#installAppBtn").onclick = installApp;
  q("#adminUnlockBtn").onclick = submitAdminUnlock;
  q("#adminCancelUnlockBtn").onclick = hideAdminUnlockModal;
  q("#adminPanelPassword").onkeydown = event => {
    if (event.key === "Enter") submitAdminUnlock();
  };
  if (q("#newMachineCategory")) q("#newMachineCategory").onchange = toggleNewMachineScreens;
  if (q("#cancelAddMachineBtn")) q("#cancelAddMachineBtn").onclick = closeMachineAddModal;
  q("#showSignInBtn").onclick = () => showLoginMode("signin");
  q("#showSignUpBtn").onclick = () => showLoginMode("signup");
  q("#logoutBtn").onclick = logout;
  q("#exportBtn").onclick = exportData;
  q("#screenshotBtn").onclick = downloadPageScreenshot;
  q("#printPageBtn").onclick = printCurrentPage;
  q("#masterSearch").oninput = render;
  q("#categorySearch").onchange = jumpToCategory;
  q("#activityBell").onclick = toggleActivityBell;
  q("#sendChatBtn").onclick = sendChat;
  q("#recordAudioBtn").onclick = toggleAudioRecording;
  if (q("#commFloatBtn")) q("#commFloatBtn").onclick = toggleCommPanel;
  if (q("#closeCommPanel")) q("#closeCommPanel").onclick = () => q("#commPanel").classList.add("hidden");
  if (q("#minimizeCallBtn")) q("#minimizeCallBtn").onclick = () => q("#commPanel").classList.add("hidden");
  if (q("#fullscreenCallBtn")) q("#fullscreenCallBtn").onclick = toggleCallFullscreen;
  if (q("#sendMiniChatBtn")) q("#sendMiniChatBtn").onclick = sendMiniChat;
  if (q("#commMode")) q("#commMode").onchange = changeCommMode;
  if (q("#commUserSelect")) q("#commUserSelect").onchange = changeCommUser;
  if (q("#startVoiceCallBtn")) q("#startVoiceCallBtn").onclick = () => startVoiceCall(false);
  if (q("#startVideoCallBtn")) q("#startVideoCallBtn").onclick = () => startVoiceCall(true);
  if (q("#hangupVoiceCallBtn")) q("#hangupVoiceCallBtn").onclick = hangupVoiceCall;
  if (q("#acceptCallBtn")) q("#acceptCallBtn").onclick = acceptIncomingCall;
  if (q("#rejectCallBtn")) q("#rejectCallBtn").onclick = rejectIncomingCall;
  bindFormatControls();
  q("#clearSearchBtn").onclick = () => { q("#masterSearch").value = ""; q("#auditFilter").value = ""; render(); };
  buildNav();
  buildCategorySearch();
  bindActions();
  bindActivityBellDrag();
  bindIdleTracking();
  document.addEventListener("pointerdown", primeCallAudio, { once: true });
  document.addEventListener("keydown", primeCallAudio, { once: true });
  document.addEventListener("keydown", protectCasualSourceView, true);
  document.addEventListener("contextmenu", event => {
    if (!q("#loginView")?.classList.contains("hidden")) event.preventDefault();
  }, true);
  document.addEventListener("pointerdown", startMachineCoverDrag);
  document.addEventListener("pointermove", moveMachineCoverDrag);
  document.addEventListener("pointerup", endMachineCoverDrag);
  document.addEventListener("wheel", zoomMachineCover, { passive: false });
  if (requireUser()) render();
}

function protectCasualSourceView(event) {
  const key = String(event.key || "").toLowerCase();
  const loginVisible = !q("#loginView")?.classList.contains("hidden");
  if (!loginVisible) return;
  if ((event.ctrlKey || event.metaKey) && ["u", "s"].includes(key)) {
    event.preventDefault();
    event.stopPropagation();
    q("#loginError").textContent = "Source view is disabled on the login page.";
  }
}

function selectedMachine() {
  return state.machines.find(m => m.id === q("#machineSelect")?.value);
}

function startMachineCoverDrag(event) {
  const img = event.target.closest?.(".machine-cover img");
  if (!img) return;
  const machine = selectedMachine();
  if (!machine || isReadOnlyUser()) return;
  event.preventDefault();
  machine.photoFit ||= { x: 50, y: 50, zoom: 1 };
  coverDrag = { machine, x: event.clientX, y: event.clientY, startX: Number(machine.photoFit.x || 50), startY: Number(machine.photoFit.y || 50), moved: false };
  img.setPointerCapture?.(event.pointerId);
}

function moveMachineCoverDrag(event) {
  if (!coverDrag) return;
  const cover = q(".machine-cover");
  const machine = coverDrag.machine;
  const dx = (event.clientX - coverDrag.x) / Math.max(1, cover?.offsetWidth || 1) * 100;
  const dy = (event.clientY - coverDrag.y) / Math.max(1, cover?.offsetHeight || 1) * 100;
  if (Math.abs(event.clientX - coverDrag.x) > 3 || Math.abs(event.clientY - coverDrag.y) > 3) coverDrag.moved = true;
  machine.photoFit.x = Math.max(0, Math.min(100, coverDrag.startX - dx));
  machine.photoFit.y = Math.max(0, Math.min(100, coverDrag.startY - dy));
  cover?.style.setProperty("--cover-x", `${machine.photoFit.x}%`);
  cover?.style.setProperty("--cover-y", `${machine.photoFit.y}%`);
}

function endMachineCoverDrag() {
  if (!coverDrag) return;
  if (coverDrag.moved) photoViewerSuppressUntil = Date.now() + 350;
  saveMachineCoverFit();
  coverDrag = null;
}

function zoomMachineCover(event) {
  const img = event.target.closest?.(".machine-cover img");
  if (!img) return;
  const machine = selectedMachine();
  if (!machine || isReadOnlyUser()) return;
  event.preventDefault();
  machine.photoFit ||= { x: 50, y: 50, zoom: 1 };
  const next = Number(machine.photoFit.zoom || 1) + (event.deltaY > 0 ? -0.05 : 0.05);
  machine.photoFit.zoom = Math.max(1, Math.min(2.5, Number(next.toFixed(2))));
  q(".machine-cover")?.style.setProperty("--cover-zoom", `${machine.photoFit.zoom}`);
  saveMachineCoverFit();
}

function primeCallAudio() {
  if (audioPrimed) return;
  audioPrimed = true;
  try {
    const audio = new Audio("incoming-call-ringtone.mp3");
    audio.volume = 0;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    }).catch(() => {});
  } catch {}
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // App still works normally when service worker registration is blocked.
    });
  });
}

function bindInstallPrompt() {
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    q("#installAppBtn")?.classList.add("install-ready");
  });
}

async function installApp() {
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isWindows = /Windows/i.test(ua);
  if (isWindows) {
    window.location.href = apiPath("/download/windows-app");
    return;
  }
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    q("#installAppBtn")?.classList.remove("install-ready");
    return;
  }
  if (isAndroid) {
    alert("Android APK cannot be generated from this server without Android build tools. For now, open this same link in Chrome, tap menu, then tap Add to Home screen or Install app. It will run like an app and stay connected online.");
    return;
  }
  window.location.href = apiPath("/download/windows-app");
}

function bindIdleTracking() {
  ["click", "keydown", "mousemove", "scroll", "touchstart", "input", "change"].forEach(eventName => {
    document.addEventListener(eventName, resetIdleTimer, { passive: true });
  });
}

function resetIdleTimer() {
  if (!user?.token) return;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(idleLogout, IDLE_TIMEOUT_MS);
}

function idleLogout() {
  if (!user) return;
  if (user) delete state.online[user.id];
  saveState();
  sessionStorage.removeItem("emcUser");
  user = null;
  q("#appView")?.classList.add("hidden");
  q("#loginView")?.classList.remove("hidden");
  q("#loginError").textContent = "You were idle for 10 minutes. Please sign in again.";
}

function showLoginMode(mode) {
  const signup = mode === "signup";
  q("#signInBox").classList.toggle("hidden", signup);
  q("#signUpBox").classList.toggle("hidden", !signup);
  q("#showSignInBtn").classList.toggle("active", !signup);
  q("#showSignUpBtn").classList.toggle("active", signup);
  q("#loginError").textContent = "";
}

function setDateLimits() {
  qa('input[type="date"]').forEach(input => {
    input.min = DATE_MIN;
    input.max = DATE_MAX;
    input.value = clampDate(today());
  });
}

async function login() {
  const name = q("#loginName").value.trim();
  const pass = q("#loginPassword").value;
  if (!name || !pass) {
    q("#loginError").textContent = `Enter your account and password. Recovery email: ${RECOVERY_EMAIL}`;
    return;
  }
  try {
    const response = await fetch(apiPath("/api/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: name, password: pass })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");
    user = { ...data.user, token: data.token, loginAt: new Date().toISOString() };
    if (user.role === "Admin") {
      user.displayName = await chooseAdminDisplayName(pass) || "SD";
      adminUnlocked = true;
    }
    sessionStorage.setItem("emcUser", JSON.stringify(user));
    audit("login", "access", `Verified account login: ${user.username || user.email || user.employeeId || user.name} as ${currentUserName()}`);
    buildNav();
    buildCategorySearch();
    requireUser();
    render();
  } catch (error) {
    q("#loginError").textContent = `${error.message}. Contact Admin or email recovery: ${RECOVERY_EMAIL}`;
  }
}

async function signup() {
  const name = q("#signupName").value.trim();
  const username = q("#signupUsername").value.trim();
  const email = q("#signupEmail").value.trim();
  const password = q("#signupPassword").value;
  if (!name || !username || !password) {
    q("#loginError").textContent = "Enter full name, username, and password to request approval.";
    return;
  }
  try {
    const response = await fetch(apiPath("/api/signup"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Sign up failed");
    showLoginMode("signin");
    q("#loginError").textContent = data.message || "Request sent. Wait for Admin approval.";
  } catch (error) {
    q("#loginError").textContent = error.message;
  }
}

async function requestPasswordReset() {
  const identifier = q("#loginName").value.trim() || prompt("Enter your username or email for password recovery:");
  if (!identifier) return;
  try {
    const response = await fetch(apiPath("/api/password-reset"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    q("#loginError").textContent = data.message || "Admin has been notified.";
  } catch (error) {
    q("#loginError").textContent = error.message;
  }
}

function unlockAdminPanel() {
  if (adminUnlocked && isAdmin()) return true;
  showAdminUnlockModal("admin");
  return false;
}

function showAdminUnlockModal(target = "admin") {
  adminUnlockTarget = target;
  q("#adminUnlockError").textContent = "";
  q("#adminPanelPassword").value = "";
  q("#adminUnlockModal").classList.remove("hidden");
  setTimeout(() => q("#adminPanelPassword").focus(), 30);
}

function hideAdminUnlockModal() {
  q("#adminUnlockModal").classList.add("hidden");
  q("#adminPanelPassword").value = "";
}

function submitAdminUnlock() {
  const password = q("#adminPanelPassword").value;
  if (password !== "@@##Whatisyourproblem666@@##") {
    q("#adminUnlockError").textContent = "Wrong Admin password.";
    return false;
  }
  if (!isAdmin()) {
    q("#adminUnlockError").textContent = "Password accepted, but you must sign in as Admin first.";
    return false;
  }
  adminUnlocked = true;
  hideAdminUnlockModal();
  activePage = adminUnlockTarget || "admin";
  render();
  return true;
}

function logout() {
  clearTimeout(idleTimer);
  if (user) {
    delete state.online[user.id];
    delete state.online[communicationId()];
  }
  saveState();
  sessionStorage.removeItem("emcUser");
  location.reload();
}

async function heartbeat() {
  if (!user) return;
  try {
    const res = await fetch(apiPath("/api/online"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: communicationId(), accountId: user.id, name: currentUserName(), role: user.role || "" })
    });
    if (!res.ok) throw new Error("online API unavailable");
    const data = await res.json();
    state.online = data.online || {};
    sharedOnlineAvailable = true;
    refreshSharedAudit(false);
  } catch (err) {
    sharedOnlineAvailable = false;
    state.online[communicationId()] = { name: currentUserName(), at: Date.now() };
    for (const [key, entry] of Object.entries(state.online)) {
      if (Date.now() - entry.at > 90000) delete state.online[key];
    }
    saveState();
  }
  renderOnline();
  if (q("#commPanel") && !q("#commPanel").classList.contains("hidden")) loadPeople();
  setTimeout(heartbeat, 20000);
}

function buildNav() {
  q("#nav").innerHTML = visiblePages().map(([key, label]) => `<button data-page="${key}">${label}</button>`).join("");
  q("#nav").onclick = e => {
    const btn = e.target.closest("button[data-page]");
    if (!btn) return;
    if (btn.dataset.page === "admin" && !unlockAdminPanel()) return;
    activePage = btn.dataset.page;
    render();
  };
}

function buildCategorySearch() {
  q("#categorySearch").innerHTML = `<option value="">Category search</option>${visiblePages().map(([key, label]) => `<option value="${key}">${escapeHtml(label)}</option>`).join("")}`;
}

function visiblePages() {
  return isVisitorUser() ? pages.filter(([key]) => key !== "admin") : pages;
}

function jumpToCategory() {
  const page = q("#categorySearch").value;
  if (!page) return;
  activePage = page;
  q("#masterSearch").value = "";
  render();
}

function bindActions() {
  q("#machineSelect").onchange = renderProduction;
  q("#addMachineBtn").onclick = addMachine;
  q("#saveMachineBtn").onclick = saveMachineLibrary;
  q("#addSpareBtn").onclick = addSpare;
  q("#addBreakdownBtn").onclick = addBreakdown;
  q("#addScreenDetailBtn").onclick = addScreenDetail;
  q("#stockDate").onchange = renderStock;
  q("#stockCategory").onchange = renderStock;
  q("#addStockCategoryBtn").onclick = addStockCategory;
  q("#deleteStockCategoryBtn").onclick = deleteStockCategory;
  q("#addVariantBtn").onclick = addVariant;
  q("#saveStockBtn").onclick = saveStockDay;
  q("#refreshRackBtn").onclick = () => loadRackTrack(true);
  q("#addRackPalletBtn").onclick = () => openRackPalletForm();
  q("#cancelRackPalletBtn").onclick = closeRackPalletForm;
  q("#rackPalletForm").onsubmit = saveRackPalletFromForm;
  q("#rackPalletPackaging").onchange = updateRackPackagingFields;
  q("#rackPalletWeight").onchange = updateRackPackagingFields;
  q("#rackPalletSackWeight").oninput = updateRackPackagingFields;
  q("#rackPalletSackCount").oninput = updateRackPackagingFields;
  qa("[data-rack-view]").forEach(btn => btn.onclick = () => {
    rackView = btn.dataset.rackView;
    renderRackTrackPanels();
  });
  q("#rackSearch").oninput = renderRackTrackPanels;
  q("#rackProductFilter").onchange = renderRackTrackPanels;
  q("#rackStatusFilter").onchange = renderRackTrackPanels;
  q("#productSelect").onchange = handleProductFormulationChoice;
  q("#addProductBtn").onclick = addProduct;
  if (q("#addBlendMaterialBtn")) q("#addBlendMaterialBtn").onclick = addBlendMaterial;
  q("#addMeshTopBtn").onclick = addMeshRow;
  q("#autoBlendBtn").onclick = autoBlend;
  q("#newFormulationBtn").onclick = makeNewFormulation;
  q("#saveFormulationBtn").onclick = saveProduct;
  q("#exportFormulationBtn").onclick = exportCurrentFormulation;
  q("#activityDate").onchange = renderActivity;
  q("#addActivityRowBtn").onclick = addActivityRow;
  q("#saveActivityBtn").onclick = saveActivity;
  q("#planDate").onchange = renderTomorrow;
  q("#addPlanRowBtn").onclick = addPlanRow;
  q("#savePlanBtn").onclick = saveTomorrow;
  q("#addTaskBtn").onclick = addTask;
  q("#saveTasksBtn").onclick = saveTasks;
  q("#taskFilter").onchange = renderTaskAllocation;
  q("#taskPersonSearch").oninput = renderTaskAllocation;
  q("#addKpiBtn").onclick = addKpiRow;
  q("#saveKpiBtn").onclick = saveKpi;
  q("#kpiPeriod").onchange = renderKpi;
  q("#kpiAnchorDate").onchange = renderKpi;
  q("#kpiCategoryFilter").onchange = renderKpi;
  q("#addLongPlanBtn").onclick = addLongPlan;
  q("#saveLongPlansBtn").onclick = saveLongPlans;
  q("#addIdeaBtn").onclick = addIdea;
  q("#saveIdeasBtn").onclick = saveIdeas;
  q("#saveSkmBtn").onclick = saveSkm;
  q("#addGrnBtn").onclick = addGrn;
  q("#saveGrnBtn").onclick = saveGrn;
  q("#addGrnHeadingBtn").onclick = addGrnHeading;
  q("#deleteGrnHeadingBtn").onclick = deleteGrnHeading;
  q("#addUserBtn").onclick = addUserRow;
  q("#saveUsersBtn").onclick = saveUsers;
  q("#refreshBackupsBtn").onclick = loadBackups;
  q("#refreshChatArchiveBtn").onclick = loadAdminChatArchive;
  const saveMeshBtn = q("#saveMeshBtn");
  if (saveMeshBtn) saveMeshBtn.onclick = saveMesh;
  q("#auditFilter").onchange = renderAudit;
  q("#dashDate").onchange = renderDashboard;
  if (q("#dashboardPhotoUpload")) q("#dashboardPhotoUpload").onchange = addDashboardPhotos;
  if (q("#clearDashboardPhotosBtn")) q("#clearDashboardPhotosBtn").onclick = clearDashboardPhotos;
}

function bindFormatControls() {
  applyFormatControls();
  q("#fontSizeControl").value = state.format.size || "14";
  q("#fontColorControl").value = state.format.color || "#12211a";
  q("#fontStyleControl").value = state.format.style || "normal";
  ["#fontSizeControl", "#fontColorControl", "#fontStyleControl"].forEach(selector => {
    q(selector).onchange = () => {
      state.format = {
        size: q("#fontSizeControl").value,
        color: q("#fontColorControl").value,
        style: q("#fontStyleControl").value
      };
      applyFormatControls();
      saveState();
    };
  });
}

function applyFormatControls() {
  const fmt = state.format || {};
  document.documentElement.style.setProperty("--edit-font-size", `${fmt.size || 14}px`);
  document.documentElement.style.setProperty("--edit-color", fmt.color || "#12211a");
  document.documentElement.style.setProperty("--edit-font-style", String(fmt.style || "").includes("italic") ? "italic" : "normal");
  document.documentElement.style.setProperty("--edit-font-weight", String(fmt.style || "").includes("bold") ? "800" : "400");
}

function render() {
  if (activePage === "admin" && !adminUnlocked && !unlockAdminPanel()) activePage = "dashboard";
  qa(".page").forEach(p => p.classList.toggle("active", p.id === activePage));
  qa("#nav button").forEach(b => b.classList.toggle("active", b.dataset.page === activePage));
  q("#pageTitle").textContent = pages.find(p => p[0] === activePage)?.[1] || "Dashboard";
  q("#categorySearch").value = activePage;
  renderOnline();
  renderDashboard();
  if (activePage === "production") renderProduction();
  if (activePage === "stock") renderStock();
  if (activePage === "formulation") renderFormulation();
  if (activePage === "racktrack") renderRackTrack();
  if (activePage === "activity") renderActivity();
  if (activePage === "tomorrow") renderTomorrow();
  if (activePage === "taskAllocation") renderTaskAllocation();
  if (activePage === "kpi") renderKpi();
  if (activePage === "longPlans") renderLongPlans();
  if (activePage === "notification") renderNotification();
  if (activePage === "chat") renderChat();
  if (activePage === "ideas") renderIdeas();
  if (activePage === "grn") renderGrn();
  if (activePage === "mesh") renderMesh();
  if (activePage === "audit") renderAudit();
  if (activePage === "admin") renderUsers();
  renderMasterSearch();
  applyReadOnlyMode();
}

function isReadOnlyUser() {
  if (isVisitorUser()) return false;
  return !!(user?.readOnly || user?.status === "Disabled" || user?.role === "View only");
}

function applyReadOnlyMode() {
  const existing = q("#readOnlyBanner");
  if (!isReadOnlyUser()) {
    existing?.remove();
    qa("[data-readonly-lock]").forEach(element => {
      element.disabled = false;
      element.removeAttribute("data-readonly-lock");
    });
    return;
  }
  if (!existing && q("#appView")) {
    q(".workspace").insertAdjacentHTML("afterbegin", `<div id="readOnlyBanner" class="notice readonly-notice">Read-only access: you can view data and use Team Chat, but you cannot edit, save, upload, or delete app records.</div>`);
  }
  const editSelector = [
    "[data-field]", "[data-spare-field]", "[data-break-field]", "[data-comp-name]", "[data-meta]", "[data-mesh-field]",
    "[data-afield]", "[data-task-field]", "[data-kpi-field]", "[data-long-field]", "[data-ifield]", "[data-gfield]", "[data-gcustom]", "[data-screen-field]", "[data-user-field]",
    "[data-delete-activity]", "[data-delete-component]", "[data-delete-mesh]", "[data-delete-spare]", "[data-delete-breakdown]", "[data-delete-screen-row]", "[data-delete-idea]",
    "[data-delete-grn]", "[data-delete-task]", "[data-delete-kpi]", "[data-delete-long-plan]", "[data-delete-variant]",
    "[data-edit-rack-pallet]", "[data-delete-rack-pallet]", "[data-rack-add-location]",
    "input[type='file']:not(#chatFile)"
  ].join(",");
  qa(editSelector).forEach(element => {
    element.disabled = true;
    element.setAttribute("data-readonly-lock", "1");
  });
  qa("button").forEach(button => {
    const idText = button.id || "";
    const actionText = `${idText} ${button.dataset ? Object.keys(button.dataset).join(" ") : ""} ${button.textContent || ""}`.toLowerCase();
    const allowed = button.closest("#chat") || button.closest("nav") || button.closest(".top-actions") || button.closest("#activityBellPanel") || button.id === "activityBell";
    const editAction = /(add|save|delete|edit|upload|publish|approve|disable|remove|auto suggest|new formulation|record|refresh rack)/.test(actionText);
    if (!allowed && editAction) {
      button.disabled = true;
      button.setAttribute("data-readonly-lock", "1");
    }
  });
}

function renderOnline() {
  const online = Object.values(state.online).filter(x => Date.now() - x.at < 90000);
  q("#onlineUsers").textContent = `${online.length} online`;
  q("#onlineList").innerHTML = online.map(x => `<span class="chip">${escapeHtml(x.name)}</span>`).join("") || "<p>No active users.</p>";
  if (!sharedOnlineAvailable) q("#onlineList").innerHTML += `<p class="muted-note">Shared online list works after Railway deployment.</p>`;
}

function istNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function formatIstDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  const time = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  return { date, time };
}

function startDashboardClock() {
  updateDashboardClock();
  clearInterval(dashboardClockTimer);
  dashboardClockTimer = setInterval(updateDashboardClock, 1000);
}

function updateDashboardClock() {
  const box = q("#dashboardClock");
  if (!box) return;
  const { date, time } = formatIstDateTime();
  box.innerHTML = `<span>${escapeHtml(date)}</span><span>${escapeHtml(time)} <small>IST</small></span>`;
}

function greetingForNow() {
  const hour = istNow().getHours();
  if (hour < 12) return { title: `Good Morning ${currentUserName()}!`, line: "Have a productive day." };
  if (hour < 17) return { title: `Good Afternoon ${currentUserName()}!`, line: "How is your day going?" };
  return { title: `Good Evening ${currentUserName()}!`, line: "Hope the day is moving well." };
}

function showWelcomeAssistant() {
  if (!user) return;
  const key = `emcWelcome.${user.id}.${currentUserName()}.${user.loginAt || ""}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "shown");
  const greeting = greetingForNow();
  let overlay = q("#welcomeAssistantOverlay");
  if (!overlay) {
    document.body.insertAdjacentHTML("beforeend", `<div id="welcomeAssistantOverlay" class="modal-overlay hidden"><section class="modal-card welcome-card"><h3 id="welcomeAssistantTitle"></h3><p id="welcomeAssistantLine"></p><textarea id="welcomeAssistantReply" placeholder="Optional reply..."></textarea><div id="welcomeAssistantResponse" class="welcome-reply hidden"></div><div class="modal-actions"><button id="welcomeAssistantSend" type="button">Reply</button><button id="welcomeAssistantClose" class="ghost" type="button">Close</button></div></section></div>`);
    q("#welcomeAssistantClose").onclick = () => q("#welcomeAssistantOverlay").classList.add("hidden");
    q("#welcomeAssistantSend").onclick = handleWelcomeReply;
  }
  q("#welcomeAssistantTitle").textContent = greeting.title;
  q("#welcomeAssistantLine").textContent = greeting.line;
  q("#welcomeAssistantReply").value = "";
  q("#welcomeAssistantResponse").classList.add("hidden");
  overlay.classList.remove("hidden");
}

function handleWelcomeReply() {
  const text = q("#welcomeAssistantReply")?.value.trim() || "";
  const box = q("#welcomeAssistantResponse");
  if (!box) return;
  const lower = text.toLowerCase();
  let response = "Noted. I am here with the dashboard when you need to organize the next step.";
  if (!text) response = "No problem. Wishing you a smooth and productive shift.";
  else if (/(not good|bad|stress|tension|problem|tired|sad|angry|worried|pressure)/.test(lower)) response = "I am sorry the day is heavy. What is the main reason: workload, people issue, machine problem, stock problem, or something personal?";
  else if (/(machine|breakdown|screen|spare)/.test(lower)) response = "That sounds like a machinery concern. You may want to open Machinery Library and record the issue, spare need, and screen status while it is fresh.";
  else if (/(stock|material|grn|shortage|consumption)/.test(lower)) response = "That sounds stock-related. Check Raw Material Stock or Incoming / Outgoing Material first, then update the exact quantity so everyone sees the same picture.";
  else if (/(good|fine|great|ok|okay|excellent|productive)/.test(lower)) response = "Good to hear. Keep the updates clean and timely; that will make the whole team faster today.";
  else if (/(why|because|reason)/.test(lower)) response = "Tell me the cause in one line, then decide one small action you can take in the next 15 minutes. That usually clears the first knot.";
  box.textContent = response;
  box.classList.remove("hidden");
}

function renderDashboard() {
  const date = q("#dashDate").value || clampDate(today());
  updateDashboardClock();
  const allRows = state.stockVariants.map(v => stockRowFor(v, date));
  const total = allRows.reduce((sum, row) => sum + row.closing, 0);
  const low = allRows.filter(row => row.closing < 1000).length;
  const machineAttention = state.machines.filter(m => machineRisk(m).level !== "Stable").length;
  const good = goodPerformer();
  const poor = poorPerformer();
  const criticalSpares = criticalSpareRows();
  q("#metricStock").textContent = money(total);
  q("#metricLow").textContent = low;
  q("#metricMachines").textContent = machineAttention;
  q("#metricIdeas").textContent = state.ideas.filter(i => i.status !== "Approved").length;
  q("#metricGoodPerformer").textContent = good ? `${good.name} ${good.score.toFixed(0)}%` : "-";
  q("#metricPoorPerformer").textContent = poor ? `${poor.name} ${poor.score.toFixed(0)}%` : "-";
  q("#metricCriticalSpares").textContent = criticalSpares.length;
  const visitorNotice = q("#visitorNotice");
  if (visitorNotice) {
    visitorNotice.classList.toggle("hidden", !isVisitorUser());
    visitorNotice.innerHTML = "<strong>Visitor trial mode:</strong> You can edit and test app features, but nothing will be saved. All visitor changes disappear after logout or refresh. Admin page is not available.";
  }
  renderDashboardSlideshow();
  const receipt = state.skm.receipts.find(r => r.userId === user?.id);
  q("#skmNotice").innerHTML = `${escapeHtml(state.skm.text)}<small>${receipt ? `Read by you on ${new Date(receipt.at).toLocaleString()}` : '<button id="markReadBtn" class="ghost">Mark as read</button>'}</small>`;
  const mark = q("#markReadBtn");
  if (mark) mark.onclick = markSkmRead;
  const machines = state.machines.map(m => `${m.name}: ${cleanSetup(m.currentSetup) || "No current setup"} (${machineRisk(m).level})`);
  q("#dashSummary").innerHTML = [
    `<div class="summary-item"><strong>${date}</strong><br>Total raw material available: ${money(total)}; total variants: ${state.stockVariants.length}; critical raw materials: ${low}</div>`,
    `<div class="summary-item"><strong>Machinery library</strong><br>${machines.join("<br>") || "No machinery saved."}</div>`,
    `<div class="summary-item"><strong>Critical spare stocks</strong><br>${criticalSpares.slice(0, 6).map(s => `${escapeHtml(s.machine)} - ${escapeHtml(s.part)}: ${s.stock}/${s.reorder}`).join("<br>") || "No spare below minimum."}</div>`
  ].join("");
  const currentDay = today();
  q("#dashTodayActivity").innerHTML = dashboardActivityHtml(currentDay, "work", "No activity log saved for today.");
  q("#dashTomorrowPlan").innerHTML = dashboardActivityHtml(dateOffset(currentDay, 1), "plan", "No tomorrow plan saved.");
  paintRecentAudit();
  renderActivityBell();
}

function renderDashboardSlideshow() {
  const box = q("#dashboardSlideshow");
  const strip = q("#dashboardPhotoStrip");
  if (!box || !strip) return;
  const photos = state.dashboardPhotos || [];
  const canEdit = isAdmin() && !isVisitorUser();
  q("#dashboardPhotoUpload")?.classList.toggle("hidden", !canEdit);
  q("#dashboardPhotoUploadLabel")?.classList.toggle("hidden", !canEdit);
  q("#clearDashboardPhotosBtn")?.classList.toggle("hidden", !canEdit || !photos.length);
  if (!photos.length) {
    box.innerHTML = `<div class="slideshow-empty">Admin can upload factory photos here. Photos will rotate every 3 seconds.</div>`;
    strip.innerHTML = "";
    clearInterval(dashboardSlideTimer);
    dashboardSlideTimer = null;
    return;
  }
  state.dashboardSlideIndex = Number(state.dashboardSlideIndex || 0) % photos.length;
  const photo = photos[state.dashboardSlideIndex];
  box.innerHTML = `<img src="${escapeAttr(photo.data)}" alt="${escapeAttr(photo.name || "Factory photo")}" data-fullscreen-photo><div class="slide-caption">${escapeHtml(photo.name || "Factory photo")}</div>`;
  strip.innerHTML = photos.map((p, index) => `<button class="photo-thumb ${index === state.dashboardSlideIndex ? "active" : ""}" data-dashboard-photo="${index}" type="button"><img src="${escapeAttr(p.data)}" alt="${escapeAttr(p.name || "")}">${canEdit ? `<span data-delete-dashboard-photo="${p.id}">Delete</span>` : ""}</button>`).join("");
  if (!dashboardSlideTimer) {
    dashboardSlideTimer = setInterval(() => {
      if (activePage !== "dashboard" || !(state.dashboardPhotos || []).length) return;
      state.dashboardSlideIndex = (Number(state.dashboardSlideIndex || 0) + 1) % state.dashboardPhotos.length;
      renderDashboardSlideshow();
    }, 3000);
  }
}

function addDashboardPhotos(event) {
  const files = [...(event.target.files || [])].filter(file => file.type.startsWith("image/"));
  if (!files.length || !isAdmin()) return;
  let remaining = files.length;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      state.dashboardPhotos ||= [];
      state.dashboardPhotos.push({ id: id(), name: file.name, data: reader.result, at: new Date().toISOString() });
      remaining -= 1;
      if (!remaining) {
        audit("save", "dashboard photos", `${files.length} photo(s) added`);
        saveState();
        renderDashboard();
      }
    };
    reader.readAsDataURL(file);
  });
  event.target.value = "";
}

function clearDashboardPhotos() {
  if (!isAdmin()) return;
  state.dashboardPhotos = [];
  state.dashboardSlideIndex = 0;
  audit("delete", "dashboard photos", "Cleared all photos");
  saveState();
  renderDashboard();
}

async function renderChat() {
  await loadChat();
  if (!chatPollTimer) chatPollTimer = setInterval(() => {
    if (user?.token && activePage === "chat") loadChat();
  }, 2500);
}

async function loadChat() {
  if (!user?.token) return;
  try {
    const query = chatChannel === "direct" ? `?channel=direct&peerId=${encodeURIComponent(directPeerId)}` : "?channel=group";
    const response = await fetch(apiPath(`/api/chat${query}`), { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Chat unavailable");
    chatMessages = data.messages || [];
    paintChat();
    paintMiniChat();
  } catch (error) {
    q("#chatStatus").textContent = error.message;
  }
}

function paintChat() {
  const box = q("#chatMessages");
  if (!box) return;
  box.innerHTML = chatMessages.map(message => chatMessageHtml(message)).join("") || "<p>No chat messages yet.</p>";
  box.scrollTop = box.scrollHeight;
}

function chatMessageHtml(message) {
  const mine = message.userId === user?.id;
  const ageMs = Date.now() - new Date(message.at).getTime();
  const canUnsend = !message.unsent && (isAdmin() || (mine && ageMs <= 60 * 60 * 1000));
  const attachment = message.attachment ? attachmentHtml(message.attachment) : "";
  const audio = message.audio ? `<audio controls src="${message.audio.data}"></audio>` : "";
  return `<div class="chat-message ${mine ? "mine" : ""}">
    <strong>${escapeHtml(message.by || "User")}</strong><small>${formatDateTime(message.at)}</small>
    ${message.unsent ? `<em>Message unsent</em>` : `<p>${escapeHtml(message.text || "")}</p>${message.sticker ? `<span class="chat-sticker">${escapeHtml(message.sticker)}</span>` : ""}${attachment}${audio}`}
    ${canUnsend ? `<button class="ghost tiny-btn" data-unsend-chat="${message.id}">Unsend</button>` : ""}
  </div>`;
}

function attachmentHtml(file) {
  if (!file?.data) return "";
  if (String(file.type || "").startsWith("image/")) return `<a class="chat-attachment" download="${escapeAttr(file.name)}" href="${file.data}"><img src="${file.data}" alt="${escapeAttr(file.name)}"><span>${escapeHtml(file.name)}</span></a>`;
  if (String(file.type || "").startsWith("video/")) return `<video class="chat-video" controls src="${file.data}"></video><a download="${escapeAttr(file.name)}" href="${file.data}">${escapeHtml(file.name)}</a>`;
  return `<a class="file-link" download="${escapeAttr(file.name)}" href="${file.data}">${escapeHtml(file.name)}</a>`;
}

async function sendChat() {
  const text = q("#chatText").value.trim();
  const file = q("#chatFile").files[0];
  const attachment = file ? await fileToData(file) : null;
  const payload = { text, attachment, audio: recordedAudio, channel: chatChannel, peerId: directPeerId };
  if (!payload.text && !payload.attachment && !payload.audio) {
    q("#chatStatus").textContent = "Type a message, record audio, choose a sticker, or attach a file.";
    return;
  }
  try {
    const response = await fetch(apiPath("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Chat send failed");
    chatMessages = data.messages || chatMessages;
    q("#chatText").value = "";
    q("#chatFile").value = "";
    recordedAudio = null;
    q("#chatStatus").textContent = "Message sent.";
    paintChat();
  } catch (error) {
    q("#chatStatus").textContent = error.message;
  }
}

async function sendSticker(sticker) {
  try {
    const response = await fetch(apiPath("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ sticker, channel: chatChannel, peerId: directPeerId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Sticker send failed");
    chatMessages = data.messages || chatMessages;
    paintChat();
  } catch (error) {
    q("#chatStatus").textContent = error.message;
  }
}

function fileToData(file) {
  return new Promise((resolve, reject) => {
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("Attachment limit is 8 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type || "application/octet-stream", data: reader.result });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function toggleAudioRecording() {
  if (mediaRecorder?.state === "recording") {
    mediaRecorder.stop();
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => chunks.push(event.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" });
      const reader = new FileReader();
      reader.onload = () => {
        recordedAudio = { name: `audio-note-${Date.now()}.webm`, type: blob.type, data: reader.result };
        q("#chatStatus").textContent = "Audio note ready. Click Send chat.";
      };
      reader.readAsDataURL(blob);
      stream.getTracks().forEach(track => track.stop());
      q("#recordAudioBtn").textContent = "Record audio note";
    };
    mediaRecorder.start();
    q("#recordAudioBtn").textContent = "Stop recording";
    q("#chatStatus").textContent = "Recording audio note...";
  } catch (error) {
    q("#chatStatus").textContent = `Audio recording blocked: ${error.message}`;
  }
}

async function unsendChat(messageId) {
  try {
    const response = await fetch(apiPath(`/api/chat/${encodeURIComponent(messageId)}`), { method: "DELETE", headers: authHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not unsend");
    chatMessages = data.messages || chatMessages;
    paintChat();
  } catch (error) {
    q("#chatStatus").textContent = error.message;
  }
}

async function loadPeople() {
  if (!user?.token) return;
  try {
    const response = await fetch(apiPath("/api/people"), { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load users");
    const me = communicationId();
    people = (data.users || []).filter(person => person.id !== me && !(isAdmin() && person.id === user.id));
    renderPeopleSelect();
  } catch {}
}

function renderPeopleSelect() {
  const select = q("#commUserSelect");
  if (!select) return;
  select.innerHTML = `<option value="">Select user</option>${people.map(person => `<option value="${person.id}">${escapeHtml(person.name || person.username || person.employeeId)}</option>`).join("")}`;
  if (directPeerId) select.value = directPeerId;
}

function toggleCommPanel() {
  if (!q("#commPanel")) return;
  q("#commPanel").classList.toggle("hidden");
  loadPeople();
  loadChat();
}

function toggleCallFullscreen() {
  const panel = q("#commPanel");
  if (!panel) return;
  panel.classList.toggle("call-fullscreen");
  q("#fullscreenCallBtn").textContent = panel.classList.contains("call-fullscreen") ? "Exit full" : "Full screen";
}

function changeCommMode() {
  if (!q("#commMode")) return;
  chatChannel = q("#commMode").value;
  if (q("#commUserSelect")) q("#commUserSelect").disabled = chatChannel !== "direct";
  loadChat();
}

function changeCommUser() {
  if (!q("#commUserSelect")) return;
  directPeerId = q("#commUserSelect").value;
  chatChannel = directPeerId ? "direct" : q("#commMode").value;
  if (q("#commMode")) q("#commMode").value = chatChannel;
  loadChat();
}

async function sendMiniChat() {
  const textBox = q("#miniChatText");
  if (!textBox) return;
  const text = textBox.value.trim();
  if (!text) return;
  try {
    const response = await fetch(apiPath("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ text, channel: chatChannel, peerId: directPeerId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Message failed");
    chatMessages = data.messages || chatMessages;
    textBox.value = "";
    paintMiniChat();
  } catch (error) {
    q("#callStatus").textContent = error.message;
  }
}

function paintMiniChat() {
  const box = q("#miniChatMessages");
  if (!box) return;
  box.innerHTML = chatMessages.slice(-20).map(message => `<div class="mini-chat-row ${message.userId === user?.id ? "mine" : ""}"><strong>${escapeHtml(message.by || "")}</strong><br>${message.unsent ? "<em>Message unsent</em>" : escapeHtml(message.text || message.sticker || message.attachment?.name || message.audio?.name || "")}</div>`).join("") || "<p>No messages.</p>";
  box.scrollTop = box.scrollHeight;
}

function startCallPolling() {
  if (startCallPolling.timer || !user?.token) return;
  startCallPolling.timer = setInterval(pollCallEvents, 2000);
}

async function pollCallEvents() {
  if (!user?.token) return;
  try {
    const response = await fetch(apiPath(`/api/calls?since=${callSeq}`), { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) return;
    callSeq = Math.max(callSeq, Number(data.seq || 0));
    for (const event of data.events || []) await handleCallEvent(event);
  } catch {}
}

async function sendCallEvent(to, type, payload = {}, callId = activeCall?.id || id()) {
  const response = await fetch(apiPath("/api/calls"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ to, type, payload, callId })
  });
  return response.json();
}

function sessionDescription(payload) {
  return payload?.description || payload;
}

async function startVoiceCall(withVideo = false) {
  const to = q("#commUserSelect")?.value || "";
  if (!to) {
    if (q("#callStatus")) q("#callStatus").textContent = "Select a user to call.";
    return;
  }
  activeCall = { id: id(), peerId: to, incoming: false, video: !!withVideo };
  pendingIceCandidates = [];
  await preparePeerConnection(to, { video: withVideo });
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  await sendCallEvent(to, "offer", { description: offer, video: !!withVideo }, activeCall.id);
  startRingbackTone();
  if (q("#callStatus")) q("#callStatus").textContent = `${withVideo ? "Video" : "Voice"} calling... waiting for answer`;
}

async function preparePeerConnection(peerId, options = {}) {
  closePeerConnectionOnly({ preserveIce: options.preserveIce });
  try {
    localCallStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: !!options.video });
  } catch (error) {
    if (options.video) {
      localCallStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (q("#callStatus")) q("#callStatus").textContent = "Camera unavailable, continuing as voice call.";
      options.video = false;
    } else {
      throw error;
    }
  }
  q("#callVideoGrid")?.classList.toggle("hidden", !options.video);
  if (q("#localCallVideo")) q("#localCallVideo").srcObject = options.video ? localCallStream : null;
  peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
  localCallStream.getTracks().forEach(track => peerConnection.addTrack(track, localCallStream));
  peerConnection.ontrack = event => {
    const stream = event.streams[0];
    const hasVideo = stream?.getVideoTracks?.().length;
    const audio = q("#remoteCallAudio");
    if (audio) {
      audio.srcObject = stream;
      audio.muted = false;
      audio.volume = 1;
      audio.setAttribute("playsinline", "true");
      audio.play().catch(() => {
        if (q("#callStatus")) q("#callStatus").textContent = "Call connected. Tap the call panel if audio is muted by browser.";
      });
    }
    if (hasVideo && q("#remoteCallVideo")) {
      q("#callVideoGrid")?.classList.remove("hidden");
      q("#remoteCallVideo").srcObject = stream;
      q("#remoteCallVideo").muted = true;
      q("#remoteCallVideo").play().catch(() => {});
    }
  };
  peerConnection.onicecandidate = event => {
    if (event.candidate) sendCallEvent(peerId, "ice", event.candidate, activeCall?.id);
  };
  peerConnection.onconnectionstatechange = () => {
    const status = peerConnection?.connectionState || "";
    if (status === "connected") startCallDuration();
    if (status === "failed" || status === "disconnected" || status === "closed") {
      if (q("#callStatus")) q("#callStatus").textContent = `Call ${status}.`;
    }
  };
}

async function handleCallEvent(event) {
  const eventKey = `${event.seq || ""}:${event.callId || ""}:${event.type || ""}`;
  if (handledCallEvents.has(eventKey)) return;
  handledCallEvents.add(eventKey);
  handledCallEvents = new Set([...handledCallEvents].slice(-200));
  localStorage.setItem("emcHandledCallEvents", JSON.stringify([...handledCallEvents]));
  if (event.at && Date.now() - new Date(event.at).getTime() > 120000 && event.type === "offer") return;
  if (event.type === "offer") {
    if (activeCall?.id === event.callId || pendingIncomingCall?.callId === event.callId) return;
    showIncomingCall(event);
  }
  if (event.type === "answer" && peerConnection) {
    stopRingbackTone();
    playCallEffect("pickup");
    if (activeCall?.video && event.payload?.video === false && q("#callStatus")) q("#callStatus").textContent = "Receiver camera unavailable; continuing as voice call.";
    await peerConnection.setRemoteDescription(new RTCSessionDescription(sessionDescription(event.payload)));
    await flushPendingIce();
    startCallDuration();
  }
  if (event.type === "ice") {
    if (!peerConnection) {
      if (pendingIncomingCall?.callId === event.callId || activeCall?.id === event.callId) pendingIceCandidates.push(event.payload);
      return;
    }
    try {
      if (peerConnection.remoteDescription) await peerConnection.addIceCandidate(new RTCIceCandidate(event.payload));
      else pendingIceCandidates.push(event.payload);
    } catch {}
  }
  if (event.type === "hangup") {
    closeCall();
    if (q("#callStatus")) q("#callStatus").textContent = "Call ended.";
  }
}

function showIncomingCall(event) {
  pendingIncomingCall = event;
  q("#commPanel")?.classList.remove("hidden");
  const isVideo = !!event.payload?.video;
  q("#incomingCallName").textContent = `${event.fromName || "Someone"} is calling`;
  q("#incomingCallSub").textContent = `Incoming EMC app ${isVideo ? "video" : "voice"} call`;
  q("#incomingCallCard")?.classList.remove("hidden");
  if (q("#callStatus")) q("#callStatus").textContent = `${event.fromName || "Someone"} is calling...`;
  startRingtone();
}

async function acceptIncomingCall() {
  const event = pendingIncomingCall;
  if (!event) return;
  stopRingtone();
  playCallEffect("pickup");
  q("#incomingCallCard")?.classList.add("hidden");
  pendingIncomingCall = null;
  const isVideo = !!event.payload?.video;
  activeCall = { id: event.callId, peerId: event.from, incoming: true, video: isVideo };
  q("#commPanel")?.classList.remove("hidden");
  await preparePeerConnection(event.from, { video: isVideo, preserveIce: true });
  await peerConnection.setRemoteDescription(new RTCSessionDescription(sessionDescription(event.payload)));
  await flushPendingIce();
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  await sendCallEvent(event.from, "answer", { description: answer, video: !!localCallStream?.getVideoTracks?.().length }, event.callId);
  startCallDuration();
}

async function rejectIncomingCall() {
  const event = pendingIncomingCall;
  stopRingtone();
  playCallEffect("hangup");
  q("#incomingCallCard")?.classList.add("hidden");
  pendingIncomingCall = null;
  if (event) await sendCallEvent(event.from, "hangup", {}, event.callId);
  if (q("#callStatus")) q("#callStatus").textContent = "Call rejected.";
}

async function hangupVoiceCall() {
  if (activeCall?.peerId) await sendCallEvent(activeCall.peerId, "hangup", {}, activeCall.id);
  closeCall();
}

function closeCall() {
  stopRingtone();
  stopRingbackTone();
  stopCallDuration();
  playCallEffect("hangup");
  q("#incomingCallCard")?.classList.add("hidden");
  pendingIncomingCall = null;
  closePeerConnectionOnly();
  activeCall = null;
  if (q("#remoteCallAudio")) q("#remoteCallAudio").srcObject = null;
}

function closePeerConnectionOnly(options = {}) {
  peerConnection?.close();
  peerConnection = null;
  localCallStream?.getTracks().forEach(track => track.stop());
  localCallStream = null;
  if (q("#localCallVideo")) q("#localCallVideo").srcObject = null;
  if (q("#remoteCallVideo")) q("#remoteCallVideo").srcObject = null;
  q("#callVideoGrid")?.classList.add("hidden");
  if (!options.preserveIce) pendingIceCandidates = [];
}

async function flushPendingIce() {
  if (!peerConnection?.remoteDescription) return;
  const items = pendingIceCandidates.splice(0);
  for (const candidate of items) {
    try { await peerConnection.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
  }
}

function startRingtone() {
  stopRingtone();
  ringtoneAudio = new Audio("incoming-call-ringtone.mp3");
  ringtoneAudio.loop = true;
  ringtoneAudio.volume = 1;
  ringtoneAudio.play().catch(() => startGeneratedRingtone());
}

function startRingbackTone() {
  stopRingbackTone();
  try {
    ringbackContext = new (window.AudioContext || window.webkitAudioContext)();
    const playRingback = () => {
      const oscillator = ringbackContext.createOscillator();
      const gain = ringbackContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, ringbackContext.currentTime);
      gain.gain.setValueAtTime(0.001, ringbackContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ringbackContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ringbackContext.currentTime + 0.9);
      oscillator.connect(gain);
      gain.connect(ringbackContext.destination);
      oscillator.start();
      oscillator.stop(ringbackContext.currentTime + 1);
    };
    playRingback();
    ringbackTimer = setInterval(playRingback, 2400);
  } catch {}
}

function stopRingbackTone() {
  clearInterval(ringbackTimer);
  ringbackTimer = null;
  if (ringbackContext) {
    ringbackContext.close().catch(() => {});
    ringbackContext = null;
  }
}

function playCallEffect(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const tones = type === "pickup" ? [660, 880] : [440, 220];
    tones.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.13, ctx.currentTime + index * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.12);
      osc.stop(ctx.currentTime + index * 0.12 + 0.12);
    });
    setTimeout(() => ctx.close().catch(() => {}), 520);
  } catch {}
}

function startGeneratedRingtone() {
  stopGeneratedRingtone();
  try {
    ringtoneContext = new (window.AudioContext || window.webkitAudioContext)();
    const playTone = () => {
      const oscillator = ringtoneContext.createOscillator();
      const gain = ringtoneContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, ringtoneContext.currentTime);
      gain.gain.setValueAtTime(0.0001, ringtoneContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ringtoneContext.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ringtoneContext.currentTime + 0.55);
      oscillator.connect(gain);
      gain.connect(ringtoneContext.destination);
      oscillator.start();
      oscillator.stop(ringtoneContext.currentTime + 0.6);
    };
    playTone();
    ringtoneTimer = setInterval(playTone, 1400);
  } catch {
    if (q("#callStatus")) q("#callStatus").textContent = "Incoming call.";
  }
}

function stopRingtone() {
  if (ringtoneAudio) {
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
    ringtoneAudio = null;
  }
  stopGeneratedRingtone();
}

function stopGeneratedRingtone() {
  clearInterval(ringtoneTimer);
  ringtoneTimer = null;
  if (ringtoneContext) {
    ringtoneContext.close().catch(() => {});
    ringtoneContext = null;
  }
}

function startCallDuration() {
  if (!activeCall) return;
  if (!callStartedAt) callStartedAt = Date.now();
  clearInterval(callDurationTimer);
  const update = () => {
    const seconds = Math.max(0, Math.floor((Date.now() - callStartedAt) / 1000));
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    if (q("#callStatus")) q("#callStatus").textContent = `Call connected - ${mm}:${ss}`;
  };
  update();
  callDurationTimer = setInterval(update, 1000);
}

function stopCallDuration() {
  clearInterval(callDurationTimer);
  callDurationTimer = null;
  callStartedAt = null;
}

function recentActivityItems() {
  const auditItems = state.audit.slice(0, 12).map(a => ({ at: a.at, title: `${a.action} ${a.target}`, detail: `${a.detail || ""} - ${a.by || ""}` }));
  return [...liveNotificationBuffer, ...auditItems].sort((a, b) => String(b.at || "").localeCompare(String(a.at || ""))).slice(0, 20);
}

function bellUserKey() {
  return String(user?.name || "guest").trim().toLowerCase() || "guest";
}

function loadBellReads() {
  try { return JSON.parse(localStorage.getItem(BELL_READ_KEY) || "{}"); }
  catch { return {}; }
}

function saveBellReads(reads) {
  localStorage.setItem(BELL_READ_KEY, JSON.stringify(reads));
}

function bellReadAt() {
  return loadBellReads()[bellUserKey()] || "";
}

function unreadActivityItems() {
  const readAt = bellReadAt();
  return recentActivityItems().filter(item => !readAt || String(item.at || "") > String(readAt));
}

function markActivityBellRead() {
  const latest = state.audit[0]?.at;
  if (!latest) return;
  const reads = loadBellReads();
  reads[bellUserKey()] = latest;
  saveBellReads(reads);
  const count = q("#activityBellCount");
  if (count) count.textContent = "0";
}

function renderActivityBell() {
  const unread = unreadActivityItems();
  const recent = recentActivityItems();
  q("#activityBellCount").textContent = unread.length;
  q("#activityBellPanel").innerHTML = `<div class="panel-head"><h3>${unread.length ? "New Activities" : "Recent Activities"}</h3><button id="closeActivityBell" class="ghost">Close</button></div>${(unread.length ? unread : recent.slice(0, 5)).map((item, index) => `<button class="summary-item notification-hit" data-notification-index="${index}" type="button"><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.detail)}<br><small>${formatDateTime(item.at)}</small></button>`).join("") || "<p>No new notification.</p>"}`;
  applyActivityBellPosition();
}

function toggleActivityBell() {
  const panel = q("#activityBellPanel");
  const opening = panel.classList.contains("hidden");
  renderActivityBell();
  panel.classList.toggle("hidden");
  if (opening) setTimeout(markActivityBellRead, 100);
}

function paintRecentAudit() {
  q("#recentAudit").innerHTML = state.audit.slice(0, 5).map(a => `<div class="summary-item"><strong>${escapeHtml(a.action)}</strong> ${escapeHtml(a.target)}<br>${escapeHtml(a.by)} - ${new Date(a.at).toLocaleString()}</div>`).join("") || "<p>No audit yet.</p>";
}

function applyActivityBellPosition() {
  const panel = q("#activityBellPanel");
  const button = q("#activityBell");
  try {
    const panelPos = JSON.parse(localStorage.getItem(BELL_POS_KEY) || "null");
    if (panel && panelPos) {
      panel.style.left = `${Math.max(8, Math.min(window.innerWidth - 80, Number(panelPos.left || 24)))}px`;
      panel.style.top = `${Math.max(8, Math.min(window.innerHeight - 80, Number(panelPos.top || 92)))}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    }
    const buttonPos = JSON.parse(localStorage.getItem(BELL_BUTTON_POS_KEY) || "null");
    if (button && buttonPos) {
      button.style.left = `${Math.max(8, Math.min(window.innerWidth - 70, Number(buttonPos.left || 24)))}px`;
      button.style.top = `${Math.max(8, Math.min(window.innerHeight - 70, Number(buttonPos.top || 24)))}px`;
      button.style.right = "auto";
      button.style.bottom = "auto";
    }
  } catch {}
}

function bindActivityBellDrag() {
  const panel = q("#activityBellPanel");
  const button = q("#activityBell");
  applyActivityBellPosition();
  let drag = null;
  let buttonDrag = null;
  let suppressBellClick = false;
  if (panel) panel.addEventListener("pointerdown", event => {
    if (!event.target.closest(".panel-head") || event.target.closest("button")) return;
    drag = { x: event.clientX, y: event.clientY, left: panel.offsetLeft, top: panel.offsetTop };
    panel.setPointerCapture(event.pointerId);
  });
  if (panel) panel.addEventListener("pointermove", event => {
    if (!drag) return;
    const left = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, drag.left + event.clientX - drag.x));
    const top = Math.max(8, Math.min(window.innerHeight - panel.offsetHeight - 8, drag.top + event.clientY - drag.y));
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  });
  if (panel) panel.addEventListener("pointerup", () => {
    if (!drag) return;
    localStorage.setItem(BELL_POS_KEY, JSON.stringify({ left: panel.offsetLeft, top: panel.offsetTop }));
    drag = null;
  });
  if (button) button.addEventListener("pointerdown", event => {
    buttonDrag = { x: event.clientX, y: event.clientY, left: button.offsetLeft, top: button.offsetTop, moved: false };
    button.setPointerCapture(event.pointerId);
  });
  if (button) button.addEventListener("pointermove", event => {
    if (!buttonDrag) return;
    const dx = event.clientX - buttonDrag.x;
    const dy = event.clientY - buttonDrag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) buttonDrag.moved = true;
    const left = Math.max(8, Math.min(window.innerWidth - button.offsetWidth - 8, buttonDrag.left + dx));
    const top = Math.max(8, Math.min(window.innerHeight - button.offsetHeight - 8, buttonDrag.top + dy));
    button.style.left = `${left}px`;
    button.style.top = `${top}px`;
    button.style.right = "auto";
    button.style.bottom = "auto";
  });
  if (button) button.addEventListener("pointerup", event => {
    if (!buttonDrag) return;
    localStorage.setItem(BELL_BUTTON_POS_KEY, JSON.stringify({ left: button.offsetLeft, top: button.offsetTop }));
    if (buttonDrag.moved) {
      suppressBellClick = true;
      event.preventDefault();
      event.stopPropagation();
    }
    setTimeout(() => { buttonDrag = null; suppressBellClick = false; }, 250);
  });
  if (button) button.addEventListener("click", event => {
    if (buttonDrag?.moved || suppressBellClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

function dashboardActivityHtml(date, type, emptyText) {
  const rows = (state.activity[`${date}|All`]?.[type] || []).filter(r => String(r.text || "").trim());
  return rows.slice(0, 6).map(r => `<div class="summary-item"><strong>${escapeHtml(r.shift || "")} - ${escapeHtml(r.person || "")}</strong><br>${escapeHtml(r.text || "")}</div>`).join("") || `<p>${emptyText}</p>`;
}

function dateOffset(date, days) {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function renderProduction() {
  const selected = q("#machineSelect").value;
  q("#machineSelect").innerHTML = state.machines.map(m => `<option value="${m.id}">${escapeHtml(m.name)}</option>`).join("");
  if (selected && state.machines.some(m => m.id === selected)) q("#machineSelect").value = selected;
  const machine = state.machines.find(m => m.id === q("#machineSelect").value) || state.machines[0];
  if (!machine) return;
  q("#machineSelect").value = machine.id;
  const risk = machineRisk(machine);
  const category = machine.category || "Sieving machine";
  const isSieving = category === "Sieving machine";
  q("#machineLibrary").innerHTML = `
    <div class="inline-grid">
      <label>Machine name<input id="machineName" value="${escapeAttr(machine.name)}"></label>
      <label>Machine category<select id="machineCategory">${machineCategories.map(c => `<option ${category === c ? "selected" : ""}>${c}</option>`).join("")}</select></label>
      <label>Upload cover photograph<input id="machinePhotoUpload" type="file" accept="image/*"></label>
      <input id="machinePhoto" type="hidden" value="${escapeAttr(machine.photo || "")}">
    </div>
    <div class="machine-cover" style="--cover-x:${Number(machine.photoFit?.x ?? 50)}%;--cover-y:${Number(machine.photoFit?.y ?? 50)}%;--cover-zoom:${Number(machine.photoFit?.zoom ?? 1)}">${machine.photo ? `<img src="${escapeAttr(machine.photo)}" alt="${escapeAttr(machine.name)} cover photograph">` : `<div class="machine-cover-placeholder">Choose a local photo to show this machine as a wide cover image</div>`}<strong>${escapeHtml(machine.name)}</strong></div>
    ${machine.photo ? `<p class="muted-note">Drag the cover photo to reposition. Use mouse wheel over the photo to zoom/crop.</p>` : ""}
    ${isSieving ? `<div id="screenSetupBox" class="output-box">
      <div class="inline-grid">
        <label>Number of screens<input id="machineScreens" type="number" min="0" value="${machine.screens ?? ""}" placeholder="Example: 2"></label>
        <label>Current screen setup<input id="machineCurrentSetup" value="${escapeAttr(machine.currentSetup || "")}" placeholder="Example: 10/14#, 16/20#"></label>
      </div>
      <strong>${Number(machine.screens || 0)} screens installed = ${Number(machine.screens || 0) + 1} outputs</strong>
      <div id="machineOutputs">${outputInputs(machine).join("")}</div>
    </div>` : `<div id="screenSetupBox" class="output-box muted-box"><strong>No screen setup required for ${escapeHtml(category)}.</strong></div>`}
    <div class="machine-health ${risk.level.toLowerCase()}"><strong>${risk.level}</strong><span>${escapeHtml(risk.reason)}</span></div>
    <label>Machine notes<textarea id="machineNotes" rows="5" placeholder="Capacity, operating limits, preventive maintenance notes">${escapeHtml(machine.notes || "")}</textarea></label>`;
  q("#machineCategory").onchange = () => saveMachineLibrary(false);
  q("#spareParts").innerHTML = `<thead><tr><th>Order</th><th>Spare part name</th><th>Spare specification</th><th>Qty available</th><th>Minimum stock</th><th>Delete</th></tr></thead><tbody>${(machine.spares || []).map(spare => `<tr data-spare="${spare.id}">
    <td><input data-spare-field="order" type="number" value="${spare.order || ""}" placeholder="Order"></td>
    <td><input data-spare-field="part" value="${escapeAttr(spare.part || "")}" placeholder="Enter spare part name"></td>
    <td><input data-spare-field="specification" value="${escapeAttr(spare.specification || "")}" placeholder="Size, type, rating, make, drawing no."></td>
    <td><input data-spare-field="stock" type="number" value="${spare.stock || 0}" placeholder="Qty available"></td>
    <td><input data-spare-field="reorder" type="number" value="${spare.reorder || 0}" placeholder="Minimum stock"></td>
    <td><button data-delete-spare="${spare.id}" class="ghost">Delete</button></td>
  </tr>`).join("")}</tbody>`;
  q("#breakdownHistory").innerHTML = (state.breakdowns[machine.id] || []).map(b => `<div class="breakdown-card" data-breakdown="${b.id}">
    <div class="inline-grid">
      <label>Date<input data-break-field="date" type="date" value="${b.date || today()}"></label>
      <label>Hours lost<input data-break-field="hours" type="number" step="0.1" value="${b.hours || ""}"></label>
      <label>Photograph / file note<input data-break-field="photo" value="${escapeAttr(b.photo || "")}" placeholder="Photo filename or link"></label>
      <label>Status<select data-break-field="status"><option ${b.status === "Open" ? "selected" : ""}>Open</option><option ${b.status === "Closed" ? "selected" : ""}>Closed</option></select></label>
    </div>
    <label>Breakdown details report<textarea data-break-field="details" rows="4" placeholder="Cause, repair work, parts used, prevention">${escapeHtml(b.details || "")}</textarea></label>
    <button data-delete-breakdown="${b.id}" class="ghost">Delete breakdown</button>
  </div>`).join("") || "<p>No breakdown history recorded for this machine.</p>";
  renderScreenDetails(machine);
}

function outputInputs(machine) {
  if ((machine.category || "Sieving machine") !== "Sieving machine") return [];
  const count = Number(machine.screens || 0) + 1;
  const names = Array.isArray(machine.outputNames) ? machine.outputNames : String(machine.outputs || "").split(",").map(s => s.trim());
  return Array.from({ length: count }, (_, i) => `<label>Output ${i + 1}<input data-output-index="${i}" value="${escapeAttr(names[i] || "")}" placeholder="Output ${i + 1} name"></label>`);
}

function normalizeMachineCategory(value) {
  const text = String(value || "").trim();
  const numberMap = { "1": "Sieving machine", "2": "Grinding machine", "3": "Blending machine", "4": "Material handling equipments" };
  if (numberMap[text]) return numberMap[text];
  return machineCategories.find(c => c.toLowerCase() === text.toLowerCase()) || "Sieving machine";
}

async function addMachine() {
  const details = await showMachineAddModal();
  if (!details) return;
  const { name, category, screens } = details;
  state.machines.push({ id: id(), name, category, screens, currentSetup: "", outputs: "", outputNames: category === "Sieving machine" ? Array.from({ length: screens + 1 }, (_, i) => `Output ${i + 1}`) : [], photo: "", spares: [], notes: "" });
  audit("add", "machinery", name);
  saveState();
  renderProduction();
}

function showMachineAddModal() {
  return new Promise(resolve => {
    const modal = q("#machineAddModal");
    const nameInput = q("#newMachineName");
    const categorySelect = q("#newMachineCategory");
    const screensInput = q("#newMachineScreens");
    const error = q("#machineAddError");
    const confirmBtn = q("#confirmAddMachineBtn");
    const cancelBtn = q("#cancelAddMachineBtn");
    if (!modal || !nameInput || !categorySelect || !screensInput || !confirmBtn) {
      resolve(null);
      return;
    }
    nameInput.value = "";
    categorySelect.value = "Sieving machine";
    screensInput.value = "";
    error.textContent = "";
    toggleNewMachineScreens();
    modal.classList.remove("hidden");
    setTimeout(() => nameInput.focus(), 50);
    const cleanup = result => {
      confirmBtn.onclick = null;
      if (cancelBtn) cancelBtn.onclick = null;
      modal.classList.add("hidden");
      resolve(result);
    };
    confirmBtn.onclick = () => {
      const name = nameInput.value.trim();
      const category = normalizeMachineCategory(categorySelect.value);
      const screens = category === "Sieving machine" ? Math.max(0, Number(screensInput.value || 0)) : 0;
      if (!name) {
        error.textContent = "Machine name is required.";
        return;
      }
      cleanup({ name, category, screens });
    };
    if (cancelBtn) cancelBtn.onclick = () => cleanup(null);
  });
}

function closeMachineAddModal() {
  q("#machineAddModal")?.classList.add("hidden");
}

function toggleNewMachineScreens() {
  const isSieving = q("#newMachineCategory")?.value === "Sieving machine";
  q("#newMachineScreensLabel")?.classList.toggle("hidden", !isSieving);
}

function saveMachineLibrary(doAudit = true) {
  const machine = state.machines.find(m => m.id === q("#machineSelect").value);
  if (!machine) return;
  machine.name = q("#machineName").value.trim();
  machine.category = q("#machineCategory").value;
  if (machine.category === "Sieving machine") {
    machine.screens = Number(q("#machineScreens")?.value || 0);
    machine.currentSetup = q("#machineCurrentSetup")?.value.trim() || "";
    machine.outputNames = qa("[data-output-index]").map(i => i.value.trim());
    machine.outputs = machine.outputNames.filter(Boolean).join(", ");
  } else {
    machine.screens = 0;
    machine.currentSetup = "";
    machine.outputNames = [];
    machine.outputs = "";
  }
  machine.photo = q("#machinePhoto").value.trim();
  machine.photoFit = {
    x: Number(q("#machinePhotoX")?.value ?? machine.photoFit?.x ?? 50),
    y: Number(q("#machinePhotoY")?.value ?? machine.photoFit?.y ?? 50),
    zoom: Number(q("#machinePhotoZoom")?.value ?? machine.photoFit?.zoom ?? 1)
  };
  machine.notes = q("#machineNotes").value.trim();
  machine.spares = qa("[data-spare]").map(row => ({ id: row.dataset.spare, ...readSmallRow(row, "spareField") })).sort((a, b) => Number(a.order || 999) - Number(b.order || 999));
  state.breakdowns[machine.id] = qa("[data-breakdown]").map(row => ({ id: row.dataset.breakdown, ...readSmallRow(row, "breakField") }));
  if (doAudit) audit("save", "machinery library", machine.name);
  saveState();
  render();
}

function saveMachineCoverFit() {
  const machine = state.machines.find(m => m.id === q("#machineSelect").value);
  if (!machine) return;
  machine.photoFit = {
    x: Number(q("#machinePhotoX")?.value ?? machine.photoFit?.x ?? 50),
    y: Number(q("#machinePhotoY")?.value ?? machine.photoFit?.y ?? 50),
    zoom: Number(q("#machinePhotoZoom")?.value ?? machine.photoFit?.zoom ?? 1)
  };
  saveState();
}

function addSpare() {
  const machine = state.machines.find(m => m.id === q("#machineSelect").value);
  machine.spares ||= [];
  machine.spares.push({ id: id(), order: (machine.spares.length || 0) + 1, part: "", specification: "", stock: 0, reorder: 0 });
  saveState();
  renderProduction();
}

function addBreakdown() {
  const machine = state.machines.find(m => m.id === q("#machineSelect").value);
  state.breakdowns[machine.id] ||= [];
  state.breakdowns[machine.id].unshift({ id: id(), date: today(), hours: "", photo: "", status: "Open", details: "" });
  audit("add", "breakdown", machine.name);
  saveState();
  renderProduction();
}

function renderScreenDetails(machine) {
  const record = screenRecord(machine);
  const screens = record.screens || [];
  const rows = [
    ["Wiremesh", "mesh", "text"],
    ["Quantity", "quantity", "number"],
    ["Gauge", "gauge", "text"],
    ["Installation Date", "installDate", "date"],
    ["Damaged Screens", "damaged", "text"],
    ["Replaced Screens", "replaced", "text"],
    ["Requirement", "requirement", "text"],
    ["On Use", "onUse", "text"],
    ["History note: when / how / why", "note", "text"]
  ];
  q("#screenDetailsTable").innerHTML = `<thead><tr><th>${escapeHtml(machine.name)}</th>${screens.map((screen, index) => `<th>Screen ${index + 1}<br><button class="ghost tiny-btn" data-delete-screen-row="${screen.id}" type="button">Delete</button></th>`).join("") || "<th>No screen added</th>"}</tr></thead><tbody>${rows.map(([label, field, type]) => `<tr><th>${label}</th>${screens.map(screen => `<td><input data-screen-id="${screen.id}" data-screen-field="${field}" type="${type}" value="${escapeAttr(screen[field] || "")}"></td>`).join("") || `<td><em>Click Add screen row</em></td>`}</tr>`).join("")}</tbody>`;
  const history = (record.history || []).sort((a, b) => String(b.at || "").localeCompare(String(a.at || ""))).slice(0, 20);
  q("#screenHistory").innerHTML = history.map(item => `<div class="summary-item"><strong>${escapeHtml(item.field)}</strong> changed on ${formatDateTime(item.at)} by ${escapeHtml(item.by || "")}<br>${escapeHtml(item.value || "")}${item.note ? `<br><small>${escapeHtml(item.note)}</small>` : ""}</div>`).join("") || "<p>No screen history yet.</p>";
}

function screenRecord(machine) {
  state.screenDetails ||= [];
  let record = state.screenDetails.find(row => row.machineId === machine.id && Array.isArray(row.screens));
  if (!record) {
    const oldRows = state.screenDetails.filter(row => row.machineId === machine.id && !Array.isArray(row.screens));
    record = { id: id(), machineId: machine.id, screens: [], history: [] };
    oldRows.forEach(row => {
      const meshes = String(row.available || "").split(/[,;\n]/).map(x => x.trim()).filter(Boolean);
      if (meshes.length) meshes.forEach(mesh => record.screens.push({ id: id(), mesh, quantity: "", gauge: "", installDate: "", damaged: row.damaged || "", replaced: row.replaced || "", requirement: row.requirement || "", onUse: row.onUse || "", note: row.note || "" }));
    });
    state.screenDetails = state.screenDetails.filter(row => row.machineId !== machine.id || Array.isArray(row.screens));
    state.screenDetails.push(record);
  }
  return record;
}

function addScreenDetail() {
  const machine = state.machines.find(m => m.id === q("#machineSelect").value);
  if (!machine) return;
  const record = screenRecord(machine);
  record.screens ||= [];
  record.screens.push({ id: id(), mesh: "", quantity: "", gauge: "", installDate: "", damaged: "", replaced: "", requirement: "", onUse: "", note: "" });
  audit("add", "screen details", machine.name);
  saveState();
  renderProduction();
}

function saveScreenDetails(doAudit = false) {
  const machine = state.machines.find(m => m.id === q("#machineSelect").value);
  if (!machine) return;
  const record = screenRecord(machine);
  record.screens ||= [];
  qa("[data-screen-id]").forEach(input => {
      const item = record.screens.find(entry => entry.id === input.dataset.screenId);
      if (!item) return;
      const key = input.dataset.screenField;
      const value = input.value;
      if (String(item[key] || "") !== String(value || "")) {
        record.history ||= [];
        record.history.unshift({ at: new Date().toISOString(), by: currentUserName(), field: `${item.mesh || "Screen"} / ${key}`, value, note: item.note || "" });
        record.history = record.history.slice(0, 100);
      }
      item[key] = value;
  });
  if (doAudit) audit("save", "screen details", machine.name);
  saveState();
}

function machineRisk(machine) {
  const breakdowns = state.breakdowns[machine.id] || [];
  const recent = breakdowns.filter(b => b.date && daysBetween(b.date, today()) <= 90).length;
  const lowSpares = (machine.spares || []).filter(s => Number(s.stock || 0) <= Number(s.reorder || 0)).length;
  if (recent >= 3) return { level: "Fragile", reason: `${recent} breakdowns in last 90 days. Review preventive maintenance urgently.` };
  if (lowSpares) return { level: "Attention", reason: `${lowSpares} spare part(s) at or below minimum stock.` };
  return { level: "Stable", reason: "Breakdown history and spare stock look acceptable." };
}

function daysBetween(a, b) {
  return Math.abs((new Date(b) - new Date(a)) / 86400000);
}

function cleanSetup(value) {
  const cleaned = String(value || "").split(",").map(v => v.trim()).filter(Boolean).join(", ");
  return cleaned;
}

function renderStock() {
  state.stockCategories ||= [];
  const categories = [...new Set([...state.stockCategories, ...state.stockVariants.map(v => v.category).filter(Boolean)])];
  if (!categories.length) categories.push("Raw material");
  const selected = q("#stockCategory").value;
  q("#stockCategory").innerHTML = categories.map(c => `<option>${escapeHtml(c)}</option>`).join("");
  const category = categories.includes(selected) ? selected : categories[0];
  q("#stockCategory").value = category;
  state.stockCategories = categories;
  const date = q("#stockDate").value;
  const rows = state.stockVariants.filter(v => v.category === category).map(v => stockRowFor(v, date));
  q("#stockTable").innerHTML = `<thead><tr>${["Product name","Raw material of","Opening","Day production","Night production","Cumulative","Conspt D/S","Conspt N/S","Closing","D90","D50","D10","Remarks","QR code","Delete"].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(stockRowHtml).join("")}</tbody>`;
  if (!rows.length) {
    q("#stockTable tbody").innerHTML = `<tr><td colspan="15" class="muted-note">No material added in ${escapeHtml(category)} yet. Click Add new variant to create the first row.</td></tr>`;
  }
}

function stockRowFor(variant, date) {
  const day = state.stockDays[date]?.[variant.id] || {};
  const opening = day.opening !== undefined ? Number(day.opening) : previousClosing(variant, date);
  const dayProd = Number(day.dayProd || 0);
  const nightProd = Number(day.nightProd || 0);
  const consDay = Number(day.consDay || 0);
  const consNight = Number(day.consNight || 0);
  const cumulative = opening + dayProd + nightProd;
  const closing = cumulative - consDay - consNight;
  return { ...variant, ...day, name: day.name || variant.name, rawOf: day.rawOf || variant.rawOf, opening, dayProd, nightProd, consDay, consNight, cumulative, closing };
}

function previousClosing(variant, date) {
  const dates = Object.keys(state.stockDays).filter(d => d < date).sort();
  const prev = dates.reverse().find(d => state.stockDays[d]?.[variant.id]);
  if (prev) return stockRowFor(variant, prev).closing;
  return Number(variant.opening || 0);
}

function stockRowHtml(r) {
  const cls = r.closing < 1000 ? "low" : "ok";
  return `<tr data-variant="${r.id}">
    <td><input data-field="name" value="${escapeAttr(r.name)}"></td>
    <td><input data-field="rawOf" value="${escapeAttr(r.rawOf || "")}"></td>
    <td><input data-field="opening" type="number" value="${r.opening}"></td>
    <td><input data-field="dayProd" type="number" value="${r.dayProd}"></td>
    <td><input data-field="nightProd" type="number" value="${r.nightProd}"></td>
    <td data-calc="cumulative">${r.cumulative.toFixed(1)}</td>
    <td><input data-field="consDay" type="number" value="${r.consDay}"></td>
    <td><input data-field="consNight" type="number" value="${r.consNight}"></td>
    <td data-calc="closing" class="${cls}">${r.closing.toFixed(1)}</td>
    <td><input data-field="d90" type="number" value="${r.d90 || ""}"></td>
    <td><input data-field="d50" type="number" value="${r.d50 || ""}"></td>
    <td><input data-field="d10" type="number" value="${r.d10 || ""}"></td>
    <td><input data-field="remarks" value="${escapeAttr(r.remarks || "")}"></td>
    <td><div class="qr-cell"><button data-see-qr="${r.id}" class="ghost qr-btn" type="button">See QR code</button><button data-download-qr="${r.id}" class="ghost qr-btn" type="button">Download</button></div></td>
    <td><button data-delete-variant="${r.id}" class="ghost">Delete</button></td>
  </tr>`;
}

function addVariant() {
  const category = q("#stockCategory").value || "LCM raw";
  state.stockCategories ||= [];
  if (!state.stockCategories.includes(category)) state.stockCategories.push(category);
  state.stockVariants.push({ id: id(), category, name: "New material", rawOf: "", psd: {}, opening: 0 });
  audit("add", "stock variant", category);
  saveState();
  renderStock();
}

function addStockCategory() {
  const name = q("#newStockCategory").value.trim();
  if (!name) return;
  state.stockCategories ||= [];
  if (!state.stockCategories.some(category => category.toLowerCase() === name.toLowerCase())) {
    state.stockCategories.push(name);
    audit("add", "stock category", name);
  }
  q("#newStockCategory").value = "";
  saveState();
  renderStock();
  q("#stockCategory").value = state.stockCategories.find(category => category.toLowerCase() === name.toLowerCase()) || name;
  renderStock();
}

function deleteStockCategory() {
  const category = q("#stockCategory").value;
  if (!category) return;
  const materialCount = state.stockVariants.filter(v => v.category === category).length;
  const message = materialCount ? `Delete category "${category}" and its ${materialCount} material row(s)?` : `Delete empty category "${category}"?`;
  if (!confirm(message)) return;
  const deletedIds = new Set(state.stockVariants.filter(v => v.category === category).map(v => v.id));
  state.stockCategories = (state.stockCategories || []).filter(c => c !== category);
  state.stockVariants = state.stockVariants.filter(v => v.category !== category);
  Object.values(state.stockDays || {}).forEach(day => deletedIds.forEach(variantId => delete day[variantId]));
  audit("delete", "stock category", category);
  saveState();
  renderStock();
}

function saveStockDay(doAudit = true) {
  const date = q("#stockDate").value;
  state.stockDays[date] ||= {};
  qa("#stockTable tbody tr").forEach(tr => {
    const variant = state.stockVariants.find(v => v.id === tr.dataset.variant);
    const record = {};
    tr.querySelectorAll("[data-field]").forEach(input => record[input.dataset.field] = input.value);
    if (record.name) variant.name = record.name;
    variant.rawOf = record.rawOf;
    state.stockDays[date][variant.id] = record;
  });
  q("#stockTable").onclick = e => deleteVariant(e);
  if (doAudit) audit("save", "stock", date);
  saveState();
  if (doAudit) render();
}

function deleteVariant(e) {
  const btn = e.target.closest("[data-delete-variant]");
  if (!btn) return;
  if (!confirm("Delete this material variant?")) return;
  state.stockVariants = state.stockVariants.filter(v => v.id !== btn.dataset.deleteVariant);
  audit("delete", "stock variant", btn.dataset.deleteVariant);
  saveState();
  renderStock();
}

function recalcStockRow(row) {
  const value = field => Number(row.querySelector(`[data-field="${field}"]`)?.value || 0);
  const opening = value("opening");
  const dayProd = value("dayProd");
  const nightProd = value("nightProd");
  const consDay = value("consDay");
  const consNight = value("consNight");
  const cumulative = opening + dayProd + nightProd;
  const closing = cumulative - consDay - consNight;
  const cumulativeCell = row.querySelector('[data-calc="cumulative"]');
  const closingCell = row.querySelector('[data-calc="closing"]');
  if (cumulativeCell) cumulativeCell.textContent = cumulative.toFixed(1);
  if (closingCell) {
    closingCell.textContent = closing.toFixed(1);
    closingCell.classList.toggle("low", closing < 1000);
    closingCell.classList.toggle("ok", closing >= 1000);
  }
}

async function renderRackTrack() {
  if (!rackState.locations.length) await loadRackTrack(false);
  else renderRackTrackPanels();
}

async function loadRackTrack(showStatus = false) {
  try {
    if (showStatus) q("#rackStatus").textContent = "Syncing rack data...";
    const response = await fetch(apiPath("/api/state"), { cache: "no-store" });
    if (!response.ok) throw new Error("Rack data unavailable");
    rackState = await response.json();
    q("#rackStatus").textContent = "Rack data online";
    renderRackProductOptions();
    renderRackTrackPanels();
  } catch (error) {
    q("#rackStatus").textContent = "Rack data offline";
    q("#rackLocations").innerHTML = `<div class="empty-state">Rack tracking could not load. ${escapeHtml(error.message)}</div>`;
  }
}

function renderRackProductOptions() {
  const current = q("#rackProductFilter").value || "all";
  q("#rackProductFilter").innerHTML = `<option value="all">All products</option>${(rackState.products || []).map(p => `<option value="${escapeAttr(p.name)}">${escapeHtml(formatRackProductName(p))}</option>`).join("")}`;
  q("#rackProductFilter").value = (rackState.products || []).some(p => p.name === current) ? current : "all";
  q("#rackPalletProduct").innerHTML = (rackState.products || []).map(p => `<option value="${escapeAttr(p.name)}">${escapeHtml(formatRackProductName(p))}</option>`).join("");
  const occupied = new Set((rackState.pallets || []).map(p => p.locationId));
  const currentLocation = q("#rackPalletLocation").value;
  q("#rackPalletLocation").innerHTML = (rackState.locations || []).map(location => `<option value="${escapeAttr(location.id)}" ${occupied.has(location.id) ? "data-occupied='1'" : ""}>${escapeHtml(location.code)}${occupied.has(location.id) ? " - occupied" : ""}</option>`).join("");
  if (currentLocation && (rackState.locations || []).some(location => location.id === currentLocation)) q("#rackPalletLocation").value = currentLocation;
}

function formatRackProductName(product) {
  return `${product?.name || ""}  ${product?.shortName || ""}`.trim();
}

function renderRackTrackPanels() {
  if (!q("#rackMetrics")) return;
  qa("[data-rack-view]").forEach(btn => btn.classList.toggle("active", btn.dataset.rackView === rackView));
  qa(".rack-view").forEach(panel => panel.classList.toggle("active", panel.id === `rackView${rackView[0].toUpperCase()}${rackView.slice(1)}`));
  const used = new Set((rackState.pallets || []).map(p => p.locationId));
  const netKg = (rackState.pallets || []).reduce((sumValue, pallet) => sumValue + Number(pallet.netKg || 0), 0);
  q("#rackMetrics").innerHTML = [
    ["Total locations", rackState.locations.length],
    ["Stored pallets", rackState.pallets.length],
    ["Net stock kg", netKg.toLocaleString("en-IN")],
    ["Free locations", Math.max(0, rackState.locations.length - used.size)]
  ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");

  const floors = ["G", "1", "2", "3", "4"];
  q("#rackOccupancy").innerHTML = floors.map(floor => {
    const locations = rackState.locations.filter(location => location.floor === floor);
    if (!locations.length) return "";
    const occupied = locations.filter(location => used.has(location.id)).length;
    const pct = locations.length ? Math.round(occupied / locations.length * 100) : 0;
    return `<div class="rack-tile"><strong>${floor === "G" ? "Ground" : `Floor ${floor}`}</strong><span>${occupied}/${locations.length} occupied</span><div class="occupancy"><span style="width:${pct}%"></span></div><small>${pct}%</small></div>`;
  }).join("");

  const fifo = [...(rackState.pallets || [])].sort((a, b) => String(a.fifoDate || "").localeCompare(String(b.fifoDate || ""))).slice(0, 6);
  q("#rackFifo").innerHTML = fifo.map(p => `<div class="summary-item"><strong>${escapeHtml(p.locationId)} - ${escapeHtml(p.shortName)}</strong><br>${escapeHtml(p.productName)} ${escapeHtml(displayRackBatch(p))}, ${p.netKg} kg, FIFO ${escapeHtml(p.fifoDate || "")}</div>`).join("") || "<p>No pallets stored yet.</p>";

  renderRackLocations();
  renderRackStockTable();
  renderRackCatalog();
  renderRackActivity();
}

function rackFilteredPallets() {
  const search = q("#rackSearch").value.trim().toLowerCase();
  const product = q("#rackProductFilter").value;
  return (rackState.pallets || []).filter(p => {
    const text = [p.locationId, p.productName, p.shortName, p.batch, p.packaging, p.netKg, p.notes].join(" ").toLowerCase();
    return (!search || text.includes(search)) && (product === "all" || p.productName === product);
  });
}

function renderRackLocations() {
  const search = q("#rackSearch").value.trim().toLowerCase();
  const status = q("#rackStatusFilter").value;
  const used = new Map((rackState.pallets || []).map(p => [p.locationId, p]));
  const locations = (rackState.locations || []).filter(location => {
    const pallet = used.get(location.id);
    const text = [location.code, location.row, location.floor, location.position, pallet?.productName, pallet?.shortName, pallet?.batch].join(" ").toLowerCase();
    const statusMatch = status === "all" || (status === "occupied" ? !!pallet : !pallet);
    return statusMatch && (!search || text.includes(search));
  }).slice(0, 160);
  q("#rackLocations").innerHTML = locations.map(location => {
    const pallet = used.get(location.id);
    return `<article class="rack-location-card ${pallet ? "occupied" : ""}">
      <strong>${escapeHtml(location.code)}</strong>
      <span>Row ${escapeHtml(location.row)} / ${location.floor === "G" ? "Ground" : `Floor ${escapeHtml(location.floor)}`} / Position ${escapeHtml(location.position)}</span>
        ${pallet ? `<p>${escapeHtml(pallet.shortName)} - ${escapeHtml(displayRackBatch(pallet))} - ${pallet.netKg} kg</p><div class="row-actions"><button class="ghost" data-edit-rack-pallet="${pallet.id}">Edit</button><button class="ghost" data-delete-rack-pallet="${pallet.id}">Delete</button></div>` : `<p>Available</p><button class="ghost" data-rack-add-location="${location.id}">Add here</button>`}
    </article>`;
  }).join("") || `<div class="empty-state">No rack locations match this filter.</div>`;
}

function renderRackStockTable() {
  const pallets = rackFilteredPallets().sort((a, b) => String(a.fifoDate || "").localeCompare(String(b.fifoDate || "")));
  q("#rackStockTable").innerHTML = `<thead><tr>${["Location","Product","Short","Batch","Packaging","Net kg","FIFO date","Notes","Action"].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${pallets.map(p => `<tr>
    <td>${escapeHtml(p.locationId)}</td>
    <td>${escapeHtml(p.productName)}</td>
    <td>${escapeHtml(p.shortName)}</td>
    <td>${escapeHtml(displayRackBatch(p))}</td>
    <td>${escapeHtml(p.packaging)}<br><small>${p.bagCount} x ${p.bagWeight} kg</small></td>
    <td>${Number(p.netKg || 0).toLocaleString("en-IN")}</td>
    <td>${escapeHtml(p.fifoDate || "")}</td>
    <td>${escapeHtml(p.notes || "")}</td>
    <td><div class="row-actions"><button class="ghost" data-edit-rack-pallet="${p.id}">Edit</button><button class="ghost" data-delete-rack-pallet="${p.id}">Delete</button></div></td>
  </tr>`).join("") || `<tr><td colspan="9">No rack stock matches this search.</td></tr>`}</tbody>`;
}

function renderRackCatalog() {
  q("#rackCatalog").innerHTML = (rackState.products || []).map(product => `<article class="catalog-card"><strong>${escapeHtml(product.name)}&nbsp;&nbsp;${escapeHtml(product.shortName)}</strong></article>`).join("") || "<p>No product catalog loaded.</p>";
}

function renderRackActivity() {
  q("#rackActivity").innerHTML = (rackState.activity || []).slice(0, 100).map(entry => `<li><strong>${formatDateTime(entry.at)}</strong><br>${escapeHtml(entry.message || "")}</li>`).join("") || "<li>No rack activity recorded yet.</li>";
}

async function openRackPalletForm(locationId = "", palletId = "") {
  if (!rackState.products.length) await loadRackTrack(false);
  renderRackProductOptions();
  const pallet = palletId ? rackState.pallets.find(p => p.id === palletId) : null;
  q("#rackFormTitle").textContent = pallet ? "Edit pallet" : "Add pallet";
  q("#rackPalletId").value = pallet?.id || "";
  q("#rackPalletProduct").value = pallet?.productName || rackState.products[0]?.name || "";
  q("#rackPalletLocation").value = pallet?.locationId || locationId || rackState.locations[0]?.id || "";
  q("#rackPalletBatch").value = pallet?.batch || "";
  q("#rackPalletDate").value = pallet?.fifoDate || today();
  q("#rackPalletPackaging").value = normalizeRackPackaging(pallet?.packaging || "Paper sacks");
  q("#rackPalletWeight").value = String(pallet?.weightClass || 550);
  q("#rackPalletSackWeight").value = String(pallet?.bagWeight || (Number(pallet?.weightClass) === 650 ? 15.5 : 13));
  q("#rackPalletSackCount").value = String(pallet?.bagCount || 42);
  q("#rackPalletNotes").value = pallet?.notes || "";
  q("#rackPalletPassword").value = "";
  updateRackPackagingFields();
  q("#rackPalletPanel").classList.remove("hidden");
  q("#rackPalletPanel").scrollIntoView({ block: "start", behavior: "smooth" });
}

function closeRackPalletForm() {
  q("#rackPalletPanel").classList.add("hidden");
}

async function saveRackPalletFromForm(event) {
  event.preventDefault();
  const productName = q("#rackPalletProduct").value;
  const location = q("#rackPalletLocation").value;
  const password = q("#rackPalletPassword").value;
  if (!productName || !location || !password) {
    alert("Product, location, and password are required.");
    return;
  }
  const pallet = {
    id: q("#rackPalletId").value || undefined,
    productName,
    locationId: location,
    batch: q("#rackPalletBatch").value.trim(),
    packaging: q("#rackPalletPackaging").value,
    weightClass: Number(q("#rackPalletWeight").value || 550),
    bagWeight: Number(q("#rackPalletSackWeight").value || 0),
    bagCount: Number(q("#rackPalletSackCount").value || 0),
    fifoDate: q("#rackPalletDate").value || today(),
    notes: q("#rackPalletNotes").value.trim()
  };
  try {
    const response = await fetch(apiPath("/api/pallets"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, pallet })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Rack pallet save failed");
    rackState = data;
    audit("save", "rack pallet", `${productName} at ${location}`);
    closeRackPalletForm();
    renderRackProductOptions();
    renderRackTrackPanels();
  } catch (error) {
    alert(error.message);
  }
}

async function deleteRackPallet(palletId) {
  const pallet = rackState.pallets.find(p => p.id === palletId);
  if (!pallet || !confirm(`Delete pallet from ${pallet.locationId}?`)) return;
  const password = prompt("Enter EMC password to delete rack data");
  if (!password) return;
  try {
    const response = await fetch(apiPath(`/api/pallets/${encodeURIComponent(palletId)}`), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Rack pallet delete failed");
    rackState = data;
    audit("delete", "rack pallet", `${pallet.shortName} at ${pallet.locationId}`);
    renderRackTrackPanels();
  } catch (error) {
    alert(error.message);
  }
}

function displayRackBatch(pallet) {
  return pallet.batch ? `batch ${pallet.batch}` : "without batch no.";
}

function normalizeRackPackaging(packaging) {
  return packaging === "Paper sack pallet" ? "Paper sacks" : (packaging || "Paper sacks");
}

function updateRackPackagingFields() {
  const packaging = q("#rackPalletPackaging")?.value || "Paper sacks";
  const isJumbo = packaging === "Jumbo bag";
  q("#rackWeightClassBox").classList.toggle("hidden", !isJumbo);
  q("#rackSackWeightBox").classList.toggle("hidden", isJumbo);
  q("#rackSackCountBox").classList.toggle("hidden", isJumbo);
  const net = isJumbo
    ? Number(q("#rackPalletWeight").value || 0)
    : Number(q("#rackPalletSackWeight").value || 0) * Number(q("#rackPalletSackCount").value || 0);
  q("#rackPalletNetKg").value = Number(net || 0).toFixed(1);
}

function liveEditInfo(target) {
  if (!target || !target.closest("#appView")) return null;
  if (target.closest(".top-actions") || target.id === "masterSearch" || target.type === "password") return null;
  const pageLabel = pages.find(([key]) => key === activePage)?.[1] || "App";
  let field = target.dataset.field || target.dataset.compField || target.dataset.meshField || target.id || target.name || "Field";
  const stockNames = {
    name: "Product name",
    rawOf: "Raw material of",
    opening: "Opening stock",
    dayProd: "Day production",
    nightProd: "Night production",
    consDay: "Day shift consumption",
    consNight: "Night shift consumption",
    d90: "D90",
    d50: "D50",
    d10: "D10",
    remarks: "Remarks"
  };
  if (activePage === "stock" && target.dataset.field) field = stockNames[target.dataset.field] || target.dataset.field;
  if (target.dataset.compField === "percent") field = "Formulation percentage";
  if (target.dataset.compField === "stock") field = "Component stock";
  const row = target.closest("tr");
  const locator = { page: activePage, id: target.id || "" };
  let area = pageLabel;
  if (activePage === "stock" && row?.dataset.variant) {
    const variant = state.stockVariants.find(v => v.id === row.dataset.variant);
    area = `Raw Material Stock${variant?.name ? ` / ${variant.name}` : ""}`;
    locator.rowId = row.dataset.variant;
    locator.field = target.dataset.field || "";
  }
  if (activePage === "grn" && row?.dataset.grn) {
    area = "Incoming / Outgoing Material";
    locator.rowId = row.dataset.grn;
    locator.field = target.dataset.gfield || "";
    locator.customId = target.dataset.gcustom || "";
    const labels = { type: "Type", date: "Date", party: "Supplier / Receiver", invoice: "Invoice no", material: "Material", qty: "Qty kg", psd: "PSD update", remarks: "Remarks" };
    if (target.dataset.gfield) field = labels[target.dataset.gfield] || target.dataset.gfield;
    if (target.dataset.gcustom) {
      const heading = (state.grnHeadings || []).find(h => h.id === target.dataset.gcustom);
      field = heading?.name || "Custom GRN field";
    }
  }
  if (activePage === "racktrack") area = "Rack Tracking";
  if (activePage === "activity") area = "Activity Log";
  if (activePage === "tomorrow") area = "Tomorrow's Plan";
  if (activePage === "taskAllocation") area = "Task Allocation";
  if (activePage === "longPlans") area = "Long Term Plans";
  const value = target.type === "date" ? target.value : String(target.value || "").slice(0, 80);
  return { page: activePage, area, field, value, locator };
}

function printCurrentPage() {
  const title = pages.find(p => p[0] === activePage)?.[1] || "EMC page";
  document.body.dataset.printTitle = title;
  window.print();
}

async function downloadPageScreenshot() {
  const page = q(`.page#${CSS.escape(activePage)}`);
  if (!page) return;
  const rect = page.getBoundingClientRect();
  const clone = page.cloneNode(true);
  clone.querySelectorAll("input, textarea, select").forEach((el, index) => {
    const source = page.querySelectorAll("input, textarea, select")[index];
    if (!source) return;
    const span = document.createElement("div");
    span.textContent = source.tagName === "SELECT" ? source.options[source.selectedIndex]?.text || "" : source.value || "";
    span.setAttribute("style", "min-height:28px;border:1px solid #d4e4da;border-radius:6px;padding:6px;background:#fff;color:#12211a;white-space:pre-wrap;");
    el.replaceWith(span);
  });
  const styles = [...document.styleSheets].map(sheet => {
    try { return [...sheet.cssRules].map(rule => rule.cssText).join("\n"); }
    catch { return ""; }
  }).join("\n");
  const html = `<div xmlns="http://www.w3.org/1999/xhtml"><style>${styles}</style><div style="background:#f6fbf7;padding:16px;width:${Math.max(900, rect.width)}px;">${clone.outerHTML}</div></div>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.max(900, rect.width)}" height="${Math.max(700, page.scrollHeight + 40)}"><foreignObject width="100%" height="100%">${html}</foreignObject></svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f6fbf7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(img.src);
    const link = document.createElement("a");
    link.download = `${activePage}-${today()}-screenshot.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  img.onerror = () => {
    const link = document.createElement("a");
    link.download = `${activePage}-${today()}-screenshot.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };
  img.src = URL.createObjectURL(blob);
}

function openPhotoViewer(src, alt = "Photo") {
  let overlay = q("#photoViewerOverlay");
  if (!overlay) {
    document.body.insertAdjacentHTML("beforeend", `<div id="photoViewerOverlay" class="photo-viewer hidden"><button id="closePhotoViewer" type="button">Close</button><img id="photoViewerImage" alt=""></div>`);
    overlay = q("#photoViewerOverlay");
    q("#closePhotoViewer").onclick = () => overlay.classList.add("hidden");
    overlay.onclick = event => {
      if (event.target === overlay) overlay.classList.add("hidden");
    };
  }
  q("#photoViewerImage").src = src;
  q("#photoViewerImage").alt = alt;
  overlay.classList.remove("hidden");
}

async function downloadRawMaterialQr(variantId) {
  if (activePage === "stock") saveStockDay(false);
  const date = q("#stockDate")?.value || today();
  const variant = state.stockVariants.find(v => v.id === variantId);
  if (!variant) return;
  const row = stockRowFor(variant, date);
  const qrUrl = rawMaterialQrUrl(row, 620);
  const filename = `${safeFilename(row.name || "raw-material")}-QR.png`;
  try {
    const response = await fetch(qrUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("QR download failed");
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.click();
  }
  audit("save", "raw material QR", row.name || variant.id);
}

function rawMaterialQrPayload(row) {
  return String(row.name || "Unnamed raw material").trim();
}

function rawMaterialQrUrl(row, size = 132) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&format=png&data=${encodeURIComponent(rawMaterialQrPayload(row))}`;
}

function showRawMaterialQr(variantId) {
  if (activePage === "stock") saveStockDay(false);
  const date = q("#stockDate")?.value || today();
  const variant = state.stockVariants.find(v => v.id === variantId);
  if (!variant) return;
  const row = stockRowFor(variant, date);
  const tr = qa("#stockTable tbody tr").find(item => item.dataset.variant === variantId);
  const holder = tr?.querySelector(".qr-cell");
  if (!holder) return;
  holder.querySelector(".qr-preview")?.remove();
  const preview = document.createElement("div");
  preview.className = "qr-preview";
  preview.innerHTML = `<img src="${escapeAttr(rawMaterialQrUrl(row, 180))}" alt="QR for ${escapeAttr(row.name)}"><strong>${escapeHtml(row.name || "Unnamed raw material")}</strong><small>Scanner result: ${escapeHtml(rawMaterialQrPayload(row))}</small>`;
  holder.appendChild(preview);
}

function safeFilename(value) {
  return String(value || "download").replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "download";
}

function renderFormulation() {
  const selected = q("#productSelect").value;
  q("#productSelect").innerHTML = state.products.map(p => `<option value="${p.id}">${escapeHtml(p.short)} - ${escapeHtml(p.name)}</option>`).join("");
  if (selected && state.products.some(p => p.id === selected)) q("#productSelect").value = selected;
  const product = state.products.find(p => p.id === q("#productSelect").value) || state.products[0];
  if (!product) return;
  q("#productSelect").value = product.id;
  product.formulation ||= defaultFormulation(product.short || product.name);
  q("#formulationTitle").textContent = product.formulation.title || `${product.short} Formulation calculation and Stock Calculation`;
  q("#formulationMeta").innerHTML = `
    <label>Product name<input id="prodName" value="${escapeAttr(product.name)}"></label>
    <label>Short name<input id="prodShort" value="${escapeAttr(product.short)}"></label>
    <label>Mesh product<input id="prodMesh" value="${escapeAttr(product.meshProduct || "")}"></label>
    <label>Container number<input id="containerNo" value="${escapeAttr(product.formulation.containerNo || "")}" placeholder="Container / batch reference"></label>
    <label>Total target production kg<input id="targetTotal" type="number" value="${product.formulation.targetTotal || 0}"></label>
    <label>Target / batch kg<input id="targetBatch" type="number" value="${product.formulation.targetBatch || 0}"></label>`;
  renderFormulationRecords(product);
  renderFormulationTable(product);
}

function renderFormulationRecords(product) {
  const localHistory = state.formulationHistory.filter(item => item.productId === product.id).slice(0, 6);
  q("#formulationRecords").innerHTML = `
    <div>
      <strong>Saved formulations</strong>
      <span>${localHistory.length ? `${localHistory.length} cached record(s) for this product` : "No saved records loaded yet"}</span>
    </div>
    <select id="oldFormulationSelect">
      <option value="">Select old formulation</option>
      ${localHistory.map(item => `<option value="${item.id}">${formatDateTime(item.savedAt)}${item.containerNo ? ` - ${escapeHtml(item.containerNo)}` : ""}</option>`).join("")}
    </select>
    <button id="loadOldFormulationBtn" class="ghost" type="button">Load old formulation</button>`;
  const loadBtn = q("#loadOldFormulationBtn");
  if (loadBtn) loadBtn.onclick = loadSelectedOldFormulation;
  refreshFormulationHistory(product.id, false).then(() => {
    if (activePage === "formulation" && q("#productSelect")?.value === product.id) {
      const latest = state.formulationHistory.filter(item => item.productId === product.id).slice(0, 6);
      const select = q("#oldFormulationSelect");
      if (select && latest.length !== localHistory.length) {
        select.innerHTML = `<option value="">Select old formulation</option>${latest.map(item => `<option value="${item.id}">${formatDateTime(item.savedAt)}${item.containerNo ? ` - ${escapeHtml(item.containerNo)}` : ""}</option>`).join("")}`;
      }
    }
  });
}

function renderFormulationTable(product) {
  const f = product.formulation;
  const comps = f.components || [];
  const meshes = f.meshes || [];
  const totalPercent = sum(comps.map(c => c.percent));
  q("#formulationTable").innerHTML = `
    <thead>
      <tr><th colspan="${comps.length + 5}">${escapeHtml(f.title || "Formulation calculation and Stock Calculation")}</th></tr>
      <tr><th>Component name</th>${comps.map((c, i) => `<th><div class="component-head"><input data-comp-index="${i}" data-comp-name value="${escapeAttr(c.name)}"><button data-delete-component="${i}" class="ghost tiny-btn" title="Delete component">Delete</button></div></th>`).join("")}<th><button id="addBlendMaterialBtn" class="ghost tiny-btn" type="button" title="Add component">+ Add component</button></th><th>Total Stock</th><th>Target / Spec</th><th>Mesh action</th></tr>
    </thead>
    <tbody>
      <tr class="calc-row"><td>Total Amount Raw Material Available</td>${comps.map((c, i) => `<td><input data-comp="${i}" data-comp-field="stock" type="number" value="${c.stock || 0}"></td>`).join("")}<td></td><td>${money(sum(comps.map(c => c.stock)))}</td><td></td><td></td></tr>
      <tr class="calc-row"><td>Calculated Amount Needed as per Formulation for Total Production</td>${comps.map(c => `<td>${((Number(f.targetTotal || 0) * Number(c.percent || 0)) / 100).toFixed(1)}</td>`).join("")}<td></td><td>${money(sum(comps.map(c => (Number(f.targetTotal || 0) * Number(c.percent || 0)) / 100)))}</td><td><input id="tableTargetTotal" type="number" value="${f.targetTotal || 0}"><small>Target production kg</small></td><td></td></tr>
      <tr class="calc-row"><td>Calculated Amount Needed as per Formulation for per Batch Manufacturing</td>${comps.map(c => `<td>${((Number(f.targetBatch || 0) * Number(c.percent || 0)) / 100).toFixed(1)}</td>`).join("")}<td></td><td>${money(sum(comps.map(c => (Number(f.targetBatch || 0) * Number(c.percent || 0)) / 100)))}</td><td><input id="tableTargetBatch" type="number" value="${f.targetBatch || 0}"><small>Target / batch kg</small></td><td></td></tr>
      <tr class="section-row"><td>Mesh/Micron</td>${comps.map(() => `<td>Formulation (%)</td>`).join("")}<td></td><td>${escapeHtml(product.short)} (%)</td><td>${escapeHtml(product.short)} Ideal PSD (%)</td><td>Delete</td></tr>
      <tr><td></td>${comps.map((c, i) => `<td><input data-comp="${i}" data-comp-field="percent" type="number" step="0.01" value="${c.percent ?? ""}"></td>`).join("")}<td></td><td>${totalPercent.toFixed(2)}</td><td></td><td></td></tr>
      ${meshes.map((m, meshIndex) => `<tr data-mesh-row="${meshIndex}">
        <td><input data-mesh-field="mesh" value="${escapeAttr(m.mesh)}"></td>
        ${comps.map((c, i) => `<td><input data-comp="${i}" data-psd-mesh="${escapeAttr(m.mesh)}" type="number" step="0.01" value="${c.psd?.[m.mesh] ?? ""}"></td>`).join("")}
        <td></td>
        <td class="final-psd">${formulationPsd(comps, m.mesh).toFixed(2)}</td>
        <td><input data-mesh-field="ideal" value="${escapeAttr(m.ideal || "")}"></td>
        <td><button data-delete-mesh="${meshIndex}" class="ghost tiny-btn">Delete</button></td>
      </tr>`).join("")}
    </tbody>
    <tfoot><tr><th>Actions</th>${comps.map(() => `<th></th>`).join("")}<th></th><th></th><th><button id="addMeshRowBtn" class="ghost">Add mesh row</button></th><th></th></tr></tfoot>`;
  q("#blendScore").textContent = `Formulation total: ${totalPercent.toFixed(2)}%`;
  const addMesh = q("#addMeshRowBtn");
  if (addMesh) addMesh.onclick = addMeshRow;
  const addComponent = q("#addBlendMaterialBtn");
  if (addComponent) addComponent.onclick = addBlendMaterial;
}

function formulationPsd(comps, mesh) {
  const total = sum(comps.map(c => c.percent));
  if (!total) return 0;
  return sum(comps.map(c => Number(c.percent || 0) * Number(c.psd?.[mesh] || 0))) / total;
}

function hasUsablePsd(component, meshes) {
  return meshes.some(m => {
    const value = component.psd?.[m.mesh];
    return value !== undefined && value !== null && String(value).trim() !== "";
  });
}

function autoBlend() {
  const product = readProductForm();
  const candidates = product.formulation.components;
  if (!candidates.length) return;
  const meshes = product.formulation.meshes.filter(m => String(m.ideal || "").trim());
  const active = candidates.map((component, index) => ({ component, index })).filter(item => String(item.component.name || "").trim() && hasUsablePsd(item.component, meshes));
  candidates.forEach(component => component.percent = "");
  if (!active.length) {
    audit("save", "auto blend", `${product.short}: no usable PSD columns`);
    saveState();
    renderFormulation();
    return;
  }
  const activeComponents = active.map(item => item.component);
  const anyStock = activeComponents.some(c => Number(c.stock || 0) > 0);
  const targetTotal = Number(product.formulation.targetTotal || 0);
  let caps = activeComponents.map(c => {
    if (!anyStock) return 100;
    const stock = Number(c.stock || 0);
    if (stock <= 0) return 0;
    return targetTotal > 0 ? Math.min(100, stock / targetTotal * 100) : 100;
  });
  if (sum(caps) < 100) caps = activeComponents.map(c => Number(c.stock || 0) > 0 || !anyStock ? 100 : 0);

  const score = weights => {
    if (!meshes.length) return 0;
    const weighted = activeComponents.map((c, i) => ({ ...c, percent: weights[i] }));
    return sum(meshes.map(m => {
      const diff = formulationPsd(weighted, m.mesh) - specMidpoint(m.ideal);
      return diff * diff;
    }));
  };

  const project = weights => {
    let result = weights.map((w, i) => Math.min(Math.max(Number(w || 0), 0), caps[i]));
    let total = sum(result);
    if (!total) result = caps.map(c => c > 0 ? 1 : 0);
    for (let guard = 0; guard < 20; guard++) {
      total = sum(result) || 1;
      result = result.map(w => w / total * 100);
      let overflow = 0;
      result = result.map((w, i) => {
        if (w > caps[i]) {
          overflow += w - caps[i];
          return caps[i];
        }
        return w;
      });
      if (overflow < 0.0001) break;
      const room = result.map((w, i) => Math.max(0, caps[i] - w));
      const roomTotal = sum(room);
      if (!roomTotal) break;
      result = result.map((w, i) => w + overflow * room[i] / roomTotal);
    }
    const totalFinal = sum(result) || 1;
    return result.map(w => w / totalFinal * 100);
  };

  let best = project(activeComponents.map((c, i) => Number(c.percent || 0) || (caps[i] > 0 ? 100 / activeComponents.length : 0)));
  let bestScore = score(best);
  for (let trial = 0; trial < 1500; trial++) {
    const guess = project(caps.map(c => c * Math.random()));
    const guessScore = score(guess);
    if (guessScore < bestScore) {
      best = guess;
      bestScore = guessScore;
    }
  }
  for (let step of [5, 2, 1, 0.25, 0.05]) {
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 0; i < best.length; i++) {
        for (let j = 0; j < best.length; j++) {
          if (i === j || best[i] < step || best[j] + step > caps[j]) continue;
          const next = [...best];
          next[i] -= step;
          next[j] += step;
          const nextScore = score(next);
          if (nextScore + 0.000001 < bestScore) {
            best = next;
            bestScore = nextScore;
            improved = true;
          }
        }
      }
    }
  }
  const rounded = normalizePercentagesTo100(best, caps);
  active.forEach((item, i) => item.component.percent = rounded[i]);
  audit("save", "auto blend", product.short);
  saveState();
  renderFormulation();
}

function normalizePercentagesTo100(values, caps = []) {
  let rounded = values.map((w, i) => {
    const cap = caps[i] === undefined ? 100 : Number(caps[i] || 0);
    return Number(Math.min(Math.max(Number(w || 0), 0), cap).toFixed(2));
  });
  let diff = Number((100 - sum(rounded)).toFixed(2));
  for (let guard = 0; guard < 100 && Math.abs(diff) >= 0.01; guard++) {
    const index = diff > 0
      ? rounded.findIndex((w, i) => w < (caps[i] === undefined ? 100 : Number(caps[i] || 0)))
      : rounded.findIndex(w => w > 0);
    if (index < 0) break;
    const cap = caps[index] === undefined ? 100 : Number(caps[index] || 0);
    const step = diff > 0 ? Math.min(diff, cap - rounded[index]) : Math.max(diff, -rounded[index]);
    rounded[index] = Number((rounded[index] + step).toFixed(2));
    diff = Number((100 - sum(rounded)).toFixed(2));
  }
  if (Math.abs(sum(rounded) - 100) >= 0.01 && rounded.length) {
    const maxIndex = rounded.reduce((best, value, i) => value > rounded[best] ? i : best, 0);
    rounded[maxIndex] = Number((rounded[maxIndex] + 100 - sum(rounded)).toFixed(2));
  }
  return rounded;
}

function readProductForm() {
  const product = state.products.find(p => p.id === q("#productSelect").value);
  if (!product) return null;
  product.name = q("#prodName").value.trim();
  product.short = q("#prodShort").value.trim();
  product.meshProduct = q("#prodMesh").value.trim();
  product.formulation ||= defaultFormulation(product.short || product.name);
  product.formulation.title = `${product.short || product.name} Formulation calculation and Stock Calculation`;
  product.formulation.targetTotal = Number((q("#tableTargetTotal") || q("#targetTotal")).value || 0);
  product.formulation.targetBatch = Number((q("#tableTargetBatch") || q("#targetBatch")).value || 0);
  product.formulation.containerNo = q("#containerNo")?.value.trim() || "";
  const oldComponents = product.formulation.components || [];
  product.formulation.components = oldComponents.map((old, i) => {
    const comp = { ...old, psd: { ...(old.psd || {}) } };
    const nameInput = q(`[data-comp-index="${i}"][data-comp-name]`);
    if (nameInput) comp.name = nameInput.value.trim();
    qa(`[data-comp="${i}"][data-comp-field]`).forEach(input => comp[input.dataset.compField] = input.value);
    qa(`[data-comp="${i}"][data-psd-mesh]`).forEach(input => comp.psd[input.dataset.psdMesh] = input.value);
    return comp;
  });
  product.formulation.meshes = qa("[data-mesh-row]").map(row => {
    const obj = {};
    row.querySelectorAll("[data-mesh-field]").forEach(input => obj[input.dataset.meshField] = input.value);
    return obj;
  });
  return product;
}

async function saveProduct(doAudit = true) {
  const product = readProductForm();
  if (doAudit) audit("save", "formulation", product.short);
  await saveFormulationSnapshot(product);
  saveState();
  renderFormulation();
}

async function saveFormulationSnapshot(product) {
  const record = {
    productId: product.id,
    productName: product.name,
    productShort: product.short,
    containerNo: product.formulation.containerNo || "",
    formulation: JSON.parse(JSON.stringify(product.formulation)),
    by: user?.name || "Unknown"
  };
  try {
    const response = await fetch(apiPath("/api/formulations"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(record)
    });
    if (!response.ok) throw new Error("server formulation save failed");
    const data = await response.json();
    mergeFormulationHistory(data.record ? [data.record] : data.history || []);
  } catch (error) {
    const localRecord = { ...record, id: id(), savedAt: new Date().toISOString(), localOnly: true };
    state.formulationHistory.unshift(localRecord);
  }
}

async function refreshFormulationHistory(productId = "", force = false) {
  try {
    const url = productId ? `/api/formulations?productId=${encodeURIComponent(productId)}` : "/api/formulations";
    const response = await fetch(apiPath(url), { cache: "no-store" });
    if (!response.ok) throw new Error("history unavailable");
    const data = await response.json();
    mergeFormulationHistory(data.history || []);
  } catch (error) {
    if (force) alert("Could not load formulation history from server. Local cached records are still shown.");
  }
  saveState();
  return state.formulationHistory.filter(item => !productId || item.productId === productId);
}

function mergeFormulationHistory(records) {
  const byId = new Map(state.formulationHistory.map(item => [item.id, item]));
  records.forEach(item => {
    if (item?.id) byId.set(item.id, item);
  });
  state.formulationHistory = [...byId.values()].sort((a, b) => String(b.savedAt || "").localeCompare(String(a.savedAt || "")));
}

async function handleProductFormulationChoice() {
  const product = state.products.find(p => p.id === q("#productSelect").value);
  if (!product) return renderFormulation();
  const history = await refreshFormulationHistory(product.id, false);
  if (history.length && confirm("Old formulation found for this product. Press OK for old formulation, or Cancel for new blank formulation.")) {
    renderFormulation();
    q("#oldFormulationSelect").value = history[0].id;
    loadSelectedOldFormulation();
    return;
  }
  makeNewFormulation(false);
}

function makeNewFormulation(doAudit = true) {
  const product = state.products.find(p => p.id === q("#productSelect").value);
  if (!product) return;
  const previous = product.formulation || defaultFormulation(product.short || product.name);
  product.formulation = {
    title: `${product.short || product.name} Formulation calculation and Stock Calculation`,
    targetTotal: previous.targetTotal || 0,
    targetBatch: previous.targetBatch || 0,
    containerNo: "",
    components: (previous.components?.length ? previous.components : defaultFormulation(product.short || product.name).components)
      .map(() => ({ id: id(), name: "", stock: "", percent: "", psd: {} })),
    meshes: (previous.meshes?.length ? previous.meshes : defaultFormulation(product.short || product.name).meshes)
      .map(() => ({ mesh: "", ideal: "" }))
  };
  if (doAudit) audit("add", "new formulation", product.short);
  saveState();
  renderFormulation();
}

function loadSelectedOldFormulation() {
  const selectedId = q("#oldFormulationSelect")?.value;
  if (!selectedId) return;
  loadFormulationRecord(selectedId);
}

function loadFormulationRecord(recordId) {
  const record = state.formulationHistory.find(item => item.id === recordId);
  if (!record) return;
  const product = state.products.find(p => p.id === record.productId) || state.products.find(p => p.short === record.productShort);
  if (!product) return;
  product.formulation = JSON.parse(JSON.stringify(record.formulation || defaultFormulation(product.short || product.name)));
  activePage = "formulation";
  saveState();
  render();
  q("#productSelect").value = product.id;
  renderFormulation();
}

function addProduct() {
  state.products.push({ id: id(), name: "New Product", short: "NEW", meshProduct: "", d90: "", d50: "", d10: "", targetKg: 2000, specs: psdMeshDefault.map(mesh => ({ mesh, ideal: 0 })), blend: [], formulation: defaultFormulation("NEW") });
  audit("add", "product", "New Product");
  saveState();
  renderFormulation();
}

function addBlendMaterial() {
  const product = readProductForm();
  product.formulation.components.push({ id: id(), name: "", stock: "", percent: "", psd: {} });
  audit("add", "formulation component", product.short);
  saveState();
  renderFormulation();
}

function addMeshRow() {
  const product = readProductForm();
  product.formulation.meshes.push({ mesh: "New", ideal: "" });
  audit("add", "formulation mesh", product.short);
  saveState();
  renderFormulation();
}

function specMidpoint(spec) {
  const text = String(spec || "").replace(/\s/g, "");
  if (text.startsWith("<")) return Number(text.slice(1)) || 0;
  const parts = text.split("-").map(Number).filter(n => !Number.isNaN(n));
  if (parts.length === 2) return (parts[0] + parts[1]) / 2;
  return Number(text) || 0;
}

function exportCurrentFormulation() {
  const product = readProductForm();
  saveState();
  const f = product.formulation;
  const componentRows = [["Raw material","Available kg","Formulation %","Total target kg","Per batch kg"], ...f.components.map(c => [c.name, c.stock, c.percent, (Number(f.targetTotal || 0) * Number(c.percent || 0)) / 100, (Number(f.targetBatch || 0) * Number(c.percent || 0)) / 100])];
  const psdRows = [["Mesh/Micron", "Final PSD %", "Ideal PSD %", ...f.components.map(c => c.name)], ...f.meshes.map(m => [m.mesh, formulationPsd(f.components, m.mesh).toFixed(2), m.ideal, ...f.components.map(c => c.psd?.[m.mesh] || 0)])];
  downloadXls(`${product.short || product.name}-formulation.xls`, spreadsheetXml([
    { name: "Formulation", rows: [["Product", product.name], ["Short name", product.short], ["Total target kg", f.targetTotal], ["Target batch kg", f.targetBatch], [], ...componentRows] },
    { name: "PSD Matrix", rows: psdRows }
  ]));
  audit("save", "formulation excel export", product.short);
}

function renderActivity() {
  const date = q("#activityDate").value;
  const rec = activityRecord(date);
  q("#activitySlots").innerHTML = activityTable("work", rec.work, ["Date", "Shift", "Person name", "Activity"]);
}

function renderTomorrow() {
  const date = q("#planDate").value;
  const rec = activityRecord(date);
  q("#planSlots").innerHTML = activityTable("plan", rec.plan, ["Date", "Shift", "Person name", "Planned works"]);
}

function activityRecord(date) {
  const key = `${date}|All`;
  if (!state.activity[key]) {
    state.activity[key] = {
      work: [
        { date, shift: "Day shift", person: "KP", text: "" },
        { date, shift: "Day shift", person: "PP", text: "" },
        { date, shift: "Day shift", person: "SD", text: "" },
        { date, shift: "Night shift", person: "SM", text: "" },
        { date, shift: "Night shift", person: "SD", text: "" }
      ],
      plan: [
        { date, shift: "Day shift", person: "KP", text: "" },
        { date, shift: "Day shift", person: "PP", text: "" },
        { date, shift: "Day shift", person: "SD", text: "" },
        { date, shift: "Night shift", person: "SM", text: "" },
        { date, shift: "Night shift", person: "SD", text: "" }
      ]
    };
  }
  return state.activity[key];
}

function activityTable(type, rows, headers) {
  const selectedDate = type === "plan" ? q("#planDate").value : q("#activityDate").value;
  return `<div class="table-wrap compact-wrap"><table class="activity-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}<th>Delete</th></tr></thead><tbody>${rows.map((r, i) => `<tr data-${type}="${i}">
    <td><input data-afield="date" type="date" value="${escapeAttr((r.date || selectedDate || today()).slice(0, 10))}"></td>
    <td><select data-afield="shift"><option ${r.shift === "Day shift" ? "selected" : ""}>Day shift</option><option ${r.shift === "Night shift" ? "selected" : ""}>Night shift</option></select></td>
    <td><input data-afield="person" value="${escapeAttr(r.person || r.employee || "")}" placeholder="Person name"></td>
    <td><textarea data-afield="text" rows="2">${escapeHtml(r.text || "")}</textarea></td>
    <td><button data-delete-activity="${type}:${i}" class="ghost">Delete</button></td>
  </tr>`).join("")}</tbody></table></div>`;
}

function addActivityRow() {
  const rec = activityRecord(q("#activityDate").value);
  rec.work.push({ date: q("#activityDate").value, shift: "Day shift", person: "", text: "" });
  saveState();
  renderActivity();
}

function addPlanRow() {
  const rec = activityRecord(q("#planDate").value);
  rec.plan.push({ date: q("#planDate").value, shift: "Day shift", person: "", text: "" });
  saveState();
  renderTomorrow();
}

function taskStatus(task) {
  if (task.kind === "Completed" || task.completionDate) return "Completed";
  if (task.timeline && toIsoDate(task.timeline) && toIsoDate(task.timeline) < today()) return "Timeline Failed";
  return "Open";
}

function taskDelayDays(task) {
  const due = toIsoDate(task.timeline);
  if (!due || taskStatus(task) === "Completed") return Number(task.achievementDay || 0) || 0;
  return Math.max(0, Math.ceil((new Date(`${today()}T00:00:00`) - new Date(`${due}T00:00:00`)) / 86400000));
}

function taskScore(task) {
  const rating = ratioToPercent(task.rating);
  const statusScore = ratioToPercent(task.status);
  const base = rating || statusScore;
  const delayPenalty = taskStatus(task) === "Timeline Failed" ? Math.min(40, taskDelayDays(task) * 3) : 0;
  return Math.max(0, Math.min(100, base - delayPenalty));
}

function renderTaskAllocation() {
  const filter = q("#taskFilter").value;
  const personSearch = (q("#taskPersonSearch").value || "").trim().toLowerCase();
  refreshTaskPersonList();
  const rows = (state.tasks || []).filter(t => {
    const statusMatch = !filter || taskStatus(t) === filter;
    const personText = `${t.responsible || ""} ${t.assistant || ""}`.toLowerCase();
    const personMatch = !personSearch || personText.includes(personSearch);
    return statusMatch && personMatch;
  });
  const completed = state.tasks.filter(t => taskStatus(t) === "Completed").length;
  const delayed = state.tasks.filter(t => taskStatus(t) === "Timeline Failed").length;
  const avgScore = state.tasks.length ? sum(state.tasks.map(taskScore)) / state.tasks.length : 0;
  q("#taskMetrics").innerHTML = [
    ["Total tasks", state.tasks.length],
    ["Open / pending", state.tasks.length - completed],
    ["Completed", completed],
    ["Timeline failed", delayed],
    ["Avg score", avgScore.toFixed(1)]
  ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");
  const headers = ["Type", ...taskReference.headers, "Remarks", "Delete"];
  q("#taskTable").innerHTML = `<thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(taskRowHtml).join("")}</tbody>`;
  renderTaskGraphs();
}

function taskPeople() {
  const names = new Set();
  (state.tasks || []).forEach(task => {
    [task.responsible, task.assistant].forEach(value => String(value || "").split(/[,/&]+/).map(name => name.trim()).filter(Boolean).forEach(name => names.add(name)));
  });
  return [...names].sort((a, b) => a.localeCompare(b));
}

function refreshTaskPersonList() {
  const list = q("#taskPersonList");
  if (!list) return;
  list.innerHTML = taskPeople().map(name => `<option value="${escapeAttr(name)}"></option>`).join("");
}

function taskPerformerScores() {
  const people = {};
  (state.tasks || []).forEach(task => {
    const names = String(task.responsible || "").split(/[,/&]+/).map(name => name.trim()).filter(Boolean);
    names.forEach(name => {
      people[name] ||= [];
      people[name].push(taskScore(task));
    });
  });
  return Object.entries(people).map(([name, scores]) => ({ name, score: sum(scores) / scores.length, tasks: scores.length }));
}

function goodPerformer() {
  return taskPerformerScores().sort((a, b) => b.score - a.score || b.tasks - a.tasks)[0] || null;
}

function poorPerformer() {
  return taskPerformerScores().sort((a, b) => a.score - b.score || b.tasks - a.tasks)[0] || null;
}

function criticalSpareRows() {
  return (state.machines || []).flatMap(machine => (machine.spares || [])
    .filter(spare => Number(spare.stock || 0) <= Number(spare.reorder || 0))
    .map(spare => ({ machine: machine.name || "Machine", part: spare.part || "Spare", specification: spare.specification || "", stock: Number(spare.stock || 0), reorder: Number(spare.reorder || 0) })));
}

function taskRowHtml(t) {
  return `<tr data-task="${t.id}">
    <td><select data-task-field="kind">${["Open","Completed"].map(v => `<option ${t.kind === v ? "selected" : ""}>${v}</option>`).join("")}</select></td>
    <td><input data-task-field="category" value="${escapeAttr(t.category || "")}"></td>
    <td><textarea data-task-field="work" rows="3" placeholder="Work to be done">${escapeHtml(t.work || "")}</textarea></td>
    <td><input data-task-field="priority" value="${escapeAttr(t.priority || "")}"></td>
    <td><input data-task-field="responsible" value="${escapeAttr(t.responsible || "")}"></td>
    <td><input data-task-field="assistant" value="${escapeAttr(t.assistant || "")}"></td>
    <td><input data-task-field="allocationDate" value="${escapeAttr(t.allocationDate || "")}" placeholder="dd-mm-yyyy"></td>
    <td><input data-task-field="timeline" value="${escapeAttr(t.timeline || "")}" placeholder="dd-mm-yyyy"></td>
    <td><input data-task-field="status" value="${escapeAttr(t.status || "")}" placeholder="0/10, 5/10, etc."></td>
    <td><input data-task-field="completionDate" value="${escapeAttr(t.completionDate || "")}" placeholder="dd-mm-yyyy"></td>
    <td><input data-task-field="achievementDay" value="${escapeAttr(t.achievementDay || "")}"></td>
    <td><input data-task-field="rating" value="${escapeAttr(t.rating || "")}"></td>
    <td><input data-task-field="remarks" value="${escapeAttr(t.remarks || "")}"></td>
    <td><button data-delete-task="${t.id}" class="ghost">Delete</button></td>
  </tr>`;
}

function renderTaskGraphs() {
  const counts = ["Open","Completed","Timeline Failed"].map(status => [status, state.tasks.filter(t => taskStatus(t) === status).length]);
  q("#taskGraph").innerHTML = counts.map(([label, value]) => chartBar(label, value, Math.max(1, state.tasks.length))).join("") || "<p>No tasks yet.</p>";
  const people = {};
  state.tasks.forEach(t => {
    const name = t.responsible || "Unassigned";
    people[name] ||= [];
    people[name].push(taskScore(t));
  });
  q("#taskScoreGraph").innerHTML = Object.entries(people).map(([name, scores]) => chartBar(name, sum(scores) / scores.length, 100)).join("") || "<p>No scores yet.</p>";
}

function chartBar(label, value, max) {
  const pct = Math.max(2, Math.min(100, Number(value || 0) / Number(max || 1) * 100));
  return `<div class="chart-row"><span>${escapeHtml(label)}</span><div><i style="width:${pct}%"></i></div><strong>${Number(value || 0).toFixed(value % 1 ? 1 : 0)}</strong></div>`;
}

function addTask() {
  state.tasks.unshift(normalizeReferenceTask({ id: id(), kind: "Open", allocationDate: today(), responsible: user?.name || "" }));
  audit("add", "task allocation", "New task");
  saveState();
  renderTaskAllocation();
}

function saveTasks() {
  const edited = new Map(qa("[data-task]").map(row => [row.dataset.task, normalizeReferenceTask({ id: row.dataset.task, ...readSmallRow(row, "taskField") })]));
  state.tasks = (state.tasks || []).map(task => edited.get(task.id) || task);
  edited.forEach((task, taskId) => {
    if (!state.tasks.some(existing => existing.id === taskId)) state.tasks.push(task);
  });
  audit("save", "task allocation", `${state.tasks.length} tasks`);
  saveState();
  render();
}

const KPI_CATEGORIES = ["Production target table (Blending plan)", "Budget & finance", "General Targets", "Safety related targets", "Housekeeping and cleanliness targets", "Upgradation targets"];

function normalizeKpi(row = {}) {
  return {
    id: row.id || id(),
    date: row.date || today(),
    category: row.category || KPI_CATEGORIES[0],
    product: row.product || "",
    objective: row.objective || "",
    target: row.target || "",
    achieved: row.achieved || "",
    achievedPercent: row.achievedPercent || "",
    owner: row.owner || currentUserName(),
    remarks: row.remarks || ""
  };
}

function addKpiRow() {
  state.kpi ||= [];
  state.kpi.unshift(normalizeKpi({ date: q("#kpiAnchorDate").value || today() }));
  audit("add", "KPI", "New KPI objective");
  saveState();
  renderKpi();
}

function saveKpi() {
  const edited = qa("[data-kpi]").map(row => normalizeKpi({ id: row.dataset.kpi, ...readSmallRow(row, "kpiField") }));
  const editedMap = new Map(edited.map(row => [row.id, row]));
  state.kpi = (state.kpi || []).map(row => editedMap.get(row.id) || row);
  editedMap.forEach((row, rowId) => {
    if (!state.kpi.some(existing => existing.id === rowId)) state.kpi.push(row);
  });
  audit("save", "KPI", `${state.kpi.length} KPI rows`);
  saveState();
  renderKpi();
}

function renderKpi() {
  state.kpi ||= [];
  if (!q("#kpiAnchorDate").value) q("#kpiAnchorDate").value = today();
  renderKpiCategoryFilter();
  const rows = filteredKpiRows();
  const avg = rows.length ? sum(rows.map(row => Number(row.achievedPercent || 0))) / rows.length : 0;
  const critical = rows.filter(row => Number(row.achievedPercent || 0) < 70);
  q("#kpiMetrics").innerHTML = [
    ["Visible KPI rows", rows.length],
    ["Average achieved", `${avg.toFixed(1)}%`],
    ["Critical <70%", critical.length],
    ["Categories", new Set(rows.map(row => row.category)).size]
  ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");
  q("#kpiProgressGraph").innerHTML = kpiCategoryScores(rows).map(([label, value]) => chartBar(label, value, 100)).join("") || "<p>No KPI data in this period.</p>";
  q("#kpiCritical").innerHTML = critical.slice(0, 8).map(row => `<div class="summary-item"><strong>${escapeHtml(row.category)}</strong><br>${escapeHtml(row.objective || "Objective")}<br><small>${Number(row.achievedPercent || 0)}% achieved - ${escapeHtml(row.owner || "")}</small></div>`).join("") || "<p>No critical KPI below 70%.</p>";
  q("#kpiTable").innerHTML = `<thead><tr>${["Date","Category","Product","Objective / slot","Target","Achieved value","Achieved %","Owner","Remarks","Delete"].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(kpiRowHtml).join("")}</tbody>`;
}

function renderKpiCategoryFilter() {
  const selected = q("#kpiCategoryFilter").value || "";
  const categories = [...new Set([...KPI_CATEGORIES, ...(state.kpi || []).map(row => row.category).filter(Boolean)])];
  q("#kpiCategoryFilter").innerHTML = `<option value="">All KPI categories</option>${categories.map(category => `<option ${selected === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}`;
}

function kpiRowHtml(row) {
  const products = ["", ...(state.products || []).map(product => product.name || product.short || "").filter(Boolean)];
  const categories = [...new Set([...KPI_CATEGORIES, row.category].filter(Boolean))];
  return `<tr data-kpi="${row.id}">
    <td><input data-kpi-field="date" type="date" value="${escapeAttr(row.date || today())}"></td>
    <td><select data-kpi-field="category">${categories.map(category => `<option ${row.category === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}</select></td>
    <td><select data-kpi-field="product">${products.map(product => `<option value="${escapeAttr(product)}" ${row.product === product ? "selected" : ""}>${escapeHtml(product || "Not product specific")}</option>`).join("")}</select></td>
    <td><textarea data-kpi-field="objective" rows="3" placeholder="Wide area for objective, action, or target slot">${escapeHtml(row.objective || "")}</textarea></td>
    <td><textarea data-kpi-field="target" rows="3" placeholder="Target / plan">${escapeHtml(row.target || "")}</textarea></td>
    <td><textarea data-kpi-field="achieved" rows="3" placeholder="Actual achieved value">${escapeHtml(row.achieved || "")}</textarea></td>
    <td><input data-kpi-field="achievedPercent" type="number" min="0" max="100" step="0.1" value="${escapeAttr(row.achievedPercent || "")}" placeholder="%"></td>
    <td><input data-kpi-field="owner" value="${escapeAttr(row.owner || "")}"></td>
    <td><textarea data-kpi-field="remarks" rows="3">${escapeHtml(row.remarks || "")}</textarea></td>
    <td><button data-delete-kpi="${row.id}" class="ghost">Delete</button></td>
  </tr>`;
}

function filteredKpiRows() {
  const category = q("#kpiCategoryFilter").value || "";
  const period = q("#kpiPeriod").value || "all";
  const anchor = q("#kpiAnchorDate").value || today();
  return (state.kpi || []).filter(row => {
    if (category && row.category !== category) return false;
    if (period === "all") return true;
    return dateInPeriod(row.date, anchor, period);
  });
}

function dateInPeriod(value, anchor, period) {
  const row = new Date(value || "");
  const base = new Date(anchor || "");
  if (Number.isNaN(row.getTime()) || Number.isNaN(base.getTime())) return false;
  if (period === "year") return row.getFullYear() === base.getFullYear();
  if (period === "month") return row.getFullYear() === base.getFullYear() && row.getMonth() === base.getMonth();
  if (period === "quarter") return row.getFullYear() === base.getFullYear() && Math.floor(row.getMonth() / 3) === Math.floor(base.getMonth() / 3);
  if (period === "week") {
    const start = new Date(base);
    start.setDate(base.getDate() - ((base.getDay() + 6) % 7));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return row >= start && row < end;
  }
  return true;
}

function kpiCategoryScores(rows) {
  const groups = {};
  rows.forEach(row => {
    groups[row.category || "KPI"] ||= [];
    groups[row.category || "KPI"].push(Number(row.achievedPercent || 0));
  });
  return Object.entries(groups).map(([label, values]) => [label, sum(values) / values.length]);
}

function addLongPlan() {
  state.longPlans.unshift({ id: id(), date: today(), plan: "", timeline: "", allottedBy: user?.name || "" });
  audit("add", "long term plan", "New plan");
  saveState();
  renderLongPlans();
}

function renderLongPlans() {
  q("#longPlansTable").innerHTML = `<thead><tr>${["Date","Plan","Timeline","Allotted by?","Delete"].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${(state.longPlans || []).map(plan => `<tr data-long-plan="${plan.id}">
    <td><input data-long-field="date" type="date" value="${plan.date || today()}"></td>
    <td><textarea data-long-field="plan" rows="4" placeholder="Wide long-term plan">${escapeHtml(plan.plan || "")}</textarea></td>
    <td><input data-long-field="timeline" value="${escapeAttr(plan.timeline || "")}" placeholder="Example: Q3 2026 / 6 months"></td>
    <td><input data-long-field="allottedBy" value="${escapeAttr(plan.allottedBy || "")}"></td>
    <td><button data-delete-long-plan="${plan.id}" class="ghost">Delete</button></td>
  </tr>`).join("")}</tbody>`;
}

function saveLongPlans() {
  state.longPlans = qa("[data-long-plan]").map(row => ({ id: row.dataset.longPlan, ...readSmallRow(row, "longField") }));
  audit("save", "long term plans", `${state.longPlans.length} plans`);
  saveState();
  renderLongPlans();
}

function saveActivity() {
  const key = `${q("#activityDate").value}|All`;
  const rec = activityRecord(q("#activityDate").value);
  state.activity[key] = {
    work: qa("[data-work]").map(row => readSmallRow(row, "afield")),
    plan: rec.plan || []
  };
  audit("save", "activity", key);
  saveState();
  renderActivity();
}

function saveTomorrow() {
  const key = `${q("#planDate").value}|All`;
  const rec = activityRecord(q("#planDate").value);
  state.activity[key] = {
    work: rec.work || [],
    plan: qa("[data-plan]").map(row => readSmallRow(row, "afield"))
  };
  audit("save", "tomorrow plan", key);
  saveState();
  renderTomorrow();
}

function renderIdeas() {
  q("#ideasTable").innerHTML = `<thead><tr>${["By whom","Date","Regarding what","Details","Approval status","Approved by","Photo / file","Delete"].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${state.ideas.map(i => `<tr data-idea="${i.id}">
    <td><input data-ifield="by" value="${escapeAttr(i.by || "")}"></td><td><input data-ifield="date" type="date" value="${i.date || today()}"></td>
    <td><input data-ifield="regarding" value="${escapeAttr(i.regarding || "")}"></td>
    <td><textarea data-ifield="details" rows="4" placeholder="Write full suggestion / issue / approval details">${escapeHtml(i.details || "")}</textarea></td>
    <td><select data-ifield="status">${["Pending","Under review","Approved","Rejected"].map(s => `<option ${i.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></td>
    <td><input data-ifield="approvedBy" value="${escapeAttr(i.approvedBy || "")}"></td>
    <td><input data-idea-upload="${i.id}" type="file"><small>${i.attachmentName ? `Attached: ${escapeHtml(i.attachmentName)}` : "Choose photo or file"}</small>${i.attachmentData ? `<a class="file-link" href="${escapeAttr(i.attachmentData)}" download="${escapeAttr(i.attachmentName || "suggestion-file")}">Download</a>` : ""}</td>
    <td><button data-delete-idea="${i.id}" class="ghost">Delete</button></td>
  </tr>`).join("")}</tbody>`;
}

function renderNotification() {
  q("#skmText").value = state.skm.text;
  q("#readReceipts").innerHTML = state.skm.receipts.map(r => `<div class="summary-item">${escapeHtml(r.name)} read on ${new Date(r.at).toLocaleString()}</div>`).join("") || "<p>No read receipts yet.</p>";
}

function addIdea() {
  state.ideas.unshift({ id: id(), by: user?.name || "", date: today(), regarding: "", details: "", status: "Pending", approvedBy: "", attachmentName: "", attachmentData: "" });
  audit("add", "suggestion", "Approval item");
  saveState();
  renderIdeas();
}

function saveIdeas(doAudit = true, doRender = true) {
  state.ideas = qa("#ideasTable tbody tr").map(row => {
    const existing = state.ideas.find(i => i.id === row.dataset.idea) || {};
    return { id: row.dataset.idea, attachmentName: existing.attachmentName || "", attachmentData: existing.attachmentData || "", ...readSmallRow(row, "ifield") };
  });
  if (doAudit) audit("save", "suggestions", `${state.ideas.length} items`);
  saveState();
  if (doRender) renderIdeas();
}

function saveSkm() {
  state.skm = { text: q("#skmText").value.trim(), receipts: [] };
  audit("save", "SKM notification", "Published");
  saveState();
  render();
}

function markSkmRead() {
  state.skm.receipts = state.skm.receipts.filter(r => r.userId !== user.id);
  state.skm.receipts.push({ userId: user.id, name: currentUserName(), at: new Date().toISOString() });
  audit("save", "SKM read receipt", currentUserName());
  saveState();
  renderDashboard();
}

function renderGrn() {
  state.grnHeadings ||= [];
  if (q("#deleteGrnHeadingSelect")) {
    q("#deleteGrnHeadingSelect").innerHTML = state.grnHeadings.map(h => `<option value="${escapeAttr(h.id)}">${escapeHtml(h.name)}</option>`).join("") || `<option value="">No custom heading</option>`;
  }
  q("#grnTable").innerHTML = `<thead><tr>${["Type","Date","Supplier / Receiver","Invoice no","Material","Qty kg","PSD update","Remarks", ...state.grnHeadings.map(h => h.name), "Delete"].map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${state.grn.map(g => `<tr data-grn="${g.id}">
    <td><select data-gfield="type"><option ${g.type === "Incoming" ? "selected" : ""}>Incoming</option><option ${g.type === "Outgoing" ? "selected" : ""}>Outgoing</option></select></td>
    <td><input data-gfield="date" type="date" value="${g.date || today()}"></td><td><input data-gfield="party" value="${escapeAttr(g.party || "")}"></td>
    <td><input data-gfield="invoice" value="${escapeAttr(g.invoice || "")}"></td><td><input data-gfield="material" value="${escapeAttr(g.material || "")}"></td>
    <td><input data-gfield="qty" type="number" value="${g.qty || ""}"></td><td><input data-gfield="psd" value="${escapeAttr(g.psd || "")}" placeholder="Mesh PSD / lab update"></td>
    <td><input data-gfield="remarks" value="${escapeAttr(g.remarks || "")}"></td>
    ${state.grnHeadings.map(h => `<td><input data-gcustom="${escapeAttr(h.id)}" value="${escapeAttr(g.custom?.[h.id] || "")}"></td>`).join("")}
    <td><button data-delete-grn="${g.id}" class="ghost">Delete</button></td>
  </tr>`).join("")}</tbody>`;
}

function addGrn() {
  state.grn.unshift({ id: id(), type: "Incoming", date: today(), party: "", invoice: "", material: "", qty: "", psd: "", remarks: "", custom: {} });
  audit("add", "GRN", "New row");
  saveState();
  renderGrn();
}

function saveGrn() {
  state.grn = qa("#grnTable tbody tr").map(row => {
    const custom = {};
    row.querySelectorAll("[data-gcustom]").forEach(input => custom[input.dataset.gcustom] = input.value);
    return { id: row.dataset.grn, ...readSmallRow(row, "gfield"), custom };
  });
  audit("save", "GRN", `${state.grn.length} rows`);
  saveState();
  renderGrn();
}

function addGrnHeading() {
  const name = q("#newGrnHeading").value.trim();
  if (!name) return;
  state.grnHeadings ||= [];
  if (!state.grnHeadings.some(h => h.name.toLowerCase() === name.toLowerCase())) {
    state.grnHeadings.push({ id: id(), name });
    audit("add", "GRN heading", name);
  }
  q("#newGrnHeading").value = "";
  saveState();
  renderGrn();
}

function deleteGrnHeading() {
  const headingId = q("#deleteGrnHeadingSelect").value;
  if (!headingId) return;
  const heading = (state.grnHeadings || []).find(h => h.id === headingId);
  if (!heading) return;
  if (!confirm(`Delete GRN heading "${heading.name}"?`)) return;
  state.grnHeadings = state.grnHeadings.filter(h => h.id !== headingId);
  state.grn.forEach(g => {
    if (g.custom) delete g.custom[headingId];
  });
  audit("delete", "GRN heading", heading.name);
  saveState();
  renderGrn();
}

function renderMesh() {
  q("#meshTable").innerHTML = `<thead><tr><th>U.S. Mesh</th><th>Microns</th><th>Inches</th><th>Millimeters</th></tr></thead><tbody>${state.mesh.map(m => `<tr data-mesh="${m.id}">
    <td>${escapeHtml(m.mesh)}</td><td>${escapeHtml(m.microns)}</td>
    <td>${escapeHtml(m.inches)}</td><td>${escapeHtml(m.millimeters)}</td>
  </tr>`).join("")}</tbody>`;
}

function saveMesh() {
  state.mesh = qa("#meshTable tbody tr").map(row => ({ id: row.dataset.mesh, ...readSmallRow(row, "mfield") }));
  audit("save", "mesh conversion", `${state.mesh.length} rows`);
  saveState();
  renderMesh();
}

function renderAudit() {
  refreshSharedAudit(false);
  paintAuditRows();
}

async function renderUsers() {
  if (!isAdmin() || !adminUnlocked) return;
  await loadUsers();
  renderAdminRequests();
  q("#usersTable").innerHTML = `<thead><tr>${userTableHeaders().map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${accountUsers.map(userRowHtml).join("")}</tbody>`;
  loadBackups();
  loadAdminChatArchive();
}

async function loadUsers() {
  try {
    const response = await fetch(apiPath("/api/users"), { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Cannot load users");
    accountUsers = data.users || [];
    adminRequests = data.passwordRequests || [];
  } catch (error) {
    q("#usersTable").innerHTML = `<tbody><tr><td>${escapeHtml(error.message)}</td></tr></tbody>`;
  }
}

function renderAdminRequests() {
  const box = q("#adminRequests");
  if (!box) return;
  const pendingUsers = (accountUsers || []).filter(account => account.status === "Pending");
  const open = (adminRequests || []).filter(req => req.status !== "Closed");
  const approvals = pendingUsers.map(account => `<div class="summary-item admin-alert approval-alert">
    <strong>New user approval pending</strong><br>
    ${escapeHtml(account.name || account.username || "New user")} requested access as <b>${escapeHtml(account.username || "")}</b>.<br>
    <small>${escapeHtml(account.email || "No email provided")}</small><br>
    <button class="ghost" data-approve-pending-user="${account.id}">Approve now</button>
  </div>`);
  const resets = open.map(req => `<div class="summary-item admin-alert password-alert">
    <strong>Password reset request</strong><br>
    ${escapeHtml(req.matchedName || req.identifier)} requested password help. Enter a new password in that user's <b>Create / reset password</b> box, click <b>Save users</b>, then mark handled.<br>
    <small>${formatDateTime(req.at)} - ${escapeHtml(req.identifier)}</small><br>
    <button class="ghost" data-clear-password-request="${req.id}">Mark handled</button>
  </div>`);
  box.innerHTML = [...approvals, ...resets].join("") || "<p>No Admin-only notifications.</p>";
}

function userTableHeaders() {
  return ["Username","Name","Email","Employee ID","Role","Status","Create / reset password","Last login","Actions"];
}

function userRowHtml(account) {
  const isSelf = account.id === user?.id;
  return `<tr data-user-row="${account.id}">
    <td><input data-user-field="username" value="${escapeAttr(account.username || "")}" placeholder="username"></td>
    <td><input data-user-field="name" value="${escapeAttr(account.name || "")}"></td>
    <td><input data-user-field="email" value="${escapeAttr(account.email || "")}" placeholder="name@company.com"></td>
    <td><input data-user-field="employeeId" value="${escapeAttr(account.employeeId || "")}" placeholder="Employee code"></td>
    <td><select data-user-field="role">${["Staff","Manager","View only","Admin"].map(role => `<option ${account.role === role ? "selected" : ""}>${role}</option>`).join("")}</select></td>
    <td><select data-user-field="status" ${isSelf ? "disabled" : ""}>${["Pending","Active","Disabled"].map(status => `<option ${account.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
    <td><input data-user-field="password" type="password" placeholder="${account.id.startsWith("new-") ? "Required" : "Leave blank to keep"}"></td>
    <td>${account.lastLogin ? formatDateTime(account.lastLogin) : "Never"}</td>
    <td>${account.status === "Pending" ? `<button data-approve-user="${account.id}" class="ghost">Approve</button>` : ""}${account.status === "Disabled" ? `<button data-enable-user="${account.id}" class="ghost" ${isSelf ? "disabled" : ""}>Enable</button>` : `<button data-disable-user="${account.id}" class="ghost" ${isSelf ? "disabled" : ""}>Disable</button>`}<button data-remove-user="${account.id}" class="ghost" ${isSelf ? "disabled" : ""}>Remove</button></td>
  </tr>`;
}

function addUserRow() {
  accountUsers.unshift({ id: `new-${id()}`, username: "", name: "", email: "", employeeId: "", role: "Staff", status: "Active", lastLogin: "" });
  q("#usersTable").innerHTML = `<thead><tr>${userTableHeaders().map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${accountUsers.map(userRowHtml).join("")}</tbody>`;
}

async function saveUsers() {
  const rows = qa("[data-user-row]").map(row => ({ id: row.dataset.userRow, ...readSmallRow(row, "userField") }));
  try {
    for (const row of rows) {
      const payload = { ...row, id: row.id.startsWith("new-") ? "" : row.id };
      const response = await fetch(apiPath("/api/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ user: payload })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "User save failed");
      accountUsers = data.users || accountUsers;
    }
    audit("save", "user management", `${rows.length} user accounts updated`);
    await renderUsers();
  } catch (error) {
    q("#usersTable").insertAdjacentHTML("beforebegin", `<p class="error">${escapeHtml(error.message)}</p>`);
  }
}

async function removeUser(userId) {
  const row = q(`[data-user-row="${CSS.escape(userId)}"]`);
  const name = row?.querySelector('[data-user-field="name"]')?.value || userId;
  if (userId.startsWith("new-")) {
    accountUsers = accountUsers.filter(item => item.id !== userId);
    await renderUsers();
    return;
  }
  if (!confirm(`Remove login access for ${name}? Audit history will remain.`)) return;
  try {
    const response = await fetch(apiPath(`/api/users/${encodeURIComponent(userId)}`), {
      method: "DELETE",
      headers: authHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Remove user failed");
    accountUsers = data.users || [];
    audit("delete", "user account", name);
    await renderUsers();
  } catch (error) {
    q("#usersTable").insertAdjacentHTML("beforebegin", `<p class="error">${escapeHtml(error.message)}</p>`);
  }
}

async function clearPasswordRequest(requestId) {
  try {
    const response = await fetch(apiPath(`/api/password-requests/${encodeURIComponent(requestId)}`), {
      method: "DELETE",
      headers: authHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not clear request");
    adminRequests = data.passwordRequests || [];
    renderAdminRequests();
  } catch (error) {
    q("#adminRequests").insertAdjacentHTML("beforebegin", `<p class="error">${escapeHtml(error.message)}</p>`);
  }
}

async function loadBackups() {
  const box = q("#backupList");
  if (!box || !isAdmin() || !adminUnlocked) return;
  box.innerHTML = "<p>Loading backups...</p>";
  try {
    const response = await fetch(apiPath("/api/backups"), { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load backups");
    const backups = data.backups || [];
    box.innerHTML = backups.slice(0, 80).map(item => `<div class="summary-item">
      <strong>${escapeHtml(item.type)}</strong><br>
      ${escapeHtml(item.file)}<br>
      <small>${formatDateTime(item.createdAt)} - ${(Number(item.size || 0) / 1024).toFixed(1)} KB</small><br>
      <button class="ghost" data-download-backup="${escapeAttr(item.file)}">Download Excel backup</button>
    </div>`).join("") || "<p>No backup files yet. Backups will appear after the next save.</p>";
  } catch (error) {
    box.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
  }
}

async function loadAdminChatArchive() {
  const box = q("#adminChatArchive");
  if (!box || !isAdmin() || !adminUnlocked) return;
  box.innerHTML = "<p>Loading chat archive...</p>";
  try {
    const response = await fetch(apiPath("/api/chat?channel=all-direct"), { headers: authHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load chat archive");
    const messages = data.messages || [];
    box.innerHTML = messages.slice().reverse().slice(0, 100).map(message => `<div class="summary-item">
      <strong>${escapeHtml(message.by || "User")}</strong> <small>${formatDateTime(message.at)}</small><br>
      ${message.unsent ? "Message unsent" : escapeHtml(message.text || message.sticker || "")}
      ${message.attachment ? `<br><a class="file-link" download="${escapeAttr(message.attachment.name)}" href="${message.attachment.data}">Attachment: ${escapeHtml(message.attachment.name)}</a>` : ""}
      ${message.audio ? `<br><audio controls src="${message.audio.data}"></audio>` : ""}
    </div>`).join("") || "<p>No chat history yet.</p>";
  } catch (error) {
    box.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
  }
}

async function downloadBackup(file) {
  try {
    const response = await fetch(apiPath(`/api/backups/download?file=${encodeURIComponent(file)}`), {
      headers: authHeaders(),
      cache: "no-store"
    });
    if (!response.ok) {
      let message = "Could not download backup";
      try {
        const data = await response.json();
        message = data.error || message;
      } catch {}
      throw new Error(message);
    }
    const blob = await response.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(file.split(/[\\/]/).pop() || "emc-backup").replace(/\.json$/i, "")}.xls`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  } catch (error) {
    const box = q("#backupList");
    if (box) box.insertAdjacentHTML("afterbegin", `<p class="error">${escapeHtml(error.message)}</p>`);
  }
}

function paintAuditRows() {
  const term = q("#masterSearch").value.toLowerCase();
  const filter = q("#auditFilter").value;
  let rows = state.audit;
  if (filter) rows = rows.filter(a => a.action === filter);
  if (term) rows = rows.filter(a => JSON.stringify(a).toLowerCase().includes(term));
  q("#auditLog").innerHTML = rows.map(a => `<div class="audit-item"><strong>${escapeHtml(a.action.toUpperCase())}</strong> ${escapeHtml(a.target)}<br>${escapeHtml(a.detail || "")}<br><small>${escapeHtml(a.by)} - ${new Date(a.at).toLocaleString()}</small></div>`).join("") || "<p>No matching audit records.</p>";
}

function renderMasterSearch() {
  const term = q("#masterSearch").value.trim().toLowerCase();
  const box = q("#masterSearchResults");
  if (!term) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }
  const results = collectSearchResults(term).slice(0, 40);
  box.classList.remove("hidden");
  box.innerHTML = `
    <div class="panel-head"><h3>Master Search Results</h3><button id="closeSearchBtn" class="ghost">Close</button></div>
    <div class="search-list">${results.map(r => `<button class="search-hit" data-search-page="${r.page}" data-search-id="${escapeAttr(r.id || "")}">
      <strong>${escapeHtml(r.title)}</strong>
      <span>${escapeHtml(r.category)}</span>
      <small>${escapeHtml(r.detail)}</small>
    </button>`).join("") || `<p>No matching data found for "${escapeHtml(term)}".</p>`}</div>`;
  const firstStock = results.find(r => r.page === "stock" && r.id);
  if (firstStock && term.length >= 2) focusStockVariant(firstStock.id, term);
}

function collectSearchResults(term) {
  const results = [];
  const add = (page, category, title, detail, data, idValue = "") => {
    const haystack = JSON.stringify({ category, title, detail, data }).toLowerCase();
    if (haystack.includes(term)) results.push({ page, category, title, detail, id: idValue || data?.id || "" });
  };
  state.products.forEach(p => {
    add("formulation", "Product", `${p.short || ""} ${p.name || ""}`, `Mesh product ${p.meshProduct || ""}`, { name: p.name, short: p.short, meshProduct: p.meshProduct, d90: p.d90, d50: p.d50, d10: p.d10 });
    (p.formulation?.components || []).forEach(c => add("formulation", "Formulation component", c.name || "Component", `${p.short || p.name} stock ${c.stock || 0}, formulation ${c.percent || 0}%`, c));
    (p.formulation?.meshes || []).forEach(m => add("formulation", "Formulation mesh", `Mesh ${m.mesh}`, `${p.short || p.name} target/spec ${m.ideal || ""}`, m));
  });
  state.stockVariants.forEach(v => add("stock", "Raw material stock", v.name, `${v.category || ""} opening ${v.opening || 0}`, v, v.id));
  Object.entries(state.stockDays || {}).forEach(([date, rows]) => Object.entries(rows || {}).forEach(([variantId, row]) => {
    const variant = state.stockVariants.find(v => v.id === variantId);
    add("stock", "Daily stock", `${variant?.name || variantId} on ${date}`, `Closing ${stockRowFor(variant || { id: variantId, opening: 0 }, date).closing}`, row, variantId);
  }));
  state.machines.forEach(m => {
    add("production", "Machine", m.name, `Screens ${m.screens || 0}, setup ${m.currentSetup || ""}`, m);
    (m.spares || []).forEach(s => add("production", "Machine spare", s.part || "Spare part", `${m.name}: ${s.specification || ""}, stock ${s.stock || 0}`, s));
    (state.screenDetails || []).filter(row => row.machineId === m.id).forEach(row => {
      if (Array.isArray(row.screens)) {
        row.screens.forEach(screen => add("production", "Available screen details", `${m.name} screen ${screen.mesh || ""}`, `${screen.quantity || ""} ${screen.gauge || ""} ${screen.installDate || ""} ${screen.damaged || ""} ${screen.replaced || ""} ${screen.requirement || ""} ${screen.onUse || ""} ${screen.note || ""}`, screen));
      } else {
        add("production", "Available screen details", `${m.name} screens`, `${row.available || ""} ${row.damaged || ""} ${row.replaced || ""} ${row.requirement || ""} ${row.onUse || ""}`, row);
      }
    });
    (state.breakdowns[m.id] || []).forEach(b => add("production", "Breakdown history", `${m.name} breakdown ${b.date || ""}`, `${b.status || ""} ${b.details || ""}`, b));
  });
  Object.entries(state.activity || {}).forEach(([key, rec]) => {
    (rec.work || []).forEach(r => add("activity", "Activity log", `${r.date || key} ${r.person || ""}`, `${r.shift || ""}: ${r.text || ""}`, r));
    (rec.plan || []).forEach(r => add("tomorrow", "Tomorrow's plan", `${r.date || key} ${r.person || ""}`, `${r.shift || ""}: ${r.text || ""}`, r));
  });
  state.ideas.forEach(i => add("ideas", "Suggestion / approval", i.regarding || "Suggestion", `${i.by || ""} ${i.status || ""} ${i.approvedBy || ""} ${i.details || ""} ${i.attachmentName || ""}`, i));
  state.tasks.forEach(t => add("taskAllocation", "Task allocation", t.work || t.category || "Task", `${t.responsible || ""} ${t.assistant || ""} ${taskStatus(t)} ${t.priority || ""} ${t.status || ""} ${t.rating || ""}`, t));
  (state.kpi || []).forEach(k => add("kpi", "KPI", k.objective || k.category || "KPI row", `${k.date || ""} ${k.product || ""} ${k.target || ""} ${k.achieved || ""} ${k.achievedPercent || ""}% ${k.owner || ""} ${k.remarks || ""}`, k));
  state.longPlans.forEach(p => add("longPlans", "Long term plan", p.plan || "Plan", `${p.timeline || ""} ${p.allottedBy || ""}`, p));
  state.grn.forEach(g => add("grn", "GRN", g.material || "GRN row", `${g.type || ""} ${g.party || ""} invoice ${g.invoice || ""} ${Object.values(g.custom || {}).join(" ")}`, g));
  state.mesh.forEach(m => add("mesh", "Mesh conversion", `Mesh ${m.mesh}`, `${m.microns} microns, ${m.millimeters} mm`, m));
  state.audit.forEach(a => add("audit", "Audit log", `${a.action} ${a.target}`, `${a.detail || ""} by ${a.by || ""}`, a));
  accountUsers.forEach(u => add("admin", "User account", u.name || u.email || "User", `${u.username || ""} ${u.email || ""} ${u.employeeId || ""} ${u.role || ""} ${u.status || ""}`, u));
  if (state.skm?.text) add("notification", "Notification", "General notification", state.skm.text, state.skm);
  return results;
}

function exportData() {
  const date = q("#dashDate").value || today();
  const stockRows = state.stockVariants.map(v => stockRowFor(v, date));
  const sheets = [
    { name: "Summary", rows: summaryReportRows(stockRows) },
    { name: "Raw Stock", rows: [["Category","Material","Opening","Day production","Night production","Consumption day","Consumption night","Closing","Remarks"], ...stockRows.map(r => [r.category, r.name, r.opening, r.dayProd, r.nightProd, r.consDay, r.consNight, r.closing, r.remarks || ""])] },
    { name: "Machines", rows: [["Machine","Category","Photo","Screens","Current screen setup","Outputs","Health","Health reason","Spares"], ...state.machines.map(m => [m.name, m.category || "", m.photo || "", m.screens || "", m.currentSetup || "", (m.outputNames || []).join(", "), machineRisk(m).level, machineRisk(m).reason, (m.spares || []).map(s => `${s.order || ""}. ${s.part} (${s.specification || ""}): ${s.stock}`).join("; ")])] },
    { name: "Screen Details", rows: screenDetailsExportRows() },
    { name: "Breakdowns", rows: [["Machine","Date","Hours lost","Status","Photo/file","Details"], ...state.machines.flatMap(m => (state.breakdowns[m.id] || []).map(b => [m.name, b.date || "", b.hours || "", b.status || "", b.photo || "", b.details || ""]))] },
    { name: "Activity Log", rows: [["Date","Shift","Name / In charge","Activity"], ...activityExportRows("work")] },
    { name: "Tomorrow Plan", rows: [["Date","Shift","Name / In charge","Plan"], ...activityExportRows("plan")] },
    { name: "KPI", rows: [["Date","Category","Product","Objective","Target","Achieved","Achieved %","Owner","Remarks"], ...(state.kpi || []).map(k => [k.date || "", k.category || "", k.product || "", k.objective || "", k.target || "", k.achieved || "", k.achievedPercent || "", k.owner || "", k.remarks || ""])] },
    { name: "Task Allocation", rows: [["Type", ...taskReference.headers, "Calculated status", "Calculated delay", "Calculated score", "Remarks"], ...state.tasks.map(t => [t.kind || "", t.category || "", t.work || "", t.priority || "", t.responsible || "", t.assistant || "", t.allocationDate || "", t.timeline || "", t.status || "", t.completionDate || "", t.achievementDay || "", t.rating || "", taskStatus(t), taskDelayDays(t), taskScore(t), t.remarks || ""])] },
    { name: "Long Term Plans", rows: [["Date","Plan","Timeline","Allotted by"], ...state.longPlans.map(p => [p.date || "", p.plan || "", p.timeline || "", p.allottedBy || ""])] },
    { name: "Suggestions", rows: [["By whom","Date","Regarding what","Details","Approval status","Approved by","Attachment"], ...state.ideas.map(i => [i.by || "", i.date || "", i.regarding || "", i.details || "", i.status || "", i.approvedBy || "", i.attachmentName || ""])] },
    { name: "GRN", rows: [["Type","Date","Supplier / Receiver","Invoice","Material","Qty kg","PSD update","Remarks", ...(state.grnHeadings || []).map(h => h.name)], ...state.grn.map(g => [g.type, g.date, g.party, g.invoice, g.material, g.qty, g.psd, g.remarks, ...(state.grnHeadings || []).map(h => g.custom?.[h.id] || "")])] },
    { name: "Users", rows: [["Name","Email","Employee ID","Role","Status","Last login"], ...accountUsers.map(u => [u.name || "", u.email || "", u.employeeId || "", u.role || "", u.status || "", u.lastLogin || ""])] },
    { name: "Audit", rows: [["At","By","Action","Target","Detail"], ...state.audit.map(a => [a.at, a.by, a.action, a.target, a.detail])] }
  ];
  downloadXls(`emc-management-report-${today()}.xls`, spreadsheetXml(sheets));
  audit("save", "excel report export", "Management report downloaded");
}

function screenDetailsExportRows() {
  const rows = [["Machine","Wiremesh","Quantity","Gauge","Installation date","Damaged screens","Replaced screens","Requirement","On use","History note","History"]];
  (state.screenDetails || []).forEach(record => {
    const machine = state.machines.find(item => item.id === record.machineId);
    if (Array.isArray(record.screens)) {
      (record.screens || []).forEach(screen => rows.push([
        machine?.name || record.machineId || "",
        screen.mesh || "",
        screen.quantity || "",
        screen.gauge || "",
        screen.installDate || "",
        screen.damaged || "",
        screen.replaced || "",
        screen.requirement || "",
        screen.onUse || "",
        screen.note || "",
        (record.history || []).filter(item => String(item.field || "").startsWith(screen.mesh || "Screen")).map(item => `${item.at} ${item.by} ${item.field}: ${item.value}`).join("; ")
      ]));
      return;
    }
    rows.push([
      machine?.name || record.machineId || "",
      record.available || "",
      "",
      "",
      "",
      record.damaged || "",
      record.replaced || "",
      record.requirement || "",
      record.onUse || "",
      record.note || "",
      (record.history || []).map(item => `${item.at} ${item.by} ${item.field}: ${item.value}`).join("; ")
    ]);
  });
  return rows;
}

function readSmallRow(row, attr) {
  const obj = {};
  const kebab = attr.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
  row.querySelectorAll(`[data-${kebab}]`).forEach(i => obj[i.dataset[attr]] = i.value);
  return obj;
}

function summaryReportRows(stockRows) {
  const totalStock = sum(stockRows.map(r => r.closing));
  const lowStock = stockRows.filter(r => r.closing < 1000).length;
  const fragile = state.machines.filter(m => machineRisk(m).level === "Fragile").length;
  return [
    ["EMC Management Summary", ""],
    ["Metric", "Value"],
    ["Total closing stock of raw material", money(totalStock)],
    ["Low stock materials", lowStock],
    ["Critical spare stocks", criticalSpareRows().length],
    ["Good performer", goodPerformer() ? `${goodPerformer().name} ${goodPerformer().score.toFixed(1)}%` : ""],
    ["Poor performer", poorPerformer() ? `${poorPerformer().name} ${poorPerformer().score.toFixed(1)}%` : ""],
    ["Fragile machines", fragile],
    ["Open suggestions / approvals", state.ideas.filter(i => i.status !== "Approved").length],
    ["GRN rows", state.grn.length],
    [],
    ["Stock by Category", "Closing stock kg"],
    ...Object.entries(stockRows.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + r.closing; return acc; }, {})).map(([k, v]) => [k, v.toFixed(1)]),
    [],
    ["Machine Health", "Status", "Reason"],
    ...state.machines.map(m => [m.name, machineRisk(m).level, machineRisk(m).reason])
  ];
}

function activityExportRows(kind) {
  return Object.entries(state.activity).flatMap(([key, rec]) => {
    const [date, shift] = key.split("|");
    return (rec[kind] || []).filter(r => r.person || r.employee || r.text).map(r => [r.date || date, r.shift || shift, r.person || r.employee || "", r.text]);
  });
}

function spreadsheetXml(sheets) {
  const columnXml = rows => {
    const maxCols = Math.max(...rows.map(r => r.length || 1), 1);
    return Array.from({ length: maxCols }, (_, i) => {
      const width = Math.min(240, Math.max(80, ...rows.map(r => String(r[i] ?? "").length * 7 + 24)));
      return `<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`;
    }).join("");
  };
  const styleFor = (cell, rIdx) => {
    if (rIdx === 0) return ' ss:StyleID="header"';
    if (cell === "" || cell === null || cell === undefined) return ' ss:StyleID="blank"';
    return ' ss:StyleID="cell"';
  };
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="header"><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#2D7A55" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
  <Style ss:ID="cell"><Alignment ss:Vertical="Top" ss:WrapText="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4E4DA"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4E4DA"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4E4DA"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4E4DA"/></Borders></Style>
  <Style ss:ID="blank"><Interior ss:Color="#EFF8F1" ss:Pattern="Solid"/></Style>
 </Styles>
 ${sheets.map(sheet => `<Worksheet ss:Name="${xmlEsc(sheet.name.slice(0, 31))}"><Table>${columnXml(sheet.rows)}${sheet.rows.map((row, rIdx) => `<Row ss:AutoFitHeight="1">${(row.length ? row : [""]).map(cell => `<Cell${styleFor(cell, rIdx)}><Data ss:Type="${typeof cell === "number" ? "Number" : "String"}">${xmlEsc(cell ?? "")}</Data></Cell>`).join("")}</Row>`).join("")}</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>1</SplitHorizontal><TopRowBottomPane>1</TopRowBottomPane><ActivePane>2</ActivePane></WorksheetOptions></Worksheet>`).join("")}
</Workbook>`;
}

function downloadXls(filename, html) {
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function xmlEsc(v) { return String(v ?? "").replace(/[<>&'"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c])); }

function sum(arr) { return arr.reduce((a, b) => a + Number(b || 0), 0); }
function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("en-IN");
}
function escapeHtml(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function escapeAttr(v) { return escapeHtml(v); }

document.addEventListener("click", e => {
  const bellPanel = q("#activityBellPanel");
  if (bellPanel && !bellPanel.classList.contains("hidden") && !e.target.closest("#activityBellPanel") && !e.target.closest("#activityBell")) {
    bellPanel.classList.add("hidden");
  }
  if (e.target.closest("[data-dashboard-jump]")) {
    dashboardJump(e.target.closest("[data-dashboard-jump]").dataset.dashboardJump);
  }
  if (e.target.closest("[data-search-page]")) {
    const hit = e.target.closest("[data-search-page]");
    goToSearchHit(hit.dataset.searchPage, hit.dataset.searchId);
    q("#masterSearch").value = "";
    renderMasterSearch();
  }
  if (e.target.matches("#closeSearchBtn")) {
    q("#masterSearch").value = "";
    renderMasterSearch();
  }
  if (e.target.matches("#closeActivityBell")) {
    markActivityBellRead();
    q("#activityBellPanel").classList.add("hidden");
  }
  if (e.target.closest("[data-fullscreen-photo]") || e.target.closest(".chat-attachment img") || e.target.closest(".machine-cover img") || e.target.closest(".dashboard-slideshow img")) {
    if (Date.now() < photoViewerSuppressUntil) return;
    const img = e.target.closest("img");
    if (img) {
      e.preventDefault();
      openPhotoViewer(img.src, img.alt || "Photo");
    }
  }
  if (e.target.closest("[data-dashboard-photo]")) {
    const btn = e.target.closest("[data-dashboard-photo]");
    if (e.target.matches("[data-delete-dashboard-photo]")) {
      state.dashboardPhotos = (state.dashboardPhotos || []).filter(photo => photo.id !== e.target.dataset.deleteDashboardPhoto);
      state.dashboardSlideIndex = 0;
      audit("delete", "dashboard photo", e.target.dataset.deleteDashboardPhoto);
      saveState();
      renderDashboard();
    } else {
      state.dashboardSlideIndex = Number(btn.dataset.dashboardPhoto || 0);
      renderDashboardSlideshow();
    }
  }
  if (e.target.closest("[data-notification-index]")) {
    const index = Number(e.target.closest("[data-notification-index]").dataset.notificationIndex);
    const items = unreadActivityItems().length ? unreadActivityItems() : recentActivityItems();
    goToNotification(items[index]);
  }
  if (e.target.matches("[data-chat-sticker]")) sendSticker(e.target.dataset.chatSticker);
  if (e.target.matches("[data-unsend-chat]")) unsendChat(e.target.dataset.unsendChat);
  if (e.target.matches("[data-delete-activity]")) {
    const [type, idx] = e.target.dataset.deleteActivity.split(":");
    const date = type === "work" ? q("#activityDate").value : q("#planDate").value;
    const rec = activityRecord(date);
    rec[type].splice(Number(idx), 1);
    audit("delete", type === "work" ? "activity row" : "tomorrow plan row", date);
    saveState();
    if (type === "work") renderActivity();
    else renderTomorrow();
  }
  if (e.target.matches("[data-delete-component]")) {
    const product = readProductForm();
    product.formulation.components.splice(Number(e.target.dataset.deleteComponent), 1);
    audit("delete", "formulation component", product.short);
    saveState();
    renderFormulation();
  }
  if (e.target.matches("[data-delete-mesh]")) {
    const product = readProductForm();
    product.formulation.meshes.splice(Number(e.target.dataset.deleteMesh), 1);
    audit("delete", "formulation mesh", product.short);
    saveState();
    renderFormulation();
  }
  if (e.target.matches("[data-delete-spare]")) {
    const machine = state.machines.find(m => m.id === q("#machineSelect").value);
    machine.spares = (machine.spares || []).filter(s => s.id !== e.target.dataset.deleteSpare);
    audit("delete", "spare part", machine.name);
    saveState();
    renderProduction();
  }
  if (e.target.matches("[data-delete-breakdown]")) {
    const machine = state.machines.find(m => m.id === q("#machineSelect").value);
    state.breakdowns[machine.id] = (state.breakdowns[machine.id] || []).filter(b => b.id !== e.target.closest("[data-breakdown]").dataset.breakdown);
    audit("delete", "breakdown", machine.name);
    saveState();
    renderProduction();
  }
  if (e.target.matches("[data-delete-screen-row]")) {
    const machine = state.machines.find(m => m.id === q("#machineSelect").value);
    const record = machine ? screenRecord(machine) : null;
    if (record) record.screens = (record.screens || []).filter(screen => screen.id !== e.target.dataset.deleteScreenRow);
    audit("delete", "screen details", e.target.dataset.deleteScreenRow);
    saveState();
    renderProduction();
  }
  if (e.target.matches("[data-delete-idea]")) {
    state.ideas = state.ideas.filter(i => i.id !== e.target.dataset.deleteIdea);
    audit("delete", "idea", e.target.dataset.deleteIdea);
    saveState();
    renderIdeas();
  }
  if (e.target.matches("[data-delete-grn]")) {
    state.grn = state.grn.filter(g => g.id !== e.target.dataset.deleteGrn);
    audit("delete", "GRN", e.target.dataset.deleteGrn);
    saveState();
    renderGrn();
  }
  if (e.target.matches("[data-delete-task]")) {
    state.tasks = state.tasks.filter(t => t.id !== e.target.dataset.deleteTask);
    audit("delete", "task allocation", e.target.dataset.deleteTask);
    saveState();
    renderTaskAllocation();
  }
  if (e.target.matches("[data-delete-kpi]")) {
    state.kpi = (state.kpi || []).filter(k => k.id !== e.target.dataset.deleteKpi);
    audit("delete", "KPI", e.target.dataset.deleteKpi);
    saveState();
    renderKpi();
  }
  if (e.target.matches("[data-delete-long-plan]")) {
    state.longPlans = state.longPlans.filter(p => p.id !== e.target.dataset.deleteLongPlan);
    audit("delete", "long term plan", e.target.dataset.deleteLongPlan);
    saveState();
    renderLongPlans();
  }
  if (e.target.matches("[data-disable-user]")) {
    const row = e.target.closest("[data-user-row]");
    const status = row?.querySelector('[data-user-field="status"]');
    if (status) {
      status.value = "Disabled";
      saveUsers();
    }
  }
  if (e.target.matches("[data-enable-user]")) {
    const row = e.target.closest("[data-user-row]");
    const status = row?.querySelector('[data-user-field="status"]');
    if (status) {
      status.value = "Active";
      saveUsers();
    }
  }
  if (e.target.matches("[data-approve-user]")) {
    const row = e.target.closest("[data-user-row]");
    const status = row?.querySelector('[data-user-field="status"]');
    if (status) status.value = "Active";
  }
  if (e.target.matches("[data-approve-pending-user]")) {
    const row = q(`[data-user-row="${CSS.escape(e.target.dataset.approvePendingUser)}"]`);
    const status = row?.querySelector('[data-user-field="status"]');
    if (status) {
      status.value = "Active";
      saveUsers();
    }
  }
  if (e.target.matches("[data-remove-user]")) removeUser(e.target.dataset.removeUser);
  if (e.target.matches("[data-clear-password-request]")) clearPasswordRequest(e.target.dataset.clearPasswordRequest);
  if (e.target.matches("[data-download-backup]")) {
    downloadBackup(e.target.dataset.downloadBackup);
  }
  if (e.target.matches("[data-delete-variant]")) deleteVariant(e);
  if (e.target.matches("[data-load-history]")) loadFormulationRecord(e.target.dataset.loadHistory);
  if (e.target.matches("[data-see-qr]")) showRawMaterialQr(e.target.dataset.seeQr);
  if (e.target.matches("[data-download-qr]")) downloadRawMaterialQr(e.target.dataset.downloadQr);
  if (e.target.matches("[data-rack-add-location]")) openRackPalletForm(e.target.dataset.rackAddLocation);
  if (e.target.matches("[data-edit-rack-pallet]")) openRackPalletForm("", e.target.dataset.editRackPallet);
  if (e.target.matches("[data-delete-rack-pallet]")) deleteRackPallet(e.target.dataset.deleteRackPallet);
});

function dashboardJump(target) {
  const date = q("#dashDate").value || today();
  if (target === "low-stock") {
    const low = state.stockVariants.map(v => stockRowFor(v, date)).filter(r => r.closing < 1000);
    activePage = "stock";
    render();
    if (low[0]) {
      q("#stockCategory").value = low[0].category;
      renderStock();
      qa("#stockTable tbody tr").forEach(row => {
        const variant = state.stockVariants.find(v => v.id === row.dataset.variant);
        row.classList.toggle("row-focus", !!variant && low.some(item => item.id === variant.id));
      });
    }
    return;
  }
  activePage = target;
  render();
}

function goToSearchHit(page, idValue = "") {
  activePage = page;
  render();
  if (page === "stock" && idValue) focusStockVariant(idValue);
}

function goToNotification(item) {
  if (!item?.page) return;
  activePage = item.page;
  render();
  setTimeout(() => {
    const target = findLiveTarget(item.locator || {});
    if (target) {
      target.scrollIntoView({ block: "center", behavior: "smooth" });
      target.classList.add("search-field-focus");
      setTimeout(() => target.classList.remove("search-field-focus"), 2200);
    }
  }, 100);
  markActivityBellRead();
  q("#activityBellPanel")?.classList.add("hidden");
}

function focusStockVariant(variantId, term = "") {
  const variant = state.stockVariants.find(v => v.id === variantId);
  if (!variant) return;
  if (activePage !== "stock") {
    activePage = "stock";
    qa(".page").forEach(p => p.classList.toggle("active", p.id === activePage));
    qa("#nav button").forEach(b => b.classList.toggle("active", b.dataset.page === activePage));
    q("#pageTitle").textContent = "Raw Material Stock";
  }
  if (q("#stockCategory") && q("#stockCategory").value !== variant.category) {
    q("#stockCategory").value = variant.category;
  }
  renderStock();
  qa("#stockTable tbody tr").forEach(row => row.classList.toggle("row-focus", row.dataset.variant === variantId));
  const row = qa("#stockTable tbody tr").find(item => item.dataset.variant === variantId);
  if (row) {
    row.scrollIntoView({ block: "start", behavior: "smooth" });
    const nameInput = row.querySelector('[data-field="name"]');
    if (nameInput && term) nameInput.classList.add("search-field-focus");
  }
}

document.addEventListener("input", e => {
  if (["machinePhotoX", "machinePhotoY", "machinePhotoZoom"].includes(e.target.id)) {
    const cover = q(".machine-cover");
    if (cover) {
      cover.style.setProperty("--cover-x", `${Number(q("#machinePhotoX")?.value || 50)}%`);
      cover.style.setProperty("--cover-y", `${Number(q("#machinePhotoY")?.value || 50)}%`);
      cover.style.setProperty("--cover-zoom", `${Number(q("#machinePhotoZoom")?.value || 1)}`);
    }
    saveMachineCoverFit();
  }
  if (e.target.closest("#stockTable") && e.target.matches("[data-field]")) {
    const row = e.target.closest("tr");
    recalcStockRow(row);
  }
  if (e.target.closest("#formulationMeta")) readProductForm();
  if (e.target.closest("#screenDetailsTable")) {
    clearTimeout(saveScreenDetails.timer);
    saveScreenDetails.timer = setTimeout(() => {
      saveScreenDetails(false);
      renderScreenDetails(state.machines.find(m => m.id === q("#machineSelect").value));
    }, 500);
  }
  const info = liveEditInfo(e.target);
  if (info) {
    clearTimeout(liveInputTimer);
    liveInputTimer = setTimeout(() => broadcastLiveEdit(info), 250);
  }
});

document.addEventListener("change", e => {
  if (e.target.closest("#formulationTable") || e.target.closest("#formulationMeta")) {
    readProductForm();
    saveState();
    renderFormulation();
  }
  const info = liveEditInfo(e.target);
  if (info) broadcastLiveEdit(info);
});

document.addEventListener("change", e => {
  if (!e.target.matches("#machinePhotoUpload")) return;
  const file = e.target.files?.[0];
  const machine = state.machines.find(m => m.id === q("#machineSelect").value);
  if (!file || !machine) return;
  const reader = new FileReader();
  reader.onload = () => {
    machine.photo = reader.result;
    machine.photoFit = { x: 50, y: 50, zoom: 1 };
    const photoInput = q("#machinePhoto");
    if (photoInput) photoInput.value = reader.result;
    audit("save", "machine photo", machine.name);
    saveState();
    renderProduction();
  };
  reader.readAsDataURL(file);
});

document.addEventListener("change", e => {
  if (!e.target.matches("[data-idea-upload]")) return;
  const file = e.target.files?.[0];
  const idea = state.ideas.find(i => i.id === e.target.dataset.ideaUpload);
  if (!file || !idea) return;
  saveIdeas(false, false);
  const current = state.ideas.find(i => i.id === e.target.dataset.ideaUpload);
  const reader = new FileReader();
  reader.onload = () => {
    current.attachmentName = file.name;
    current.attachmentData = reader.result;
    audit("save", "suggestion file", file.name);
    saveState();
    renderIdeas();
  };
  reader.readAsDataURL(file);
});

init();
