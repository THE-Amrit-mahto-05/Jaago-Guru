const axios = require("axios");

async function generateAIResponse(subject, topic, mode) {
  const prompt = `
Generate ${mode} questions for:
Subject: ${subject}
Topic: ${topic}
`;

  const result = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=" + process.env.GEMINI_API_KEY,
    {
      prompt: { text: prompt }
    }
  );

  return result.data;
}

module.exports = { generateAIResponse };
