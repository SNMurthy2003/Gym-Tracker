import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    plan: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    startDate: Date,
    amount: { type: Number, default: 1000 },
    dueDate: Date,
    paymentDate: Date,
    payment: { 
      type: String, 
      enum: ["Pending", "Paid", "Overdue"], 
      default: "Pending" 
    },
    method: { type: String, default: "Cash" },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);
export default Member;
