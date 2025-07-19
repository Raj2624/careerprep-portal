// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// ───── Route imports ─────
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");
const roadmapRoutes = require("./routes/roadmap");

const app = express();
const PORT = process.env.PORT || 5000;

// ───── Middleware ─────
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
  })
);

app.use(express.json());

// ───── Mount routes ─────
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/roadmap", roadmapRoutes);

// ───── Health‑check route ─────
app.get("/", (_req, res) => {
  res.send("CareerPrep API is running 🚀");
});

// ───── MongoDB connection & server start ─────
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
