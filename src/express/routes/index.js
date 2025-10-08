const express = require('express');
const router = express.Router();

router.use('/users', require('./users.router'));
// router.use('/articles', require('./articles.router'));
// router.use('/games', require('./games.router'));

// Tambahkan route lain sesuai kebutuhan

module.exports = router;