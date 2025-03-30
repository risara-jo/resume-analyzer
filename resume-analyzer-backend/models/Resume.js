const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: String,
  originalName: String,
  fileUrl: String, // Path to the uploaded file
  uploadedAt: { type: Date, default: Date.now },
  extractedText: String, // Store parsed resume text
  skills: String          // Store extracted skills
});

module.exports = mongoose.model("Resume", ResumeSchema);
