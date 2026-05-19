const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// GET all staff — with lean() and caching
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().lean();
    // Staff data rarely changes — cache for 5 minutes
    res.set('Cache-Control', 'public, max-age=300');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single staff by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Staff.findById(req.params.id).lean();
    if (!member) return res.status(404).json({ message: 'Staff not found' });
    res.set('Cache-Control', 'public, max-age=300');
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
