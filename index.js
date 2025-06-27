/* ===== Fetch services.json (works on GitHub Pages) ===== */
let allServices = [];

document.addEventListener('DOMContentLoaded', () => {
  createFallingLeaves();
  setupDarkMode();
  setupSearchFilter();
  fetch('./services.json')
    .then(res => res.json())
    .then(data => {
      allServices = data;
      renderServices(allServices);
    })
    .catch(err => console.error('Could not load services.json', err));
});

/* ===== Falling-leaf animation (unchanged) ===== */
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

/* ===== Render cards ===== */
function renderServices(list) {
  const wrap = document.getElementById('service-list');
  wrap.innerHTML = '';
  list.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.id = svc.id;
    card.innerHTML = `
      <img src="${svc.image}" alt="${svc.name}" class="service-img">
      <h3 contenteditable="true">${svc.name}</h3>
      <p contenteditable="true"><strong>Price:</strong> ${svc.price}</p>
      <p contenteditable="true"><strong>Duration:</strong> ${svc.duration}</p>
      <button class="btn edit-btn">Edit</button>
      <button class="btn delete-btn">Delete</button>
    `;
    wrap.appendChild(card);
  });
}

/* ===== Edit & Delete via event delegation ===== */
document.getElementById('service-list').addEventListener('click', e => {
  const card = e.target.closest('.service-card');
  if (!card) return;
  const id = +card.dataset.id;

  if (e.target.classList.contains('delete-btn')) {
    allServices = allServices.filter(s => s.id !== id);
    renderServices(allServices);
  }

  if (e.target.classList.contains('edit-btn')) {
    alert('Click directly on the text to edit it. Changes are temporary (in-memory).');
  }
});

/* ===== Dark mode toggle ===== */
function setupDarkMode() {
  document.getElementById('dark-toggle')
    .addEventListener('click', () => document.body.classList.toggle('dark-mode'));
}

/* ===== Live search filter ===== */
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
