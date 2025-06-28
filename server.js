const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001; // Changed to match your frontend
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Helper function to read database
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { services: [] };
  }
}

// Helper function to write database
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// Helper function to get next ID
function getNextId(services) {
  return services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
}

// Routes

// GET all services
app.get('/services', (req, res) => {
  try {
    const db = readDatabase();
    console.log(`GET /services - Returning ${db.services.length} services`);
    res.json(db.services);
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET single service
app.get('/services/:id', (req, res) => {
  try {
    const db = readDatabase();
    const serviceId = parseInt(req.params.id);
    const service = db.services.find(s => s.id === serviceId);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    console.log(`GET /services/${serviceId} - Found service: ${service.name}`);
    res.json(service);
  } catch (error) {
    console.error('Error getting service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// POST new service
app.post('/services', (req, res) => {
  try {
    const { name, price, duration, image } = req.body;
    
    // Validation
    if (!name || !price || !duration || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const db = readDatabase();
    const newService = {
      id: getNextId(db.services),
      name: name.trim(),
      price: price.trim(),
      duration: duration.trim(),
      image: image.trim()
    };
    
    db.services.push(newService);
    
    if (writeDatabase(db)) {
      console.log(`POST /services - Created service: ${newService.name} (ID: ${newService.id})`);
      res.status(201).json(newService);
    } else {
      res.status(500).json({ error: 'Failed to save service' });
    }
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// PATCH/PUT update service
app.patch('/services/:id', (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    const updates = req.body;
    
    const db = readDatabase();
    const serviceIndex = db.services.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    // Update only provided fields
    const updatedService = { ...db.services[serviceIndex] };
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && updates[key] !== null) {
        updatedService[key] = typeof updates[key] === 'string' ? updates[key].trim() : updates[key];
      }
    });
    
    db.services[serviceIndex] = updatedService;
    
    if (writeDatabase(db)) {
      console.log(`PATCH /services/${serviceId} - Updated service: ${updatedService.name}`);
      res.json(updatedService);
    } else {
      res.status(500).json({ error: 'Failed to update service' });
    }
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE service
app.delete('/services/:id', (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    const db = readDatabase();
    const serviceIndex = db.services.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const deletedService = db.services[serviceIndex];
    db.services.splice(serviceIndex, 1);
    
    if (writeDatabase(db)) {
      console.log(`DELETE /services/${serviceId} - Deleted service: ${deletedService.name}`);
      res.json({ message: 'Service deleted successfully', deletedService });
    } else {
      res.status(500).json({ error: 'Failed to delete service' });
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at:`);
  console.log(`   GET    /services`);
  console.log(`   POST   /services`);
  console.log(`   GET    /services/:id`);
  console.log(`   PATCH  /services/:id`);
  console.log(`   DELETE /services/:id`);
  console.log(`   GET    /health`);
  
  // Check if database file exists
  if (fs.existsSync(DB_FILE)) {
    const db = readDatabase();
    console.log(`📁 Database loaded with ${db.services.length} services`);
  } else {
    console.log(`⚠️  Database file not found at ${DB_FILE}`);
  }
});

module.exports = app;