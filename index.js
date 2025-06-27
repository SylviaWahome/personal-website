/* ===== Config ===== */
const API_URL = 'https://shee-parlour-api.onrender.com/services';   // ← change if your Render URL differs

/* ===== Global State ===== */
let allServices = [];

/* ===== DOM Ready ===== */
document.addEventListener('DOMContentLoaded', () => {
  createFallingLeaves();
  setupDarkMode();
  setupSearchFilter();
  loadServices();
});

/* ===== Load Services from Render ===== */
function loadServices() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allServices = data;
      document.getElementById('loading-text').style.display = 'none';
      renderServices(allServices);
    })
    .catch(err => {
      console.error('Error loading services:', err);
      document.getElementById('loading-text').textContent = 'Failed to load services.';
    });
}

/* ===== Render Service Cards ===== */
function renderServices(list) {
  const wrap = document.getElementById('service-list');
  wrap.innerHTML = '';

  list.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.id = svc.id;
    card.innerHTML = `
      <img src="${svc.image}" alt="${svc.name}" class="service-img" />
      <h3 contenteditable="true">${svc.name}</h3>
      <p contenteditable="true"><strong>Price:</strong> ${svc.price}</p>
      <p contenteditable="true"><strong>Duration:</strong> ${svc.duration}</p>
      <button class="btn edit-btn">Edit</button>
      <button class="btn delete-btn">Delete</button>
    `;
    wrap.appendChild(card);
  });
}

/* ===== Edit & Delete ===== */
document.getElementById('service-list').addEventListener('click', e => {
  const card = e.target.closest('.service-card');
  if (!card) return;

  const id = +card.dataset.id;

  if (e.target.classList.contains('delete-btn')) {
    allServices = allServices.filter(s => s.id !== id);
    renderServices(allServices);
  }

  if (e.target.classList.contains('edit-btn')) {
    alert('Click directly on text to edit. Changes reset on refresh.');
  }
});

/* ===== Dark Mode ===== */
function setupDarkMode() {
  document.getElementById('dark-toggle')
    .addEventListener('click', () => document.body.classList.toggle('dark-mode'));
}

/* ===== Live Search ===== */
function setupSearchFilter() {
  document.getElementById('search-input')
    .addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      const filtered = allServices.filter(s =>
        s.name.toLowerCase().includes(term)
      );
      renderServices(filtered);
    });
}

/* ===== Falling Leaves ===== */
function createFallingLeaves() {
  const box = document.getElementById('leaves');
  [...Array(15)].forEach(() => {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.animationDuration = `${4 + Math.random() * 5}s`;
    leaf.style.animationDelay = `${Math.random() * 5}s`;
    box.appendChild(leaf);
  });
}
