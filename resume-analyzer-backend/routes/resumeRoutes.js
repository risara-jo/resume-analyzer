const express = require("express");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const mongoose = require("mongoose");
const Resume = require("../models/Resume");
const { extractSkillsFromText } = require("../services/skillExtractor"); // <-- NEW

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload and Parse Resume Route
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    const filePath = path.resolve(__dirname, "..", "uploads", req.file.filename);
    console.log("📄 Sending file to Flask for parsing:", filePath);

    // Step 1: Send to Flask to extract text
    const response = await axios.post("http://localhost:5002/parse-resume", {
      file_path: filePath
    });

    const extractedText = response.data.extracted_text || "No text extracted";

    // Step 2: Send text to Cohere to extract skills
    const skills = await extractSkillsFromText(extractedText);

    // Step 3: Save everything to DB
    const resume = new Resume({
      user: userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      extractedText,
      skills
    });

    await resume.save();

    res.status(201).json({ message: "Resume uploaded and parsed successfully", resume });
  } catch (error) {
    console.error("❌ Resume upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
