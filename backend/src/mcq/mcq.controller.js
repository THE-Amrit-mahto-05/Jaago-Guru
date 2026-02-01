const prisma = require("../config/db");
const { generateAIResponse } = require("./mcq.gemini");

async function askAI(req, res) {
  try {
    const { subject, topic, mode } = req.body;

    if (!subject || !topic || !mode) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    let prompt = `
You are an expert interview question generator.
Generate exactly 10 ${mode.toUpperCase()} interview questions.
Subject: ${subject}
Topic: ${topic}
`;

    if (mode === "mcq") {
      prompt += `
STRICT MCQ FORMAT (follow EXACTLY):

1. Question text?
a) Option 1
b) Option 2
c) Option 3
d) Option 4
Answer: a

RULES:
- ALWAYS generate EXACTLY 10 questions.
- ALWAYS generate EXACTLY 4 options: a, b, c, d.
- DO NOT add explanations.
- DO NOT add extra text like "Sure, here are your questions".
- Leave ONE blank line between questions.
- Questions MUST be numbered 1–10 only.
`;
    } 
    else {
      prompt += `
Provide clean structured output suitable for ${mode} mode.
`;
    }

    const response = await generateAIResponse(subject, topic, prompt);

    res.json({ success: true, data: response });
  } catch (err) {
    console.error("AI Error:", err.response?.data || err);
    res.status(500).json({ success: false, message: "AI error" });
  }
}

async function getTopics(req, res) {
  try {
    const { subject } = req.body;

    if (!subject) {
      return res.status(400).json({ success: false, message: "Subject required" });
    }

    const prompt = `
List exactly 10 important interview topics for ${subject}.
Return ONLY topic names.
One topic per line.
No numbering.
`;

    const response = await generateAIResponse(subject, "topics", prompt);

    const text = response.candidates[0].content.parts[0].text;

    const topics = text
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);

    res.json({ success: true, topics });
  } catch (err) {
    console.error("AI Topic Error:", err.response?.data || err);
    res.status(500).json({ success: false, message: "AI error" });
  }
}

async function saveAttempt(req, res) {
  try {
    const authUserId = req.user?.id;
    const { subject, topic, score, time, selectedOptions, questions } = req.body;

    if (!authUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!subject || !topic || !score || typeof time !== "number") {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Empty attempt blocked" });
    }

    const created = await prisma.mCQAttempt.create({
      data: {
        userId: Number(authUserId),
        subject,
        topic,
        correct: Number(score.correct || 0),
        wrong: Number(score.wrong || 0),
        total: Array.isArray(questions) ? questions.length : 0,
        timeSec: Number(time || 0),
        selected: selectedOptions || {},
        questions: questions || [],
      }
    });

    res.json({ success: true, attemptId: created.id });
  } catch (err) {
    console.error("MCQ Attempt Save Error:", err?.message || err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function listAttempts(req, res) {
  try {
    const authUserId = req.user?.id;
    if (!authUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const rows = await prisma.mCQAttempt.findMany({
      where: { userId: Number(authUserId) },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, attempts: rows });
  } catch (err) {
    console.error("List Attempts Error:", err?.message || err);
    res.status(500).json({ success: false, message: err?.message || "Internal Server Error", code: err?.code, meta: err?.meta });
  }
}

async function getAttemptDetails(req, res) {
  try {
    const authUserId = req.user?.id;
    const id = Number(req.params.id);

    const attempt = await prisma.mCQAttempt.findFirst({
      where: {
        id,
        userId: Number(authUserId)
      }
    });

    if (!attempt || attempt.userId !== Number(authUserId)) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, attempt });
  } catch (err) {
    console.error("Attempt Details Error:", err?.message || err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { askAI, getTopics, saveAttempt, listAttempts, getAttemptDetails };