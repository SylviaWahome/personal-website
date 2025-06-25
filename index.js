/* ==========  Global State  ========== */
let allServices = [];

/* ==========  DOMContentLoaded  ========== */
document.addEventListener('DOMContentLoaded', () => {
  createFallingLeaves();
  fetchServices();
  setupDarkMode();
  setupSearchFilter();
});

/* ==========  Falling Leaves Animation  ========== */
function createFallingLeaves() {
  const leavesContainer = document.getElementById('leaves');
  for (let i = 0; i < 15; i++) {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    leaf.style.left = Math.random() * 100 + 'vw';
    leaf.style.animationDuration = 4 + Math.random() * 5 + 's';
    leaf.style.animationDelay = Math.random() * 5 + 's';
    leavesContainer.appendChild(leaf);
  }
}

/* ==========  Fetch & Render Services  ========== */
function fetchServices() {
  fetch('http://localhost:5000/services')
    .then(res => res.json())
    .then(data => {
      allServices = data;          // store for filtering
      displayServices(allServices);
    })
    .catch(err => console.error('Fetch error:', err));
}

function displayServices(services) {
  const container = document.getElementById('service-list');
  container.innerHTML = '';
  services.forEach(renderServiceCard);   // array method
}

function renderServiceCard(service) {
  const container = document.getElementById('service-list');
  const card = document.createElement('div');
  card.className = 'service-card';
  card.innerHTML = `
    <h3>${service.name}</h3>
    <p><strong>Price:</strong> ${service.price}</p>
    <p><strong>Duration:</strong> ${service.duration}</p>
  `;
  container.appendChild(card);
}

/* ==========  Dark Mode  ========== */
function setupDarkMode() {
  const btn = document.getElementById('dark-toggle');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
}

/* ==========  Live Search Filter  ========== */
function setupSearchFilter() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    const filtered = allServices.filter(svc =>
      svc.name.toLowerCase().includes(term)
    );
    displayServices(filtered);
  });
}
