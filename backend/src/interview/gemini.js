const { GoogleGenAI } = require("@google/genai")
require("dotenv").config()

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function generateJSON(prompt, retries = 3) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ type: "text", text: prompt }]
    })

    const text = response?.text

    if (!text || typeof text !== "string") {
      throw new Error("Empty or invalid Gemini response");
    }

    return text
  }
  catch (error) {
    const status = error?.status || error?.error?.code

    if (status === 503 && retries > 0) {
      console.warn(`Gemini overloaded. Retrying... (${retries})`)
      await sleep((4 - retries) * 1500)
      return generateJSON(prompt, retries - 1)
    }

    console.error("Gemini API Error:", error)
    throw error
  }
}

module.exports = { generateJSON }