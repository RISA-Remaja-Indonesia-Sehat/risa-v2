const app = require('./app');
// const connectDB = require('./config/db'); // untuk MongoDB/MySQL

const PORT = process.env.PORT || 5000;

// Connect ke database
// connectDB();

// Listen
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
