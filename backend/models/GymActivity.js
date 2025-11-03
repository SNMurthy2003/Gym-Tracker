const mongoose = require('mongoose');

const gymActivitySchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GymActivity', gymActivitySchema);
