const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  photo: { type: String, default: '' },
  dob: { type: String, required: true },
  city: { type: String, required: true },
  quote: { type: String, default: '' },
  dream: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
