/* ---------- Local Service Data with Images ---------- */
let allServices = [
  { id: 1, name: "Herbal Facial",          price: "Ksh 1500", duration: "45 mins", image: "./images/herbal-facial.jpg" },
  { id: 2, name: "Natural Hair Treatment", price: "Ksh 2000", duration: "1 hour",  image: "./images/hair-treatment.jpg" },
  { id: 3, name: "Aloe Vera Massage",      price: "Ksh 1800", duration: "30 mins", image: "./images/aloe-massage.jpg" },
  { id: 4, name: "Clay Mask Detox",        price: "Ksh 1700", duration: "40 mins", image: "./images/clay-detox.jpg" },
  { id: 5, name: "Floral Pedicure",        price: "Ksh 1300", duration: "35 mins", image: "./images/floral-pedicure.jpg" }
];

/* ---------- DOM Ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  createFallingLeaves();
  setupDarkMode();
  setupSearchFilter();
  renderServices(allServices);
});

/* ---------- Falling Leaves ---------- */
function createFallingLeaves() {
  const box = document.getElementById('leaves');
  [...Array(15)].forEach(() => {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = `${Math.random()*100}vw`;
    leaf.style.animationDuration = `${4 + Math.random()*5}s`;
    leaf.style.animationDelay = `${Math.random()*5}s`;
    box.appendChild(leaf);
  });
}

/* ---------- Render Service Cards ---------- */
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

/* ---------- Card Actions (Edit / Delete) ---------- */
document.getElementById('service-list').addEventListener('click', e => {
  const card = e.target.closest('.service-card');
  if (!card) return;

  const id = +card.dataset.id;

  /* Delete card */
  if (e.target.classList.contains('delete-btn')) {
    allServices = allServices.filter(s => s.id !== id);
    renderServices(allServices);
  }

  /* Edit card: just alert user they can edit inline */
  if (e.target.classList.contains('edit-btn')) {
    alert('Simply click on the text you wish to edit, make your change, and click anywhere outside the card. Changes are in-memory and will reset on page refresh.');
  }
});

/* ---------- Dark Mode ---------- */
function setupDarkMode() {
  document.getElementById('dark-toggle')
    .addEventListener('click', () => document.body.classList.toggle('dark-mode'));
}

/* ---------- Live Search ---------- */
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
