const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

console.log("JWT =", process.env.JWT_SECRET);
console.log("MONGO =", process.env.MONGO_URI ? "FOUND" : "NOT FOUND");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("SmartNotes Backend Running");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});