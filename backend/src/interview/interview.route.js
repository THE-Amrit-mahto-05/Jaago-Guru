const express = require("express")
const router = express.Router()
const {startInterview, getNextQuestion, submitAnswer} = require("./interview.controller")
const { verifyToken } = require("../auth/auth.middleware")

router.post("/start", verifyToken, startInterview)
router.get("/:id/question", verifyToken, getNextQuestion)
router.post("/:id/answer", verifyToken, submitAnswer)

module.exports = router