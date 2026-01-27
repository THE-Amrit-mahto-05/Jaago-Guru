const {createInterviewSession, fetchNextQuestion, saveUserAnswerAndEvaluate, getInterviewAnalytics, getAIInterviewHistory} = require("./interview.service")
const prisma = require("../config/db")

const startInterview = async (req, res) => {
  try {
    const userId = req.user.id
    const { role, experience, questionCount } = req.body

    const { interviewId, firstQuestion } = await createInterviewSession({
      userId,
      role,
      experience,
      questionCount
    })

    res.json({
      success: true,
      interviewId,
      question: firstQuestion
    })
  } catch (err) {
    console.error("Error startInterview:", err)
    const status = err?.status || 503
    res.status(status).json({
      success: false,
      message:
        status === 503
          ? "AI is busy right now. Please try again in a moment."
          : "Failed to start interview"
    })
  }
}

async function checkOwnership(interviewId, userId) {
  const interview = await prisma.interview.findUnique({
    where: { id: Number(interviewId) },
    select: { id: true, userId: true }
  })
  if (!interview) throw { status: 404, message: "Interview not found" };
  if (interview.userId !== Number(userId)) throw { status: 403, message: "Access denied" };
  return true
}

const getNextQuestion = async (req, res) => {
  try {
    const interviewId = Number(req.params.id)
    await checkOwnership(interviewId, req.user.id)

    const result = await fetchNextQuestion(interviewId)
    res.json(result)
  } catch (err) {
    console.error("Error getNextQuestion:", err)
    res.status(500).json({ success: false, message: "Failed to fetch next question" })
  }
}

const submitAnswer = async (req, res) => {
  try {
    const interviewId = Number(req.params.id)
    await checkOwnership(interviewId, req.user.id)
    const questionId = Number(req.body.questionId)
    const { answerText } = req.body

    const result = await saveUserAnswerAndEvaluate({
      interviewId,
      questionId,
      answerText
    })

    res.json(result)
  } catch (err) {
    console.error("Error submitAnswer:", err)
    res.status(500).json({ success: false, message: "Failed to submit answer" })
  }
}

const getAIHistory = async (req, res) => {
  try {
    const data = await getAIInterviewHistory(req.user.id);
    res.json({ success: true, data })
  } catch (err) {
    console.error("Error fetching AI history:", err)
    res.status(500).json({ success: false })
  }
}

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id
    const analytics = await getInterviewAnalytics(userId)

    res.json({
      success: true,
      data: analytics
    })
  } catch (err) {
    console.error("Error getInterviewAnalytics:", err)
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview analytics"
    })
  }
}

module.exports = {startInterview, getNextQuestion, submitAnswer, getAnalytics, getAIHistory}