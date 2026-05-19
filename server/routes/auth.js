const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════
//  OPTIMIZATION: Cache enrollment numbers at startup
//  instead of reading the file on EVERY login request
// ═══════════════════════════════════════════
let validEnrollments = null;

function loadEnrollments() {
  if (validEnrollments) return validEnrollments;
  
  try {
    const studentsFile = path.join(__dirname, '../../client/src/data/students.js');
    const content = fs.readFileSync(studentsFile, 'utf-8');
    const matches = [...content.matchAll(/enrollmentNo:\s*"([^"]+)"/g)];
    validEnrollments = new Set(matches.map(m => m[1])); // Set for O(1) lookup
    console.log(`✅ Cached ${validEnrollments.size} enrollment numbers`);
    return validEnrollments;
  } catch (err) {
    console.error('Error reading students.js:', err);
    return new Set();
  }
}

// Pre-load on module init
loadEnrollments();

router.post('/login', (req, res) => {
  const { enrollmentNo, password } = req.body;
  
  if (password !== 'Ietk@1157') {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const enrollments = loadEnrollments();
  
  if (!enrollments.has(enrollmentNo)) {
    return res.status(401).json({ success: false, message: 'Invalid enrollment number' });
  }

  const token = jwt.sign(
    { enrollmentNo }, 
    process.env.JWT_SECRET || 'batch2023_secret', 
    { expiresIn: '7d' }
  );
  
  res.json({ success: true, token, message: 'Login successful' });
});

module.exports = router;
