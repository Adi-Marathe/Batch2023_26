const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/Student');

// GET student profile by enrollmentNo
router.get('/:enrollmentNo', async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ enrollmentNo: req.params.enrollmentNo });
    if (!profile) return res.json(null); // Return null so frontend knows there is no profile yet
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update student profile
router.put('/:enrollmentNo', async (req, res) => {
  try {
    const { dob, city, coreMemory, currentStatus, dream, emojis } = req.body;
    
    let profile = await StudentProfile.findOne({ enrollmentNo: req.params.enrollmentNo });
    if (!profile) {
      profile = new StudentProfile({
        enrollmentNo: req.params.enrollmentNo,
        dob, city, coreMemory, currentStatus, dream, emojis
      });
    } else {
      profile.dob = dob !== undefined ? dob : profile.dob;
      profile.city = city !== undefined ? city : profile.city;
      profile.coreMemory = coreMemory !== undefined ? coreMemory : profile.coreMemory;
      profile.currentStatus = currentStatus !== undefined ? currentStatus : profile.currentStatus;
      profile.dream = dream !== undefined ? dream : profile.dream;
      profile.emojis = emojis !== undefined ? emojis : profile.emojis;
    }
    
    await profile.save();
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
