const express = require("express");
const { askAI, getTopics } = require("./ai.controller");

const router = express.Router();

router.post("/ask", askAI);
router.post("/topics", getTopics);

module.exports = router;
