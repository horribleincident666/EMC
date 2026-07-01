let state = { locations: [], pallets: [], activity: [], products: [] };
const ROWS = ["A", "B", "C", "D", "E"];
const FLOORS = ["G", "1", "2", "3", "4"];

const els = {
  viewTitle: document.querySelector("#viewTitle"),
  navItems: [...document.querySelectorAll(".nav-item")],
  views: {
    dashboard: document.querySelector("#dashboardView"),
    locations: document.querySelector("#locationsView"),
    stock: document.querySelector("#stockView"),
    catalog: document.querySelector("#catalogView"),
    activity: document.querySelector("#activityView")
  },
  rackCount: document.querySelector("#rackCount"),
  palletCount: document.querySelector("#palletCount"),
  netKgCount: document.querySelector("#netKgCount"),
  freeCount: document.querySelector("#freeCount"),
  rackMap: document.querySelector("#rackMap"),
  attentionList: document.querySelector("#attentionList"),
  locationList: document.querySelector("#locationList"),
  stockTable: document.querySelector("#stockTable"),
  catalogGrid: document.querySelector("#catalogGrid"),
  activityLog: document.querySelector("#activityLog"),
  rowFilter: document.querySelector("#rowFilter"),
  floorFilter: document.querySelector("#floorFilter"),
  locationSearch: document.querySelector("#locationSearch"),
  locationStatusFilter: document.querySelector("#locationStatusFilter"),
  stockSearch: document.querySelector("#stockSearch"),
  productFilter: document.querySelector("#productFilter"),
  packagingFilter: document.querySelector("#packagingFilter"),
  weightFilter: document.querySelector("#weightFilter"),
  palletDialog: document.querySelector("#palletDialog"),
  palletForm: document.querySelector("#palletForm"),
  palletProduct: document.querySelector("#palletProduct"),
  palletLocation: document.querySelector("#palletLocation"),
  palletPackaging: document.querySelector("#palletPackaging"),
  palletWeight: document.querySelector("#palletWeight"),
  bagWeight: document.querySelector("#bagWeight"),
  bagCount: document.querySelector("#bagCount"),
  passwordDialog: document.querySelector("#passwordDialog"),
  passwordForm: document.querySelector("#passwordForm"),
  storageStatus: document.querySelector("#storageStatus")
};

document.querySelector("#newPalletBtn").addEventListener("click", () => openPalletDialog());
document.querySelector("#sampleBtn").addEventListener("click", () => protectedAction("Load sample stock?", (password) => apiPost("/api/sample", { password })));
document.querySelector("#resetLayoutBtn").addEventListener("click", () => protectedAction("Refresh the rack layout?", (password) => apiPost("/api/reset-layout", { password })));
document.querySelector("#exportBtn").addEventListener("click", exportData);
document.querySelector("#importInput").addEventListener("change", importData);
document.querySelector("#clearActivityBtn").addEventListener("click", () => protectedAction("Clear activity log?", (password) => apiPost("/api/clear-activity", { password })));
document.querySelector("#passwordHelpBtn").addEventListener("click", () => els.passwordDialog.showModal());

els.navItems.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));

[
  els.rowFilter,
  els.floorFilter,
  els.locationSearch,
  els.locationStatusFilter,
  els.stockSearch,
  els.productFilter,
  els.packagingFilter,
  els.weightFilter
].forEach((control) => control.addEventListener("input", render));

[els.palletPackaging, els.palletWeight].forEach((control) => control.addEventListener("input", updatePackagingFields));
els.palletForm.addEventListener("submit", savePallet);
els.passwordForm.addEventListener("submit", recoverPassword);

initializeStaticControls();
refreshState();
window.setInterval(refreshState, 15000);

function initializeStaticControls() {
  els.rowFilter.innerHTML = `<option value="all">All rows</option>${ROWS.map((row) => `<option value="${row}">Row ${row}</option>`).join("")}`;
  els.floorFilter.innerHTML = `<option value="all">All floors</option>${FLOORS.map((floor) => `<option value="${floor}">${floor === "G" ? "Ground" : `Floor ${floor}`}</option>`).join("")}`;
}

async function refreshState() {
  try {
    setStatus("Syncing");
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load server data.");
    state = await response.json();
    initializeProductControls();
    render();
    setStatus("Online");
  } catch (error) {
    setStatus("Offline");
    alert(error.message);
  }
}

