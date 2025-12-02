const { GoogleGenAI } = require("@google/genai")
require("dotenv").config()

const ai = new GoogleGenAI({
  apiKey: process.env.GENAI_API_KEY
})

async function generateJSON(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ type: "text", text: prompt }]
    })

    const raw = response.text 
    return raw
  } catch (error) {
    console.error("Gemini API Error:", error)
    throw new Error("Failed to generate content from Gemini.")
  }
}

module.exports = { generateJSON }