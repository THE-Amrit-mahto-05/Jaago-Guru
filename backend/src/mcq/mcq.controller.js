const prisma = require("../config/db");

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

    const data = {
      userId: Number(authUserId),
      subject,
      topic,
      correct: Number(score.correct || 0),
      wrong: Number(score.wrong || 0),
      total: Number((score.correct || 0) + (score.wrong || 0)),
      timeSec: Number(time || 0),
      selected: selectedOptions || {},
      questions: questions || [],
    };

    const created = await prisma.mCQAttempt.create({ data });
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
    const rows = await prisma.mCQAttempt.findMany();
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
    const attempt = await prisma.mCQAttempt.findUnique({ where: { id } });
    if (!attempt || attempt.userId !== Number(authUserId)) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, attempt });
  } catch (err) {
    console.error("Attempt Details Error:", err?.message || err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { saveAttempt, listAttempts, getAttemptDetails };
