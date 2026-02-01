const { GoogleGenAI } = require("@google/genai")
require("dotenv").config()

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function generateAIResponse(subject, topic, prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    })

    const text = response.text?.trim() || ""
    return {
      candidates: [
        {
          content: {
            parts: [
              { text }
            ]
          }
        }
      ]
    }

  } catch (error) {
    console.error("Gemini SDK Error:", error.message)
    return {
      candidates: [
        {
          content: {
            parts: [{ text: "" }]
          }
        }
      ]
    }
  }
}

module.exports = { generateAIResponse }