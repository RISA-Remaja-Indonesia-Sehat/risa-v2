const express = require('express');

// const routes = require('./routes'); //index.js di dalam folder routes

const app = express();

// Middleware
app.use(express.json());

// Routes
// app.use('/api', routes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
