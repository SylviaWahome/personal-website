/* ===== Configuration ===== */
const API_BASE_URL = "https://shee-parlour-api.onrender.com"; // your Render backend
const SERVICES_ENDPOINT = `${API_BASE_URL}/services`;

/* ===== State ===== */
let allServices = [];

/* ===== Utilities ===== */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showNotification(msg, type = 'info') {
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.textContent = msg;
  document.getElementById('notification-root').appendChild(n);
  setTimeout(() => n.classList.add('show'), 50);
  setTimeout(() => {
    n.classList.remove('show');
    setTimeout(() => n.remove(), 300);
  }, 3000);
}

/* ===== API helpers ===== */
async function apiGetServices() {
  const res = await fetch(SERVICES_ENDPOINT);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}
async function apiCreateService(data) {
  const res = await fetch(SERVICES_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create service');
  return res.json();
}
async function apiUpdateService(id, data) {
  const res = await fetch(`${SERVICES_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update service');
  return res.json();
}
async function apiDeleteService(id) {
  const res = await fetch(`${SERVICES_ENDPOINT}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete service');
  return true;
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  createFallingLeaves();
  setupDarkMode();
  setupSearchFilter();
  setupBookingForm();
  setupGalleryLightbox();
  loadServices();
});

/* ===== Load services (try API, fallback to local db.json) ===== */
async function loadServices() {
  try {
    const data = await apiGetServices();
    allServices = data;
    const lt = document.getElementById('loading-text');
    if (lt) lt.style.display = 'none';
    renderServices(allServices);
    populateBookingServiceOptions(allServices);
  } catch (err) {
    console.error('API failed:', err);
    try {
      const resp = await fetch('./db.json');
      const json = await resp.json();
      allServices = json.services || [];
      const lt = document.getElementById('loading-text');
      if (lt) lt.style.display = 'none';
      renderServices(allServices);
      populateBookingServiceOptions(allServices);
      showNotification('Loaded local data (offline)', 'info');
    } catch (e) {
      document.getElementById('loading-text').textContent = 'Failed to load services.';
      showNotification('Unable to load services', 'error');
    }
  }
}

/* ===== Render service cards ===== */
function renderServices(list) {
  const container = document.getElementById('service-list');
  container.innerHTML = '';

  // Add new (admin) card
  const addCard = document.createElement('div');
  addCard.className = 'service-card add-new-card';
  addCard.innerHTML = `
    <div class="add-new-content">
      <div class="add-icon">+</div>
      <h3>Add New Service</h3>
      <p class="muted">Click to add a new service (admin)</p>
    </div>
  `;
  addCard.addEventListener('click', () => showAddServiceForm());
  container.appendChild(addCard);

  list.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.id = svc.id;
    card.innerHTML = `
      <img src="${escapeHtml(svc.image)}" alt="${escapeHtml(svc.name)}" class="service-img" />
      <h3 class="service-name">${escapeHtml(svc.name)}</h3>
      <p class="service-price"><strong>Price:</strong> ${escapeHtml(svc.price)}</p>
      <p class="service-duration"><strong>Duration:</strong> ${escapeHtml(svc.duration)}</p>
      <div class="card-actions">
        <button class="btn edit-btn" data-id="${svc.id}">Edit</button>
        <button class="btn save-btn" data-id="${svc.id}" style="display:none">Save</button>
        <button class="btn cancel-btn" data-id="${svc.id}" style="display:none">Cancel</button>
        <button class="btn delete-btn" data-id="${svc.id}">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ===== Add service modal (admin) ===== */
function showAddServiceForm() {
  const html = `
    <div class="modal-overlay" id="add-service-modal">
      <div class="modal-content">
        <h2>Add Service</h2>
        <form id="add-service-form">
          <label>Service Name<input id="svc-name" required></label>
          <label>Price<input id="svc-price" required></label>
          <label>Duration<input id="svc-duration" required></label>
          <label>Image URL<input id="svc-image" placeholder="https://example.com/image.jpg" required></label>
          <div class="form-actions"><button class="primary-btn" type="submit">Add</button> <button type="button" id="add-cancel" class="secondary-btn">Cancel</button></div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-root').innerHTML = html;
  document.getElementById('add-cancel').addEventListener('click', closeAddModal);
  document.getElementById('add-service-form').addEventListener('submit', handleAddService);
}
function closeAddModal() { document.getElementById('modal-root').innerHTML = ''; }

async function handleAddService(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('svc-name').value.trim(),
    price: document.getElementById('svc-price').value.trim(),
    duration: document.getElementById('svc-duration').value.trim(),
    image: document.getElementById('svc-image').value.trim()
  };
  try {
    const created = await apiCreateService(data);
    allServices.unshift(created);
    renderServices(allServices);
    populateBookingServiceOptions(allServices);
    closeAddModal();
    showNotification('Service added', 'success');
  } catch (err) {
    console.error(err);
    showNotification('Failed to add service', 'error');
  }
}

