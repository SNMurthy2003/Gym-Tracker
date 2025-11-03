const mongoose = require('mongoose');

const memberPaymentSchema = new mongoose.Schema({
  memberId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  dueDate: { type: Date, required: true }
});

module.exports = mongoose.model('MemberPayment', memberPaymentSchema);
