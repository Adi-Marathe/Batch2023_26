const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const WallMessage = require('../models/WallMessage');

// Middleware: verify JWT token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'batch2023_secret');
    req.enrollmentNo = decoded.enrollmentNo;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// GET /api/wall — Fetch all messages (public, no auth required)
router.get('/', async (req, res) => {
  try {
    const messages = await WallMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/wall — Create a message (auth required, 1 per student)
router.post('/', authenticate, async (req, res) => {
  try {
    const { message, authorName, color } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }




    // Check if user already has a message
    const existing = await WallMessage.findOne({ enrollmentNo: req.enrollmentNo });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You can only stick one message to the wall!' });
    }

    const wallMsg = new WallMessage({
      enrollmentNo: req.enrollmentNo,
      authorName: authorName || 'Unknown',
      message: message.trim(),
      color: color || '#FFE066',
    });

    await wallMsg.save();
    res.status(201).json({ success: true, data: wallMsg });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You can only stick one message to the wall!' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/wall/:id — Delete own message (auth required)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const msg = await WallMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (msg.enrollmentNo !== req.enrollmentNo) {
      return res.status(403).json({ success: false, message: 'You can only delete your own message' });
    }

    await WallMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message removed from the wall!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
