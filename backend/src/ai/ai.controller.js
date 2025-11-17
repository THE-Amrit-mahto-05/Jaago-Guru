const { generateAIResponse } = require("./ai.service");

async function askAI(req, res) {
  try {
    const { subject, topic, mode } = req.body;

    if (!subject || !topic || !mode) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const response = await generateAIResponse(subject, topic, mode);

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

module.exports = { askAI };
