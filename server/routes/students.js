const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/Student');

// GET student profile by enrollmentNo
router.get('/:enrollmentNo', async (req, res) => {
  try {
    // .lean() returns a plain JS object instead of a Mongoose document
    // ~3x faster because it skips hydration, change tracking, getters/setters
    const profile = await StudentProfile.findOne({ enrollmentNo: req.params.enrollmentNo }).lean();
    if (!profile) return res.json(null); // Return null so frontend knows there is no profile yet
    
    // Cache for 60 seconds — profiles don't change frequently
    res.set('Cache-Control', 'public, max-age=60');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update student profile
router.put('/:enrollmentNo', async (req, res) => {
  try {
    const { dob, city, coreMemory, currentStatus, dream, emojis } = req.body;
    
    // Use findOneAndUpdate with upsert — single atomic operation instead of find + save (2 queries)
    const profile = await StudentProfile.findOneAndUpdate(
      { enrollmentNo: req.params.enrollmentNo },
      {
        $set: {
          ...(dob !== undefined && { dob }),
          ...(city !== undefined && { city }),
          ...(coreMemory !== undefined && { coreMemory }),
          ...(currentStatus !== undefined && { currentStatus }),
          ...(dream !== undefined && { dream }),
          ...(emojis !== undefined && { emojis }),
        }
      },
      { 
        new: true,       // Return updated document
        upsert: true,    // Create if doesn't exist
        lean: true,      // Return plain object
        setDefaultsOnInsert: true
      }
    );
    
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
