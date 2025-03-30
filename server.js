const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes"); // Added resume upload route

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test API route
app.get("/", (req, res) => {
    res.send("Resume Analyzer API is running...");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");

        // Start server *only after* DB connection
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.log("❌ MongoDB connection error:", err);
    });
