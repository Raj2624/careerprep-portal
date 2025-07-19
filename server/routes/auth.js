const express = require("express");
const { body } = require("express-validator");
const authCtrl = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router(); // ✅ define router first

// GET /api/auth/me
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  authCtrl.register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").exists(),
  ],
  authCtrl.login
);

module.exports = router;