function initializeProductControls() {
  const currentFilter = els.productFilter.value || "all";
  const currentProduct = els.palletProduct.value;
  els.productFilter.innerHTML = `<option value="all">All products</option>${state.products.map(productOption).join("")}`;
  els.palletProduct.innerHTML = state.products.map(productOption).join("");
  els.productFilter.value = state.products.some((product) => product.name === currentFilter) ? currentFilter : "all";
  if (state.products.some((product) => product.name === currentProduct)) els.palletProduct.value = currentProduct;
}

function productOption(product) {
  return `<option value="${escapeHtml(product.name)}">${escapeHtml(product.shortName)} - ${escapeHtml(product.name)}</option>`;
}

function setView(view) {
  els.navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  Object.entries(els.views).forEach(([name, panel]) => panel.classList.toggle("active", name === view));
  const titles = { dashboard: "Dashboard", locations: "Locations", stock: "Stock", catalog: "Catalog", activity: "Activity" };
  els.viewTitle.textContent = titles[view];
  render();
}

function render() {
  renderMetrics();
  renderRackMap();
  renderAttention();
  renderLocations();
  renderStock();
  renderCatalog();
  renderActivity();
}

function renderMetrics() {
  const used = occupiedLocationIds().size;
  const netKg = state.pallets.reduce((sum, pallet) => sum + Number(pallet.netKg || 0), 0);
  els.rackCount.textContent = state.locations.length;
  els.palletCount.textContent = state.pallets.length;
  els.netKgCount.textContent = netKg.toLocaleString("en-IN");
  els.freeCount.textContent = Math.max(0, state.locations.length - used);
}

function renderRackMap() {
  const row = els.rowFilter.value;
  const floor = els.floorFilter.value;
  const usedIds = occupiedLocationIds();
  const visible = state.locations.filter((location) => {
    return (row === "all" || location.row === row) && (floor === "all" || location.floor === floor);
  });

  els.rackMap.innerHTML = FLOORS.map((floorName) => {
    const floorLocations = visible.filter((location) => location.floor === floorName);
    if (!floorLocations.length) return "";
    const used = floorLocations.filter((location) => usedIds.has(location.id)).length;
    const percent = Math.round((used / floorLocations.length) * 100);
    return `
      <article class="rack-tile">
        <strong>${floorName === "G" ? "Ground" : `Floor ${floorName}`}</strong>
        <span>${floorLocations.length} locations / ${used} occupied</span>
        <div class="occupancy ${percent > 80 ? "high" : ""}"><span style="width: ${percent}%"></span></div>
        <small>${percent}% occupied</small>
      </article>
    `;
  }).join("") || `<div class="empty-state">No locations match this filter.</div>`;
}

function renderAttention() {
  const oldest = [...state.pallets].sort((a, b) => String(a.fifoDate).localeCompare(String(b.fifoDate))).slice(0, 6);
  if (!oldest.length) {
    els.attentionList.innerHTML = `<div class="empty-state">No pallets stored yet. Add a pallet or load sample stock.</div>`;
    return;
  }

  els.attentionList.innerHTML = oldest.map((pallet) => `
    <div class="attention-item">
      <strong>${escapeHtml(pallet.locationId)} - ${escapeHtml(pallet.shortName)} - ${escapeHtml(displayBatch(pallet))}</strong>
      <span>${escapeHtml(pallet.packaging)}, ${pallet.netKg} kg, FIFO ${formatDate(pallet.fifoDate)}</span>
    </div>
  `).join("");
}

