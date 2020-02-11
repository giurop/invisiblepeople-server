const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ message: 'TESTING' })
});

const authRoutes = require('./auth');
router.use('/', authRoutes);

module.exports = router;
