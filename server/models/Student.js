const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  enrollmentNo: { type: String, required: true, unique: true },
  dob: { type: String, default: '' },
  city: { type: String, default: '' },
  coreMemory: { type: String, default: '' },
  currentStatus: { type: String, default: '' },
  dream: { type: String, default: '' },
  emojis: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentSchema);
