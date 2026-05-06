const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// GET all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single staff by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Staff.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Staff not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
