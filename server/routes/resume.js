const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", auth, upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    let text = "";

    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      text = result.value;
    } else {
      return res.status(400).json({ msg: "Unsupported file type" });
    }

    // Extract skills
    const skillKeywords = ["react", "node", "express", "mongo", "python", "java"];
    const foundSkills = skillKeywords.filter((skill) =>
      text.toLowerCase().includes(skill)
    );

    // Optional: Update user in DB
    await User.findByIdAndUpdate(req.user._id, { skills: foundSkills });

    // Clean up
    fs.unlinkSync(file.path);

    res.json({ msg: "Resume processed successfully", skills: foundSkills });
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ msg: "Failed to process resume" });
  }
});

module.exports = router;
