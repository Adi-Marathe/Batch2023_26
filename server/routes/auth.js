const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

router.post('/login', (req, res) => {
  const { enrollmentNo, password } = req.body;
  
  if (password !== 'Ietk@1157') {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Get valid enrollment numbers from client/src/data/students.js
  const studentsFile = path.join(__dirname, '../../client/src/data/students.js');
  
  try {
    const content = fs.readFileSync(studentsFile, 'utf-8');
    const matches = [...content.matchAll(/enrollmentNo:\s*"([^"]+)"/g)];
    const validEnrollments = matches.map(m => m[1]);
    
    if (!validEnrollments.includes(enrollmentNo)) {
      return res.status(401).json({ success: false, message: 'Invalid enrollment number' });
    }

    const token = jwt.sign(
      { enrollmentNo }, 
      process.env.JWT_SECRET || 'batch2023_secret', 
      { expiresIn: '7d' }
    );
    
    res.json({ success: true, token, message: 'Login successful' });
  } catch (err) {
    console.error('Error reading students.js:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
