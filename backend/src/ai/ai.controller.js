const { generateAIResponse } = require("./ai.service");
async function askAI(req, res) {
  try {
    const { subject, topic, mode } = req.body;

    if (!subject || !topic || !mode) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const prompt = `
      Generate ${mode} interview questions.
      Subject: ${subject}
      Topic: ${topic}

      Provide clean structured output.
    `;

    const response = await generateAIResponse(subject, topic, prompt);

    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    console.error("AI Error:", err.response?.data || err);
    res.status(500).json({
      success: false,
      message: err.response?.data || "AI error"
    });
  }
}

async function getTopics(req, res) {
  try {
    const { subject } = req.body;

    if (!subject) {
      return res
        .status(400)
        .json({ success: false, message: "Subject required" });
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
    res.status(500).json({
      success: false,
      message: err.response?.data || "AI error"
    });
  }
}

module.exports = { askAI, getTopics };
