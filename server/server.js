// server/server.js — Express entry point
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'Savour API is running 🍽️', time: new Date() })
);

// Serve 404 page for unmatched routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api'))
    return res.status(404).json({ message: 'API endpoint not found.' });
  res.sendFile(path.join(__dirname, '../public/404.html'));
});

// ── Global error handler ────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
});

// ── Connect DB then start server ───────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🌱 Seed data at: http://localhost:${PORT}/api/recipes/seed`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
