const prisma = require("../config/db")
const { generateJSON } = require("./gemini")

async function generateQuestions(role, experience, questionCount) {
  const prompt = `
      You are a senior technical interviewer with 10+ years of experience.

      Your task:
      Generate EXACTLY ${questionCount} high-quality interview questions 
      for a candidate applying for the role "${role}" experience level "${experience}".

      Requirements for questions:
      - Questions must be strictly technical and role-specific
      - real interview-style questions
      - not generic or vague
      - avoid trivial "what is X?" unless difficulty = easy
      - NO codeblocks
      - NO numbering
      - NO markdown
      - NO explanations

      Your output MUST be ONLY a valid JSON array of strings.
      Example:
      ["What is a closure in JS?", "Explain virtual DOM in React"]

      DO NOT return anything else.
    `

  let raw = await generateJSON(prompt)

  raw = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim()

  let questions
  try {
    questions = JSON.parse(raw)
  } catch {
    questions = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
  }

  return questions.slice(0, questionCount)
}

const createInterviewSession = async ({ userId, role, experience, questionCount }) => {
  const questionsArray = await generateQuestions(role, experience, questionCount)

  const interview = await prisma.interview.create({
    data: {
      userId: Number(userId),
      role,
      experience,
      totalQ: questionCount
    }
  })

  const created = await Promise.all(
    questionsArray.map((qText, idx) =>
      prisma.interviewQuestion.create({
        data: {
          interviewId: interview.id,
          index: idx + 1,
          text: qText
        }
      })
    )
  )

  return {
    interviewId: interview.id,
    firstQuestion: {
      questionId: created[0].id,
      text: created[0].text,
      role: interview.role,
      index: 1,
      total: questionCount
    }
  }
}

const fetchNextQuestion = async (interviewId) => {
  const next = await prisma.interviewQuestion.findFirst({
    where: {
      interviewId: Number(interviewId),
      userAnswer: null
    },
    orderBy: { index: "asc" },
    include: {
      interview: true
    }
  })

  if (!next) {
    const summary = await prisma.interviewQuestion.findMany({
      where: { interviewId: Number(interviewId) },
      orderBy: { index: "asc" }
    })

    return { finished: true, summary }
  }

  return {
    finished: false,
    questionId: next.id,
    text: next.text,
    role: next.interview.role,
    index: next.index,
    total: next.interview.totalQ
  }
}

