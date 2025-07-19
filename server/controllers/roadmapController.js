const User = require("../models/User");
const roadmaps = require("../data/roadmapData");

const getRoadmap = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user || !user.roleTarget) {
    return res.status(400).json({ error: "Target role not set." });
  }

  const role = user.roleTarget;
  const roleRoadmap = roadmaps[role];

  if (!roleRoadmap) {
    return res.status(404).json({ error: "No roadmap found for this role." });
  }

  const completed = user.skills || [];
  const pending = roleRoadmap.filter(skill => !completed.includes(skill));

  res.json({
    role,
    completedSkills: completed,
    pendingSkills: pending,
  });
};

module.exports = { getRoadmap };
