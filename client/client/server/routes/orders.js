const express = require('express');
const router = express.Router();

// Placeholder para rutas de órdenes
router.get('/', (req, res) => {
  res.json({ message: 'Orders routes - En desarrollo' });
});

module.exports = router;