function renderLocations() {
  const search = els.locationSearch.value.trim().toLowerCase();
  const status = els.locationStatusFilter.value;
  const usedIds = occupiedLocationIds();

  const locations = state.locations.filter((location) => {
    const pallet = state.pallets.find((entry) => entry.locationId === location.id);
    const text = [location.code, location.row, location.floor, location.position, pallet?.shortName, pallet?.batch].join(" ").toLowerCase();
    const statusMatch = status === "all" || (status === "occupied" ? usedIds.has(location.id) : !usedIds.has(location.id));
    return statusMatch && text.includes(search);
  }).slice(0, 180);

  if (!locations.length) {
    els.locationList.innerHTML = `<div class="empty-state">No rack locations match your search.</div>`;
    return;
  }

  els.locationList.innerHTML = locations.map((location) => {
    const pallet = state.pallets.find((entry) => entry.locationId === location.id);
    return `
      <article class="location-card ${pallet ? "occupied" : ""}">
        <strong>${escapeHtml(location.code)}</strong>
        <span>Row ${location.row} / ${location.floor === "G" ? "Ground" : `Floor ${location.floor}`} / Position ${location.position}</span>
        ${pallet ? `<p>${escapeHtml(pallet.shortName)} - ${escapeHtml(displayBatch(pallet))} - ${pallet.netKg} kg</p>` : `<p>Available</p>`}
        <div class="row-actions">
          ${pallet ? `<button class="mini-button" type="button" onclick="openPalletDialog('${pallet.id}')">Edit</button><button class="mini-button danger" type="button" onclick="deletePallet('${pallet.id}')">Delete</button>` : `<button class="mini-button" type="button" onclick="openPalletDialog('', '${location.id}')">Add here</button>`}
        </div>
      </article>
    `;
  }).join("");
}