/* ===== Edit/Delete via delegation ===== */
document.getElementById('service-list').addEventListener('click', async (e) => {
  const card = e.target.closest('.service-card');
  if (!card) return;
  const id = +card.dataset.id;

  // Delete
  if (e.target.classList.contains('delete-btn')) {
    if (!confirm('Delete this service?')) return;
    try {
      await apiDeleteService(id);
      allServices = allServices.filter(s => s.id !== id);
      renderServices(allServices);
      populateBookingServiceOptions(allServices);
      showNotification('Deleted', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Delete failed', 'error');
    }
    return;
  }

  // Edit: convert fields to inputs
  if (e.target.classList.contains('edit-btn')) {
    enterEditMode(card);
    return;
  }

  // Save
  if (e.target.classList.contains('save-btn')) {
    await saveEdits(card, id);
    return;
  }

  // Cancel
  if (e.target.classList.contains('cancel-btn')) {
    renderServices(allServices);
    return;
  }
});

function enterEditMode(card) {
  const nameEl = card.querySelector('.service-name');
  const priceEl = card.querySelector('.service-price');
  const durationEl = card.querySelector('.service-duration');

  card.dataset.origName = nameEl.textContent;
  card.dataset.origPrice = priceEl.textContent.replace('Price:', '').trim();
  card.dataset.origDuration = durationEl.textContent.replace('Duration:', '').trim();

  nameEl.innerHTML = `<input class="edit-field" value="${escapeHtml(card.dataset.origName)}">`;
  priceEl.innerHTML = `<strong>Price:</strong> <input class="edit-field" value="${escapeHtml(card.dataset.origPrice)}">`;
  durationEl.innerHTML = `<strong>Duration:</strong> <input class="edit-field" value="${escapeHtml(card.dataset.origDuration)}">`;

  card.querySelector('.edit-btn').style.display = 'none';
  card.querySelector('.save-btn').style.display = 'inline-block';
  card.querySelector('.cancel-btn').style.display = 'inline-block';
}

async function saveEdits(card, id) {
  const nameVal = card.querySelector('.service-name .edit-field').value.trim();
  const priceVal = card.querySelector('.service-price .edit-field').value.trim();
  const durVal = card.querySelector('.service-duration .edit-field').value.trim();

  try {
    const updated = await apiUpdateService(id, { name: nameVal, price: priceVal, duration: durVal });
    const idx = allServices.findIndex(s => s.id === id);
    if (idx !== -1) allServices[idx] = { ...allServices[idx], ...updated };
    renderServices(allServices);
    showNotification('Updated', 'success');
  } catch (err) {
    console.error(err);
    showNotification('Update failed', 'error');
  }
}

/* ===== Search filter ===== */
function setupSearchFilter() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase();
    const filtered = allServices.filter(svc => svc.name.toLowerCase().includes(term));
    renderServices(filtered);
  });
}

/* ===== Booking (client-only) ===== */
function populateBookingServiceOptions(list) {
  const sel = document.getElementById('bk-service');
  if (!sel) return;
  sel.innerHTML = '<option value="">Choose a service</option>';
  list.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name;
    opt.textContent = s.name;
    sel.appendChild(opt);
  });
}
function setupBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bk-name').value.trim();
    const phone = document.getElementById('bk-phone').value.trim();
    const email = document.getElementById('bk-email').value.trim();
    const service = document.getElementById('bk-service').value;
    const date = document.getElementById('bk-date').value;
    const time = document.getElementById('bk-time').value;
    if (!name || !phone || !service) {
      document.getElementById('booking-msg').textContent = 'Please fill name, phone and choose a service.';
      return;
    }
    // Save booking in localStorage (simple demo)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.unshift({ name, phone, email, service, date, time, created: new Date().toISOString() });
    localStorage.setItem('bookings', JSON.stringify(bookings));
    document.getElementById('booking-msg').textContent = 'Booking request received — we will contact you soon.';
    form.reset();
    setTimeout(() => document.getElementById('booking-msg').textContent = '', 4000);
  });
  document.getElementById('booking-clear').addEventListener('click', () => form.reset());
}

/* ===== Dark mode persisted ===== */
function setupDarkMode() {
  const btn = document.getElementById('dark-toggle');
  const saved = localStorage.getItem('theme') || 'light';
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    if (btn) btn.textContent = '☀️ Light Mode';
  } else if (btn) {
    btn.textContent = '🌙 Dark Mode';
  }
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

/* ===== Leaves animation ===== */
function createFallingLeaves() {
  const box = document.getElementById('leaves');
  for (let i = 0; i < 12; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.animationDuration = `${5 + Math.random() * 6}s`;
    leaf.style.animationDelay = `${Math.random() * 6}s`;
    box.appendChild(leaf);
  }
}

/* ===== Gallery lightbox (simple) ===== */
function setupGalleryLightbox() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-content"><img src="${img.src}" style="max-width:100%;border-radius:8px" alt="${img.alt}"><div style="margin-top:8px;text-align:right"><button id="close-lightbox" class="secondary-btn">Close</button></div></div>`;
    document.body.appendChild(overlay);
    document.getElementById('close-lightbox').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
  });
}
