const dotenv = require("dotenv");
dotenv.config(); // Must be first — loads .env before anything else reads process.env

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Health-check route
app.get("/", (req, res) => {
  res.json({ message: "SmartNotes Backend Running ✅" });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(
    `🔑 JWT_SECRET: ${process.env.JWT_SECRET ? "Loaded" : "⚠️  MISSING!"}`
  );
  console.log(
    `🗄️  MONGO_URI: ${process.env.MONGO_URI ? "Loaded" : "⚠️  MISSING!"}`
  );
});