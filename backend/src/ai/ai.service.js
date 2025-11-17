const axios = require("axios");

async function generateAIResponse(subject, topic, mode) {
  const prompt = `Generate ${mode} questions for:
  Subject: ${subject}
  Topic: ${topic}
  `;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    process.env.GEMINI_API_KEY;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await axios.post(url, body);

  return response.data;
}

module.exports = { generateAIResponse };
