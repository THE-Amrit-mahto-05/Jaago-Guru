import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI = process.env.GEMINI_API_KEY;

export async function generateResponse(subject, topic, mode) {
  let prompt = "";

  if (mode === "mcq") {
    prompt = `
      Generate 10 MCQ questions for the subject ${subject}
      and topic ${topic}. Include 4 options and correct answer.
    `;
  }

  if (mode === "subjective") {
    prompt = `
      Generate 10 interview subjective questions for ${subject}
      topic ${topic}. Add short model answers also.
    `;
  }

  if (mode === "session") {
    prompt = `
      Act like a real HR/Tech interviewer.
      Subject: ${subject}
      Topic: ${topic}
      Conduct a 1-hour session.
      Ask a question, wait for user response, evaluate answer,
      then ask the next question. Start with Question 1 only.
    `;
  }

  const apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
    GEMINI;

  const response = await axios.post(apiUrl, {
    contents: [{ parts: [{ text: prompt }] }],
  });

  return response.data.candidates[0].content.parts[0].text;
}
