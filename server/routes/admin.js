const express = require('express');
const router = express.Router();

// Placeholder para rutas de admin
router.get('/', (req, res) => {
  res.json({ message: 'Admin routes - En desarrollo' });
});

module.exports = router;
