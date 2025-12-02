const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function saveMultipleMCQs(req, res) {
  try {
    const { userId, subject, topic, questions } = req.body;

    if (!userId || !subject || !topic || !questions || !questions.length) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const mcqData = questions.map((q) => ({
      userId,
      subject,
      topic,
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation || "",
    }));

    await prisma.mCQ.createMany({
      data: mcqData,
    });

    res.json({ success: true, message: "MCQs saved successfully" });
  } catch (err) {
    console.error("MCQ Save Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { saveMultipleMCQs };
