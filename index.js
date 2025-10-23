/* ===== Config ===== */
const API_BASE_URL = "https://personal-website-del6.onrender.com"; // your Render domain (no trailing slash)
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
function escapeAttr(s = '') { return String(s).replace(/"/g, '&quot;'); }

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

/* ===== API actions ===== */
async function fetchServices() {
  const res = await fetch(SERVICES_ENDPOINT);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}
async function createService(data) {
  const res = await fetch(SERVICES_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create service');
  return res.json();
}
async function updateService(id, data) {
  const res = await fetch(`${SERVICES_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update service');
  return res.json();
}
async function deleteService(id) {
  const res = await fetch(`${SERVICES_ENDPOINT}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete service');
  return true;
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  createFallingLeaves();
  setupDarkMode();
  setupSearchFilter();
  loadServices();
});

/* ===== Load ===== */
async function loadServices() {
  try {
    const data = await fetchServices();
    allServices = data;
    const lt = document.getElementById('loading-text');
    if (lt) lt.style.display = 'none';
    renderServices(allServices);
  } catch (err) {
    console.error('API failed:', err);
    // fallback to local db.json
    try {
      const fallback = await fetch('./db.json');
      const json = await fallback.json();
      allServices = json.services || [];
      const lt = document.getElementById('loading-text');
      if (lt) lt.style.display = 'none';
      renderServices(allServices);
      showNotification('Loaded local data (offline)', 'info');
    } catch (e) {
      const lt = document.getElementById('loading-text');
      if (lt) lt.textContent = 'Failed to load services.';
      showNotification('Unable to load services', 'error');
    }
  }
}

/* ===== Render services ===== */
function renderServices(list) {
  const container = document.getElementById('service-list');
  container.innerHTML = '';

  // Add new card (first)
  const addCard = document.createElement('div');
  addCard.className = 'service-card add-new-card';
  addCard.innerHTML = `
    <div class="add-new-content">
      <div class="add-icon">+</div>
      <h3>Add New Service</h3>
      <p>Click to add a new service</p>
    </div>
  `;
  addCard.addEventListener('click', showAddServiceForm);
  container.appendChild(addCard);

  list.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.id = svc.id;
    card.innerHTML = `
      <img src="${escapeAttr(svc.image)}" alt="${escapeAttr(svc.name)}" class="service-img" />
      <h3 class="service-name">${escapeHtml(svc.name)}</h3>
      <p class="service-price"><strong>Price:</strong> ${escapeHtml(svc.price)}</p>
      <p class="service-duration"><strong>Duration:</strong> ${escapeHtml(svc.duration)}</p>
      <p class="service-category"><strong>Category:</strong> ${escapeHtml(svc.category || '')}</p>
      <p class="service-description">${escapeHtml(svc.description || '')}</p>
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

/* ===== Add service modal ===== */
function showAddServiceForm() {
  const modalHtml = `
    <div class="modal-overlay" id="add-service-modal">
      <div class="modal-content" role="dialog" aria-modal="true">
        <h2>Add New Service</h2>
        <form id="add-service-form">
          <div class="form-group"><label for="service-name">Name</label><input id="service-name" required></div>
          <div class="form-group"><label for="service-price">Price</label><input id="service-price" required></div>
          <div class="form-group"><label for="service-duration">Duration</label><input id="service-duration" required></div>
          <div class="form-group"><label for="service-category">Category</label><input id="service-category"></div>
          <div class="form-group"><label for="service-description">Description</label><textarea id="service-description" rows="3"></textarea></div>
          <div class="form-group"><label for="service-image">Image URL</label><input id="service-image" placeholder="https://..." required></div>
          <div class="form-actions">
            <button type="submit" class="primary-btn">Add Service</button>
            <button type="button" class="secondary-btn" id="cancel-add">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-root').innerHTML = modalHtml;
  document.getElementById('cancel-add').addEventListener('click', closeAddServiceForm);
  document.getElementById('add-service-form').addEventListener('submit', handleAddService);
}

function closeAddServiceForm() {
  document.getElementById('modal-root').innerHTML = '';
}

async function handleAddService(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('service-name').value.trim(),
    price: document.getElementById('service-price').value.trim(),
    duration: document.getElementById('service-duration').value.trim(),
    category: document.getElementById('service-category').value.trim(),
    description: document.getElementById('service-description').value.trim(),
    image: document.getElementById('service-image').value.trim()
  };
  try {
    const created = await createService(data);
    allServices.push(created);
    renderServices(allServices);
    closeAddServiceForm();
    showNotification('Service added', 'success');
  } catch (err) {
    console.error(err);
    showNotification('Failed to add service', 'error');
  }
}

/* ===== Delegated actions ===== */
document.getElementById('service-list').addEventListener('click', async (e) => {
  const card = e.target.closest('.service-card');
  if (!card) return;
  const id = +card.dataset.id;

  // Delete
  if (e.target.classList.contains('delete-btn')) {
    if (!confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      allServices = allServices.filter(s => s.id !== id);
      renderServices(allServices);
      showNotification('Service deleted', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Delete failed', 'error');
    }
    return;
  }

  // Edit - inline
  if (e.target.classList.contains('edit-btn')) {
    enterEditMode(card);
    return;
  }

  // Save (instant save)
  if (e.target.classList.contains('save-btn')) {
    await handleSave(card, id);
    return;
  }

  // Cancel
  if (e.target.classList.contains('cancel-btn')) {
    cancelEdit(card);
    return;
  }
});

/* ===== Edit helpers (inline editing) ===== */
function enterEditMode(card) {
  const nameEl = card.querySelector('.service-name');
  const priceEl = card.querySelector('.service-price');
  const durationEl = card.querySelector('.service-duration');
  const categoryEl = card.querySelector('.service-category');
  const descriptionEl = card.querySelector('.service-description');

  // store originals
  card.dataset.origName = nameEl.textContent;
  card.dataset.origPrice = priceEl.textContent.replace('Price:', '').trim();
  card.dataset.origDuration = durationEl.textContent.replace('Duration:', '').trim();
  card.dataset.origCategory = categoryEl.textContent.replace('Category:', '').trim();
  card.dataset.origDescription = descriptionEl.textContent;

  // replace with inputs
  nameEl.innerHTML = `<input class="edit-field" value="${escapeAttr(card.dataset.origName)}">`;
  priceEl.innerHTML = `<strong>Price:</strong> <input class="edit-field" value="${escapeAttr(card.dataset.origPrice)}">`;
  durationEl.innerHTML = `<strong>Duration:</strong> <input class="edit-field" value="${escapeAttr(card.dataset.origDuration)}">`;
  categoryEl.innerHTML = `<strong>Category:</strong> <input class="edit-field" value="${escapeAttr(card.dataset.origCategory)}">`;
  descriptionEl.innerHTML = `<textarea class="edit-field">${escapeAttr(card.dataset.origDescription)}</textarea>`;

  // toggle buttons
  card.querySelector('.edit-btn').style.display = 'none';
  card.querySelector('.save-btn').style.display = 'inline-block';
  card.querySelector('.cancel-btn').style.display = 'inline-block';
}

async function handleSave(card, id) {
  const nameVal = card.querySelector('.service-name .edit-field').value.trim();
  const priceVal = card.querySelector('.service-price .edit-field').value.trim();
  const durationVal = card.querySelector('.service-duration .edit-field').value.trim();
  const categoryVal = card.querySelector('.service-category .edit-field').value.trim();
  const descriptionVal = card.querySelector('.service-description .edit-field').value.trim();

  const payload = { name: nameVal, price: priceVal, duration: durationVal, category: categoryVal, description: descriptionVal };

  try {
    const updated = await updateService(id, payload);
    const idx = allServices.findIndex(s => s.id === id);
    if (idx !== -1) allServices[idx] = { ...allServices[idx], ...updated };
    renderServices(allServices);
    showNotification('Service updated', 'success');
  } catch (err) {
    console.error(err);
    showNotification('Update failed', 'error');
    cancelEdit(card);
  }
}

function cancelEdit(card) {
  renderServices(allServices);
}

/* ===== Search ===== */
function setupSearchFilter() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', e => {
    const term = e.target.value.trim().toLowerCase();
    const filtered = allServices.filter(s =>
      s.name.toLowerCase().includes(term) || (s.category || '').toLowerCase().includes(term)
    );
    renderServices(filtered);
  });
}

/* ===== Dark mode (persist) ===== */
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
  for (let i = 0; i < 15; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.animationDuration = `${4 + Math.random() * 6}s`;
    leaf.style.animationDelay = `${Math.random() * 5}s`;
    box.appendChild(leaf);
  }
}
