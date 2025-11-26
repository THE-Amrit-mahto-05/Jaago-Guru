const axios = require("axios");

async function generateAIResponse(subject, topic, prompt) {
  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" +
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
