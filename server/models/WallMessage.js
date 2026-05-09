const mongoose = require('mongoose');

const wallMessageSchema = new mongoose.Schema({
  enrollmentNo: { type: String, required: true, unique: true },
  authorName: { type: String, required: true },
  message: { type: String, required: true },
  color: { type: String, default: '#FFE066' },
}, { timestamps: true });

module.exports = mongoose.model('WallMessage', wallMessageSchema);
