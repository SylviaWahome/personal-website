/* ===== Global State ===== */
let allServices = [];

/* ===== DOM Ready ===== */
document.addEventListener('DOMContentLoaded', () => {
  createFallingLeaves();
  setupDarkMode();
  setupSearchFilter();
  loadServices();
});

/* ===== Load Services from services.json (GitHub Pages Compatible) ===== */
function loadServices() {
  fetch('./services.json')
    .then(response => response.json())
    .then(data => {
      allServices = data;
      renderServices(allServices);
    })
    .catch(error => console.error('Error loading services:', error));
}

/* ===== Render Service Cards ===== */
function renderServices(list) {
  const container = document.getElementById('service-list');
  container.innerHTML = '';

  list.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.id = service.id;

    card.innerHTML = `
      <img src="${service.image}" alt="${service.name}" class="service-img" />
      <h3 contenteditable="true">${service.name}</h3>
      <p contenteditable="true"><strong>Price:</strong> ${service.price}</p>
      <p contenteditable="true"><strong>Duration:</strong> ${service.duration}</p>
      <button class="btn edit-btn">Edit</button>
      <button class="btn delete-btn">Delete</button>
    `;

    container.appendChild(card);
  });
}

/* ===== Handle Edit & Delete ===== */
document.getElementById('service-list').addEventListener('click', event => {
  const card = event.target.closest('.service-card');
  if (!card) return;

  const id = +card.dataset.id;

  if (event.target.classList.contains('delete-btn')) {
    allServices = allServices.filter(service => service.id !== id);
    renderServices(allServices);
  }

  if (event.target.classList.contains('edit-btn')) {
    alert('Click directly on the text to edit. Changes will disappear on refresh.');
  }
});

/* ===== Dark Mode Toggle ===== */
function setupDarkMode() {
  document.getElementById('dark-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
}

/* ===== Live Search Filter ===== */
function setupSearchFilter() {
  document.getElementById('search-input').addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    const filtered = allServices.filter(service =>
      service.name.toLowerCase().includes(term)
    );
    renderServices(filtered);
  });
}

/* ===== Falling Leaf Animation ===== */
function createFallingLeaves() {
  const container = document.getElementById('leaves');
  for (let i = 0; i < 15; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.animationDuration = `${4 + Math.random() * 5}s`;
    leaf.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(leaf);
  }
}
