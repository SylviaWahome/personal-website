// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

/**
 * 👉 1.  Use Render’s injected PORT if available.
 * 👉 2.  Fall back to 3001 for local development.
 */
const PORT = process.env.PORT || 3001;

const DB_FILE = path.join(__dirname, 'db.json');

// ──────────────────────  MIDDLEWARE  ──────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html, images, etc.

// ────────────────────  HELPER FUNCTIONS  ──────────────────
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { services: [] };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

function getNextId(services) {
  return services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
}

// ──────────────────────────  ROUTES  ──────────────────────
app.get('/services', (req, res) => {
  const db = readDatabase();
  res.json(db.services);
});

app.get('/services/:id', (req, res) => {
  const db = readDatabase();
  const service = db.services.find(s => s.id === Number(req.params.id));
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

app.post('/services', (req, res) => {
  const { name, price, duration, image } = req.body;
  if (!name || !price || !duration || !image) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = readDatabase();
  const newService = {
    id: getNextId(db.services),
    name: name.trim(),
    price: price.trim(),
    duration: duration.trim(),
    image: image.trim(),
  };

  db.services.push(newService);
  writeDatabase(db);
  res.status(201).json(newService);
});

app.patch('/services/:id', (req, res) => {
  const db = readDatabase();
  const idx = db.services.findIndex(s => s.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });

  const updates = req.body;
  db.services[idx] = { ...db.services[idx], ...updates };
  writeDatabase(db);
  res.json(db.services[idx]);
});

app.delete('/services/:id', (req, res) => {
  const db = readDatabase();
  const idx = db.services.findIndex(s => s.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });

  const [deletedService] = db.services.splice(idx, 1);
  writeDatabase(db);
  res.json({ message: 'Service deleted successfully', deletedService });
});

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Fallback to index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ───────────────────────  START SERVER  ───────────────────
/**
 * 👉 Bind to 0.0.0.0 so Render’s port scanner sees the open port.
 *    (Locally this behaves the same as app.listen(PORT).)
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
});

module.exports = app;
