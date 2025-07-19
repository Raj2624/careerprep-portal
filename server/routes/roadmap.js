const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Dummy roadmap generator
router.get("/", authMiddleware, (req, res) => {
  const skills = req.user.skills || [];
  const roadmap = [];

  if (skills.includes("React")) roadmap.push("Learn Redux");
  if (skills.includes("Node.js")) roadmap.push("Learn NestJS");
  if (skills.includes("HTML")) roadmap.push("Master Accessibility");

  roadmap.push("Explore DevOps basics");

  res.json({ roadmap });
});

module.exports = router;
