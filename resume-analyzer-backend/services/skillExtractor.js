const axios = require("axios");
require("dotenv").config();

async function extractSkillsFromText(text) {
  try {
    const prompt = `Extract a clean list of relevant technical and soft skills from this resume:\n\n${text}\n\nSkills:`;

    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt,
        max_tokens: 100,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.generations[0].text.trim();
  } catch (error) {
    console.error("❌ Error extracting skills from Cohere:", error.message);
    return null;
  }
}

module.exports = { extractSkillsFromText };
