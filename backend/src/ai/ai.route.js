const express = require("express");
const { askAI } = require("./ai.controller");

const router = express.Router();

router.post("/ask", askAI);

module.exports = router;
