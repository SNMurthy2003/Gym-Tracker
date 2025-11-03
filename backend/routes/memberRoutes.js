const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// ➕ Add Member
router.post("/", async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get All Members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👤 Get Recently Active Members (last 7 days)
router.get("/recent", async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const members = await Member.find({ lastActive: { $gte: since } }).sort({
      lastActive: -1,
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Member (general update)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Member not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 💰 Update ONLY Payment Status
router.put("/:id/payment", async (req, res) => {
  try {
    const { payment } = req.body;
    if (!payment) return res.status(400).json({ error: "Payment status is required" });

    const updated = await Member.findByIdAndUpdate(
      req.params.id,
      { payment },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Member not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ Delete Member
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Member not found" });
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
