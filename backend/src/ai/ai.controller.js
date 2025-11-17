const { generateAIResponse } = require("./ai.service");
async function askAI(req, res) {
  try {
    const { subject, topic, mode } = req.body;
    const response = await generateAIResponse(subject, topic, mode);
    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "AI error" });
  }
}
module.exports = { askAI };