function renderStock() {
  const search = els.stockSearch.value.trim().toLowerCase();
  const product = els.productFilter.value;
  const packaging = els.packagingFilter.value;
  const weight = els.weightFilter.value;

  const pallets = state.pallets.filter((pallet) => {
    const text = [pallet.productName, pallet.shortName, pallet.batch, pallet.locationId, pallet.packaging, pallet.netKg].join(" ").toLowerCase();
    return text.includes(search)
      && (product === "all" || pallet.productName === product)
      && (packaging === "all" || pallet.packaging === packaging)
      && (weight === "all" || String(pallet.weightClass) === weight);
  }).sort((a, b) => String(a.fifoDate).localeCompare(String(b.fifoDate)));

  if (!pallets.length) {
    els.stockTable.innerHTML = `<tr><td colspan="8" class="empty-state">No stock matches this search.</td></tr>`;
    return;
  }

  els.stockTable.innerHTML = pallets.map((pallet) => `
    <tr>
      <td>${escapeHtml(pallet.locationId)}</td>
      <td>${escapeHtml(pallet.productName)}</td>
      <td>${escapeHtml(pallet.shortName)}</td>
      <td>${escapeHtml(displayBatch(pallet))}</td>
      <td>${escapeHtml(pallet.packaging)}<br><small>${pallet.bagCount} x ${pallet.bagWeight} kg</small></td>
      <td>${Number(pallet.netKg).toLocaleString("en-IN")}</td>
      <td>${formatDate(pallet.fifoDate)}</td>
      <td>
        <div class="row-actions">
          <button class="mini-button" type="button" onclick="openPalletDialog('${pallet.id}')">Edit</button>
          <button class="mini-button danger prominent-delete" type="button" onclick="deletePallet('${pallet.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderCatalog() {
  els.catalogGrid.innerHTML = state.products.map((product) => `
    <article class="catalog-card">
      <strong>${escapeHtml(product.shortName)}</strong>
      <span>${escapeHtml(product.name)}</span>
    </article>
  `).join("");
}

function renderActivity() {
  if (!state.activity.length) {
    els.activityLog.innerHTML = `<li>No activity recorded yet.</li>`;
    return;
  }
  els.activityLog.innerHTML = state.activity.map((entry) => `
    <li><strong>${formatDateTime(entry.at)}</strong><br>${escapeHtml(entry.message)}</li>
  `).join("");
}

function openPalletDialog(id = "", preferredLocation = "") {
  const pallet = state.pallets.find((entry) => entry.id === id);
  document.querySelector("#palletDialogTitle").textContent = pallet ? "Edit pallet" : "Add pallet";
  document.querySelector("#palletId").value = pallet?.id || "";
  els.palletProduct.value = pallet?.productName || state.products[0]?.name || "";
  document.querySelector("#palletBatch").value = pallet?.batch || "";
  document.querySelector("#palletDate").value = pallet?.fifoDate || new Date().toISOString().slice(0, 10);
  els.palletPackaging.value = pallet?.packaging || "Paper sack pallet";
  els.palletWeight.value = String(pallet?.weightClass || 550);
  document.querySelector("#palletNotes").value = pallet?.notes || "";
  renderLocationOptions(pallet?.locationId || preferredLocation);
  updatePackagingFields();
  els.palletDialog.showModal();
}

function renderLocationOptions(selected = "") {
  const usedIds = occupiedLocationIds();
  els.palletLocation.innerHTML = state.locations
    .filter((location) => !usedIds.has(location.id) || location.id === selected)
    .map((location) => `<option value="${location.id}">${location.code}</option>`)
    .join("");
  els.palletLocation.value = selected || els.palletLocation.options[0]?.value || "";
}

function updatePackagingFields() {
  const rule = packagingRule(els.palletPackaging.value, Number(els.palletWeight.value));
  els.bagWeight.value = rule.bagWeight;
  els.bagCount.value = rule.bagCount;
}

function packagingRule(packaging, weightClass) {
  if (packaging === "Jumbo bag") return { bagWeight: weightClass, bagCount: 1, netKg: weightClass };
  if (weightClass === 650) return { bagWeight: 15.5, bagCount: 42, netKg: 650 };
  return { bagWeight: 13, bagCount: 42, netKg: 550 };
}

async function savePallet(event) {
  event.preventDefault();
  if (event.submitter.value === "cancel") {
    els.palletDialog.close();
    return;
  }

  const password = await requestPassword();
  if (!password) return;

  const pallet = {
    id: document.querySelector("#palletId").value || crypto.randomUUID(),
    productName: els.palletProduct.value,
    batch: document.querySelector("#palletBatch").value.trim(),
    locationId: els.palletLocation.value,
    packaging: els.palletPackaging.value,
    weightClass: Number(els.palletWeight.value),
    fifoDate: document.querySelector("#palletDate").value,
    notes: document.querySelector("#palletNotes").value.trim()
  };

  try {
    const updated = await apiPost("/api/pallets", { password, pallet });
    state = updated;
    els.palletDialog.close();
    render();
    setStatus("Saved");
  } catch (error) {
    handlePasswordError(error);
  }
}

async function deletePallet(id) {
  const pallet = state.pallets.find((entry) => entry.id === id);
  if (!pallet) return;
  if (!confirm(`Delete ${pallet.shortName} ${displayBatch(pallet)} from ${pallet.locationId}?`)) return;

  const password = await requestPassword();
  if (!password) return;

  try {
    state = await apiDelete(`/api/pallets/${encodeURIComponent(id)}`, { password });
    render();
    setStatus("Deleted");
  } catch (error) {
    handlePasswordError(error);
  }
}

async function protectedAction(confirmText, action) {
  if (!confirm(confirmText)) return;
  const password = await requestPassword();
  if (!password) return;
  try {
    state = await action(password);
    render();
    setStatus("Saved");
  } catch (error) {
    handlePasswordError(error);
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `emc-racktrack-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const imported = JSON.parse(reader.result);
      const password = await requestPassword();
      if (!password) return;
      state = await apiPost("/api/import", { password, state: imported });
      render();
      setStatus("Imported");
    } catch (error) {
      handlePasswordError(error);
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

async function recoverPassword(event) {
  event.preventDefault();
  if (event.submitter.value === "cancel") {
    els.passwordDialog.close();
    return;
  }
  const recoveryCode = document.querySelector("#recoveryCode").value.trim();
  const newPassword = document.querySelector("#newPassword").value;
  try {
    const result = await apiPost("/api/recover", { recoveryCode, newPassword }, false);
    els.passwordDialog.close();
    alert(result.message || "Password changed.");
  } catch (error) {
    alert(error.message);
  }
}

async function requestPassword() {
  const password = prompt("Enter edit password");
  if (!password) return "";
  return password;
}

function handlePasswordError(error) {
  alert(error.message);
}

async function apiPost(url, body, needsJson = true) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return parseApiResponse(response, needsJson);
}

async function apiDelete(url, body) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return parseApiResponse(response, true);
}

async function parseApiResponse(response, needsJson) {
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.error || "Action failed.");
    error.status = response.status;
    throw error;
  }
  return needsJson ? payload : payload;
}

function occupiedLocationIds() {
  return new Set(state.pallets.map((pallet) => pallet.locationId));
}

function displayBatch(pallet) {
  return pallet.batch ? `batch ${pallet.batch}` : "No batch";
}

function setStatus(text) {
  els.storageStatus.textContent = text;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