const saveUserAnswerAndEvaluate = async ({ interviewId, questionId, answerText }) => {
  const q = await prisma.interviewQuestion.findUnique({
    where: { id: Number(questionId) }
  })

  const evalPrompt = `
        You are a senior technical interviewer evaluating a candidate in a REAL interview setting.

        This is a mock interview where the candidate's spoken answer was converted to text using speech-to-text.
        Because of this:
        - The text may contain grammatical mistakes, missing words, or awkward phrasing.
        - DO NOT penalize grammar, English fluency, sentence structure, or transcription errors.
        - Focus ONLY on technical understanding, reasoning, and correctness.

        Your goal is to assess understanding fairly and encourage learning.
        Do NOT be overly strict. Reward partial correctness and correct reasoning direction.

        Scoring philosophy (IMPORTANT):
        - 9–10: Excellent answer, correct and well-explained.
        - 7–8: Mostly correct, minor gaps or missing details.
        - 5–6: Partially correct, shows understanding of the core idea.
        - 3–4: Limited understanding, but some relevant points.
        - 0–2: Mostly incorrect or irrelevant answer.

        Evaluation rules:
        - If the candidate demonstrates the correct core concept, score MUST be at least 5.
        - Missing examples, imperfect explanation, or language issues should NOT reduce the score below 6 if the core idea is correct.
        - Be lenient when the answer is conceptually right but not perfectly articulated.
        - Only give very low scores (0–2) for clearly wrong or off-topic answers.

        Context:
        Question: ${q.text}
        Candidate answer: ${answerText}

        Return EXACTLY a single valid JSON object (no surrounding text, no markdown, no code fences) with these fields:
        {
          "score": <integer between 0 and 10>,
          "strengths": "<one concise paragraph describing what the candidate did well>",
          "weaknesses": "<one concise paragraph describing what could be improved>",
          "advice": "<one concise paragraph giving constructive guidance>"
        }

        Strict output rules:
        - DO NOT use bullet points or lists.
        - DO NOT return arrays.
        - DO NOT add any extra fields.
        - DO NOT include markdown or formatting.
        - ONLY return the JSON object.
        - Keep strengths, weaknesses, and advice concise, clear, and supportive.
        `;

  let raw = await generateJSON(evalPrompt)

  raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim()

  let evaluation
  try {
    evaluation = JSON.parse(raw)
  } catch (err) {
    console.error("JSON parse failed. Raw:", raw)
    evaluation = {
      score: 5,
      strengths: "Basic and partially correct answer.",
      weaknesses: "Missing details or depth.",
      advice: "Provide more structured, detailed explanations."
    }
  }

  await prisma.interviewQuestion.update({
    where: { id: Number(questionId) },
    data: {
      userAnswer: answerText,
      score: evaluation.score,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      advice: evaluation.advice
    }
  })

  const next = await prisma.interviewQuestion.findFirst({
    where: { interviewId: Number(interviewId), userAnswer: null },
    orderBy: { index: "asc" },
    include: { interview: true }
  })

  if (!next) {
    const summary = await prisma.interviewQuestion.findMany({
      where: { interviewId: Number(interviewId) },
      orderBy: { index: "asc" }
    })

    await prisma.interview.update({
      where: { id: Number(interviewId) },
      data: { endedAt: new Date() }
    });

    return {
      finished: true,
      summary,
      evaluation
    }
  }

  return {
    finished: false,
    nextQuestion: {
      questionId: next.id,
      text: next.text,
      index: next.index,
      total: next.interview.totalQ
    },
    evaluation
  }
}

async function getAIInterviewHistory(userId) {
  const interviews = await prisma.interview.findMany({
    where: {
      userId: Number(userId)
    },
    include: {
      questions: {
        select: { score: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return interviews.map(i => {
    const scores = i.questions.map(q => q.score).filter(s => s !== null);
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0

    const isCompleted = !!i.endedAt

    return {
      id: i.id,
      role: i.role,
      totalQ: i.totalQ,
      createdAt: i.createdAt,
      avgScore,
      status: isCompleted ? "completed" : "in-progress"
    }
  })
}

async function getInterviewAnalytics(userId) {
  const interviews = await prisma.interview.findMany({
    where: {
      userId: Number(userId),
      endedAt: { not: null }
    },
    include: {
      questions: {
        select: { score: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const totalInterviews = interviews.length

  // ---- Success Score (Average per Interview) ----
  const interviewAverages = interviews
    .map(i => {
      const scores = i.questions.map(q => q.score).filter(s => s !== null)
      if (scores.length === 0) return null

      return scores.reduce((a, b) => a + b, 0) / scores.length
    })
    .filter(avg => avg !== null)

  let successScore = 0

  if (interviewAverages.length > 0) {
    const avgInterviewScore =
      interviewAverages.reduce((a, b) => a + b, 0) /
      interviewAverages.length
    successScore = Math.round(avgInterviewScore * 10)
  }

  // ---- Current Streak ----
  function getLocalDateString(date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d.toLocaleDateString('en-CA')
  }

  const interviewDays = new Set(interviews.map(i => getLocalDateString(i.endedAt)))

  let currentStreak = 0
  let cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  while (true) {
    const day = getLocalDateString(cursor)
    if (interviewDays.has(day)) {
      currentStreak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  // ---- Recent Attempts (last 3) ----
  const recentAttempts = interviews.slice(0, 3).map(i => {
    const scores = i.questions.map(q => q.score).filter(s => s !== null)
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0

    return {
      id: i.id,
      title: i.role,
      score: avgScore,
      type: "Technical",
      createdAt: i.createdAt
    }
  })

  return {
    totalInterviews,
    successScore,
    currentStreak,
    recentAttempts
  }
}

module.exports = {createInterviewSession, fetchNextQuestion, saveUserAnswerAndEvaluate, getInterviewAnalytics, getAIInterviewHistory}