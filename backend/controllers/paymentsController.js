const MemberPayment = require('../models/MemberPayment');
const GymActivity = require('../models/GymActivity');

exports.getPayments = async (req, res) => {
  const payments = await MemberPayment.find();
  res.json(payments);
};

exports.addPayment = async (req, res) => {
  const payment = new MemberPayment(req.body);
  await payment.save();
  await new GymActivity({ action: `Payment Added for Member ${payment.memberId}`, performedBy: 'admin' }).save();
  res.json(payment);
};

exports.updatePayment = async (req, res) => {
  const payment = await MemberPayment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await new GymActivity({ action: `Payment Updated for Member ${payment.memberId}`, performedBy: 'admin' }).save();
  res.json(payment);
};

exports.deletePayment = async (req, res) => {
  const payment = await MemberPayment.findByIdAndDelete(req.params.id);
  await new GymActivity({ action: `Payment Deleted for Member ${payment.memberId}`, performedBy: 'admin' }).save();
  res.json({ message: 'Payment deleted' });
};
