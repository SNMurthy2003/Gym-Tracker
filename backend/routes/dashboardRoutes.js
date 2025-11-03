const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Payment = require("../models/Payment");

router.get("/", async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();

    const totalRevenue = 10000; // fixed default

    const pendingPayments = await Payment.countDocuments({ status: "pending" });

    const overduePayments = await Payment.countDocuments({ status: "overdue" });

    res.json({
      totalMembers,
      totalRevenue,
      pendingPayments,
      overduePayments
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
