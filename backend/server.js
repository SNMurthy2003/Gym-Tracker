// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import twilio from "twilio";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ----------------- Twilio WhatsApp Setup ----------------- */
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

/* ----------------- Send WhatsApp Message ----------------- */
async function sendWhatsAppMessage(phone, message) {
  try {
    const response = await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+91${phone}`,
      body: message,
    });
    console.log(`📩 WhatsApp message sent to ${phone}: ${response.sid}`);
  } catch (err) {
    console.error("❌ Twilio WhatsApp error:", err.message);
  }
}

/* ----------------- MongoDB Connect ----------------- */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ----------------- Member Schema + Model ----------------- */
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
      default: "Pending",
    },
    method: { type: String, default: "Cash" },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);

/* ----------------- Utility: mark overdue members ----------------- */
async function markOverdueMembers() {
  try {
    const now = new Date();
    const res = await Member.updateMany(
      { dueDate: { $exists: true, $lt: now }, payment: { $ne: "Paid" } },
      { $set: { payment: "Overdue" } }
    );
    if (res.modifiedCount > 0) {
      console.log(`🔔 Marked ${res.modifiedCount} member(s) as Overdue`);
    }
  } catch (err) {
    console.error("Error marking overdue members:", err);
  }
}

/* ----------------- Auto Reminder (CRON JOB) ----------------- */
cron.schedule("0 9 * * *", async () => {
  try {
    const overdueMembers = await Member.find({ payment: "Overdue" });

    for (const m of overdueMembers) {
      await sendWhatsAppMessage(
        m.phone,
        `Hello ${m.name}, 👋\n\nThis is an automatic reminder from *GymTrack* 🏋️‍♂️\n\nYour gym membership payment of ₹${m.amount} is *Overdue*.\n\nPlease clear your dues soon to continue enjoying gym facilities.\n\nFor help, contact us at ${process.env.GYM_CONTACT}.`
      );
    }

    if (overdueMembers.length > 0) {
      console.log(`📲 Sent overdue reminders to ${overdueMembers.length} member(s)`);
    } else {
      console.log("✅ No overdue members to remind today");
    }
  } catch (err) {
    console.error("❌ Error in WhatsApp auto reminder cron job:", err);
  }
});

/* ----------------- API Routes ----------------- */

// Get all members
app.get("/api/members", async (req, res) => {
  try {
    await markOverdueMembers();
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Add new member
app.post("/api/members", async (req, res) => {
  try {
    const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();

    let dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
    if (!dueDate) {
      dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + 30);
    }

    const newMember = new Member({
      ...req.body,
      startDate,
      dueDate,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update payment status (fixed)
app.put("/api/members/:id/payment", async (req, res) => {
  try {
    let { payment } = req.body;
    console.log("Incoming payment update:", req.params.id, req.body);

    // Normalize case
    if (payment) payment = payment.charAt(0).toUpperCase() + payment.slice(1).toLowerCase();

    if (!["Pending", "Paid", "Overdue"].includes(payment)) {
      return res.status(400).json({ error: `Invalid payment status: ${payment}` });
    }

    const updateData = { payment };

    if (payment === "Paid") {
      updateData.paymentDate = new Date();
    } else {
      updateData.paymentDate = null;
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!member) return res.status(404).json({ error: "Member not found" });

    res.json(member);
  } catch (err) {
    console.error("Payment update error:", err);
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

// ✅ Update member details
app.put("/api/members/:id", async (req, res) => {
  try {
    const { name, phone, email, plan, startDate, dueDate, status, amount, payment, method } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (plan) updateData.plan = plan;
    if (startDate) updateData.startDate = startDate;
    if (dueDate) updateData.dueDate = dueDate;
    if (status) updateData.status = status;
    if (amount !== undefined) updateData.amount = amount;
    if (payment) updateData.payment = payment;
    if (method) updateData.method = method;

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    console.log(`✅ Member updated: ${member.name} (${member._id})`);
    res.json(member);
  } catch (err) {
    console.error("Member update error:", err);
    res.status(500).json({ error: "Failed to update member" });
  }
});

// ✅ Delete member
app.delete("/api/members/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    console.log(`✅ Member deleted: ${member.name} (${member._id})`);
    res.json({ message: "Member deleted successfully", deletedMember: member });
  } catch (err) {
    console.error("Member delete error:", err);
    res.status(500).json({ error: "Failed to delete member" });
  }
});

// ✅ Manual WhatsApp Reminder
app.post("/api/members/:id/remind", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    if (member.payment === "Paid")
      return res.status(400).json({ error: "Already paid" });

    const reminderMsg = `
Hello ${member.name}, 👋

This is a reminder from *GymTrack* 🏋️‍♂️

Your membership payment of ₹${member.amount} is currently *${member.payment}*.
Your due date was: ${member.dueDate ? member.dueDate.toDateString() : "N/A"}.

👉 Please clear your dues to continue enjoying gym facilities.

For any help, contact us at ${process.env.GYM_CONTACT}.
`;

    await sendWhatsAppMessage(member.phone, reminderMsg);

    res.json({ message: "Reminder sent successfully!" });
  } catch (err) {
    console.error("WhatsApp reminder error:", err);
    res.status(500).json({ error: "Failed to send reminder" });
  }
});

/* ----------------- Start server ----------------- */
const PORT = process.env.PORT || 5000;

// For Vercel serverless functions
if (process.env.VERCEL) {
  // Don't call app.listen() on Vercel
  markOverdueMembers();
} else {
  // For local development
  app.listen(PORT, async () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
    await markOverdueMembers();
  });
}

// Export for Vercel
export default app;
