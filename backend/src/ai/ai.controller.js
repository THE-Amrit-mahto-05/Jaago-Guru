import { generateResponse } from "./ai.service.js";

export const askAI = async (req, res) => {
  try {
    const { subject, topic, mode } = req.body;  
    const reply = await generateResponse(subject, topic, mode);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
