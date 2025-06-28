/* ===== Global State ===== */
let allServices = [];

/* ===== API Configuration ===== */
const API_BASE_URL = 'http://localhost:3001'; // json-server URL

/* ===== API Functions ===== */
// GET all services
async function fetchServices() {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

// POST new service
async function createService(serviceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

// PATCH/UPDATE existing service
async function updateService(id, serviceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

// DELETE service
async function deleteService(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return true;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

/* ===== DOM Ready ===== */
document.addEventListener('DOMContentLoaded', () => {
  createFallingLeaves();
  setupDarkMode();
  setupSearchFilter();
  loadServices();
});

/* ===== Load Services from API ===== */
async function loadServices() {
  try {
    allServices = await fetchServices();
    renderServices(allServices);
  } catch (error) {
    console.error('Failed to load services:', error);
    // Fallback to local data if API fails
    try {
      const response = await fetch('./db.json');
      const data = await response.json();
      allServices = data.services;
      renderServices(allServices);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
  }
}

/* ===== Render Service Cards ===== */
//function renderServices(list) {
//  const container = document.getElementById('service-list');
//  container.innerHTML = '';
//
//  list.forEach(service => {
//    const card = document.createElement('div');
//    card.className = 'service-card';
//    card.dataset.id = service.id;
//
//    card.innerHTML = `
//      <img src="${service.image}" alt="${service.name}" class="service-img" />
//      <h3 contenteditable="true">${service.name}</h3>
//      <p contenteditable="true"><strong>Price:</strong> ${service.price}</p>
//      <p contenteditable="true"><strong>Duration:</strong> ${service.duration}</p>
//      <button class="btn edit-btn">Edit</button>
//      <button class="btn delete-btn">Delete</button>
//    `;
//
//    container.appendChild(card);
//  });
//}
/* my version of the code */

/* ===== Render Service Cards with API Integration ===== */
function renderServices(list) {
  const container = document.getElementById('service-list');
  container.innerHTML = '';

  // Add "Add New Service" card at the beginning
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

  // Render existing services
  list.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.id = service.id;

    card.innerHTML = `
      <img src="${service.image}" alt="${service.name}" class="service-img" />
      <h3 class="service-name" data-field="name">${service.name}</h3>
      <p class="service-price" data-field="price"><strong>Price:</strong> ${service.price}</p>
      <p class="service-duration" data-field="duration"><strong>Duration:</strong> ${service.duration}</p>
      <div class="card-actions">
        <button class="btn edit-btn" data-id="${service.id}">Edit</button>
        <button class="btn save-btn" data-id="${service.id}" style="display:none;">Save</button>
        <button class="btn cancel-btn" data-id="${service.id}" style="display:none;">Cancel</button>
        <button class="btn delete-btn" data-id="${service.id}">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });
}


/* ===== Add New Service Form ===== */
function showAddServiceForm() {
  const formHtml = `
    <div class="modal-overlay" id="add-service-modal">
      <div class="modal-content">
        <h2>Add New Service</h2>
        <form id="add-service-form">
          <div class="form-group">
            <label for="service-name">Service Name:</label>
            <input type="text" id="service-name" required>
          </div>
          <div class="form-group">
            <label for="service-price">Price:</label>
            <input type="text" id="service-price" placeholder="e.g., Ksh 1500" required>
          </div>
          <div class="form-group">
            <label for="service-duration">Duration:</label>
            <input type="text" id="service-duration" placeholder="e.g., 45 mins" required>
          </div>
          <div class="form-group">
            <label for="service-image">Image URL:</label>
            <input type="url" id="service-image" placeholder="https://example.com/image.jpg" required>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn primary-btn">Add Service</button>
            <button type="button" class="btn secondary-btn" onclick="closeAddServiceForm()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', formHtml);
  
  // Handle form submission
  document.getElementById('add-service-form').addEventListener('submit', handleAddService);
}

function closeAddServiceForm() {
  const modal = document.getElementById('add-service-modal');
  if (modal) modal.remove();
}

async function handleAddService(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const serviceData = {
    name: document.getElementById('service-name').value,
    price: document.getElementById('service-price').value,
    duration: document.getElementById('service-duration').value,
    image: document.getElementById('service-image').value
  };
  
  try {
    const newService = await createService(serviceData);
    allServices.push(newService);
    renderServices(allServices);
    closeAddServiceForm();
    showNotification('Service added successfully!', 'success');
  } catch (error) {
    showNotification('Failed to add service. Please try again.', 'error');
  }
}

/* ===== Notification System ===== */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ===== Handle Edit & Delete with API ===== */
document.getElementById('service-list').addEventListener('click', async (event) => {
  const card = event.target.closest('.service-card');
  if (!card || card.classList.contains('add-new-card')) return;

  const id = +card.dataset.id;
  const button = event.target;

  // Handle Delete
  if (button.classList.contains('delete-btn')) {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        allServices = allServices.filter(service => service.id !== id);
        renderServices(allServices);
        showNotification('Service deleted successfully!', 'success');
      } catch (error) {
        showNotification('Failed to delete service. Please try again.', 'error');
      }
    }
    return;
  }

  // Handle Edit
  if (button.classList.contains('edit-btn')) {
    makeCardEditable(card);
    return;
  }

  // Handle Save
  if (button.classList.contains('save-btn')) {
    await saveServiceChanges(card, id);
    return;
  }

  // Handle Cancel
  if (button.classList.contains('cancel-btn')) {
    cancelEdit(card);
    return;
  }
});

/* ===== Edit Mode Functions ===== */
function makeCardEditable(card) {
  const nameEl = card.querySelector('.service-name');
  const priceEl = card.querySelector('.service-price');
  const durationEl = card.querySelector('.service-duration');
  
  // Store original values
  card.dataset.originalName = nameEl.textContent;
  card.dataset.originalPrice = priceEl.innerHTML;
  card.dataset.originalDuration = durationEl.innerHTML;
  
  // Make editable
  nameEl.contentEditable = true;
  nameEl.classList.add('editing');
  
  // Create input fields for price and duration
  const priceInput = document.createElement('input');
  priceInput.type = 'text';
  priceInput.value = priceEl.textContent.replace('Price: ', '');
  priceInput.className = 'edit-input';
  
  const durationInput = document.createElement('input');
  durationInput.type = 'text';
  durationInput.value = durationEl.textContent.replace('Duration: ', '');
  durationInput.className = 'edit-input';
  
  priceEl.innerHTML = '<strong>Price:</strong> ';
  priceEl.appendChild(priceInput);
  
  durationEl.innerHTML = '<strong>Duration:</strong> ';
  durationEl.appendChild(durationInput);
  
  // Toggle buttons
  card.querySelector('.edit-btn').style.display = 'none';
  card.querySelector('.save-btn').style.display = 'inline-block';
  card.querySelector('.cancel-btn').style.display = 'inline-block';
}

async function saveServiceChanges(card, id) {
  const nameEl = card.querySelector('.service-name');
  const priceInput = card.querySelector('.service-price input');
  const durationInput = card.querySelector('.service-duration input');
  
  const updatedData = {
    name: nameEl.textContent.trim(),
    price: priceInput.value.trim(),
    duration: durationInput.value.trim()
  };
  
  try {
    const updatedService = await updateService(id, updatedData);
    
    // Update local data
    const serviceIndex = allServices.findIndex(s => s.id === id);
    if (serviceIndex !== -1) {
      allServices[serviceIndex] = { ...allServices[serviceIndex], ...updatedService };
    }
    
    // Re-render to reset the card
    renderServices(allServices);
    showNotification('Service updated successfully!', 'success');
  } catch (error) {
    showNotification('Failed to update service. Please try again.', 'error');
    cancelEdit(card);
  }
}

function cancelEdit(card) {
  // Restore original values and re-render
  loadServices();
}

/* ===== Dark Mode Toggle with localStorage ===== */
function setupDarkMode() {
  const toggleButton = document.getElementById('dark-toggle');
  
  // Load saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply the saved theme on page load
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggleButton) {
      toggleButton.textContent = '☀️ Light Mode';
    }
  } else {
    document.body.classList.remove('dark-mode');
    if (toggleButton) {
      toggleButton.textContent = '🌙 Dark Mode';
    }
  }
  
  // Add click event listener for theme toggle
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const isDarkMode = document.body.classList.contains('dark-mode');
      
      if (isDarkMode) {
        // Switch to light mode
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        toggleButton.textContent = '🌙 Dark Mode';
        console.log('Switched to Light Mode');
      } else {
        // Switch to dark mode
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        toggleButton.textContent = '☀️ Light Mode';
        console.log('Switched to Dark Mode');
      }
    });
  }
}

/* ===== Get Current Theme ===== */
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

/* ===== Set Theme Programmatically ===== */
function setTheme(theme) {
  const toggleButton = document.getElementById('dark-toggle');
  
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    if (toggleButton) {
      toggleButton.textContent = '☀️ Light Mode';
    }
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    if (toggleButton) {
      toggleButton.textContent = '🌙 Dark Mode';
    }
  }
}

/* ===== Live Search Filter ===== */
function setupSearchFilter() {
  document.getElementById('search-input')
    .addEventListener('input', e => {
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
};  /* <-- closing brace + semicolon added */
