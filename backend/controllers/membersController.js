const Member = require('../models/Member');
const GymActivity = require('../models/GymActivity');

exports.getMembers = async (req, res) => {
  const members = await Member.find();
  res.json(members);
};

exports.addMember = async (req, res) => {
  const member = new Member(req.body);
  await member.save();

  await new GymActivity({ action: `Member Added: ${member.name}`, performedBy: 'admin' }).save();
  res.json(member);
};

exports.updateMember = async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await new GymActivity({ action: `Member Updated: ${member.name}`, performedBy: 'admin' }).save();
  res.json(member);
};

exports.deleteMember = async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id);
  await new GymActivity({ action: `Member Deleted: ${member.name}`, performedBy: 'admin' }).save();
  res.json({ message: 'Member deleted' });
};
