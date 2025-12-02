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
    index: next.index,
    total: next.interview.totalQ
  }
}

const saveUserAnswerAndEvaluate = async ({ interviewId, questionId, answerText }) => {
  const q = await prisma.interviewQuestion.findUnique({
    where: { id: Number(questionId) }
  })

  const evalPrompt = `
        You are a senior technical interviewer and a strict, careful grader.

        Provide a detailed evaluation of the candidate's answer.

        Context:
        Question: ${q.text}
        Candidate answer: ${answerText}

        Return EXACTLY a single JSON object (no surrounding text, no commentary, no markdown, no code fences) with these fields:
        {
          "score": <integer between 0 and 10>,
          "strengths": "<one paragraph string>",
          "weaknesses": "<one paragraph string>",
          "advice": "<one paragraph string>"
        }

        Rules:
        - DO NOT return bullet points.
        - DO NOT return an array.
        - DO NOT return lists.
        - "advice" MUST be a single string.
        - ONLY return JSON.
        - Score must be an integer between 0 and 10.
        - Do not return any extra fields.
        - Do not include code blocks or markdown.
        - Keep strengths, weaknesses, and advice concise but specific.
      `

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

module.exports = {createInterviewSession, fetchNextQuestion, saveUserAnswerAndEvaluate}