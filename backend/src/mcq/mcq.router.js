const express = require("express");
const { askAI, getTopics, saveAttempt, listAttempts, getAttemptDetails } = require("./mcq.controller");
const { verifyToken } = require("../auth/auth.middleware");
const router = express.Router();

router.post("/ask", askAI);
router.post("/topics", getTopics);
router.post("/attempt", verifyToken, saveAttempt);
router.get("/attempts", verifyToken, listAttempts);
router.get("/attempt/:id", verifyToken, getAttemptDetails);

module.exports = router;
