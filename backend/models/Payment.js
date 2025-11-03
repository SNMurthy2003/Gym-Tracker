const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  amount: Number,
  dueDate: Date,
  paymentDate: Date,
  status: { type: String, enum: ["paid", "pending", "overdue"], default: "pending" },
  method: { type: String, enum: ["cash", "card", "upi"], default: "cash" }
});

module.exports = mongoose.model("Payment", paymentSchema);
