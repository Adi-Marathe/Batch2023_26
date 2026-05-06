const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  subject: { type: String, required: true },
  photo: { type: String, default: '' },
  knownFor: { type: String, default: '' },
  advice: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
