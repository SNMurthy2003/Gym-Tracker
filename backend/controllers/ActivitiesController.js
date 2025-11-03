const GymActivity = require('../models/GymActivity');

exports.getActivities = async (req, res) => {
  const activities = await GymActivity.find().sort({ timestamp: -1 });
  res.json(activities);
};
