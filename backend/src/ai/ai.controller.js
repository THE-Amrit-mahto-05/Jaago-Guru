const { generateAIResponse } = require("./ai.service");

async function askAI(req, res) {
  try {
    const { subject, topic, mode } = req.body;

    if (!subject || !topic || !mode) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    let prompt = `
      Generate ${mode} interview questions.
      Subject: ${subject}
      Topic: ${topic}
    `;

    if (mode === "mcq") {
  prompt += `
    Format strictly like this for MCQs:

    1. Question text
    a) Option 1
    b) Option 2
    c) Option 3
    d) Option 4
    Answer: <letter of correct option>

    Important:
    - Always provide 4 options per question.
    - No extra text, explanation, or numbering errors.
    - Separate each question with a blank line.
  `;
}
 else {
      prompt += `Provide clean structured output suitable for ${mode} mode.`;
    }

    const response = await generateAIResponse(subject, topic, prompt);

    res.json({ success: true, data: response });
  } catch (err) {
    console.error("AI Error:", err.response?.data || err);
    res.status(500).json({ success: false, message: err.response?.data || "AI error" });
  }
}

async function getTopics(req, res) {
  try {
    const { subject } = req.body;

    if (!subject) {
      return res.status(400).json({ success: false, message: "Subject required" });
    }

    const prompt = `
      List the top 10 most important interview topics for the subject: ${subject}.
      Return ONLY topic names, one per line, no numbering if possible.
    `;

    const response = await generateAIResponse(subject, "topics", prompt);

    const text = response.candidates[0].content.parts[0].text;

    const topics = text
      .split("\n")
      .map((t) => t.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    res.json({ success: true, topics });
  } catch (err) {
    console.error("AI Topic Error:", err.response?.data || err);
    res.status(500).json({ success: false, message: err.response?.data || "AI error" });
  }
}

module.exports = { askAI, getTopics };
