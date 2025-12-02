import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

export default function QuizMode() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const subject = params.get("subject");
  const topic = params.get("topic");

  const [startMCQ, setStartMCQ] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
  let interval;
  if (startMCQ) {
  interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [startMCQ]);

  const fetchMCQ = async () => {
    setStartMCQ(true);
    setLoading(true);
    try {
    const res = await api.post("/ai/ask", {
    subject,
    topic,
    mode: "mcq",
    });

  if (res.data.success) {
  const rawText = res.data.data.candidates[0].content.parts[0].text;

  const qArr = rawText
  .split(/\n(?=\d+[\.\)])/)
  .map((qBlock) => {
  const lines = qBlock.split("\n").filter(Boolean);

  const questionText = lines[0].replace(/^\d+[\.\)]\s*/, "");

  const options = lines
  .filter((line) => /^[abcd][\.\)]\s/.test(line))
  .map((opt) => ({
  label: opt[0].toLowerCase(),
  text: opt.slice(2).trim(),}));

  const answerLine = lines.find((line) => /^Answer:/i.test(line));
  const answer = answerLine? answerLine.replace(/Answer:/i, "").trim()[0].toLowerCase(): "";

  const explanationLine = lines.find((line) =>
  /^Explanation:/i.test(line));
  const explanation = explanationLine? explanationLine.replace(/Explanation:/i, "").trim(): "";
  return { question: questionText, options, answer, explanation }});
  setQuestions(qArr)}
  } catch (err) {
  console.error("Error loading MCQ:", err)}
    setLoading(false);
  };

  const handleOptionClick = (qIndex, selectedLabel) => {
    if (selectedOptions[qIndex]) return;
    setSelectedOptions({ ...selectedOptions, [qIndex]: selectedLabel });
  };

  const calculateScore = () => {
    let correct = 0;
    let wrong = 0;
    questions.forEach((q, idx) => {
      if (!selectedOptions[idx]) return;
      if (selectedOptions[idx] === q.answer) correct++;
      else wrong++;
    });
    return { correct, wrong };
  };

  const endQuiz = () => {
    const scoreData = calculateScore();

    navigate("/results", {
      state: {
        questions,
        selectedOptions,
        score: scoreData,
        time: seconds,
      },
    });
    setStartMCQ(false);
    setQuestions([]);
    setSelectedOptions({});
    setSeconds(0);
    setCurrentIndex(0);
  };

  const currentQuestion = questions[currentIndex];

  return (
  <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
  <div className="w-full max-w-3xl mb-6 sticky top-0 bg-white shadow p-4 rounded-xl flex justify-between items-center">
  <h1 className="text-xl font-bold">{topic} – MCQ Mode</h1>
{startMCQ ? (
<button onClick={endQuiz}
className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"> End</button>
) : (<button onClick={fetchMCQ}
className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Start</button>)}
</div>{startMCQ && (
<div className="mb-4 text-lg font-semibold"> Time: {Math.floor(seconds / 60)}:
{(seconds % 60).toString().padStart(2, "0")}</div>)}
{startMCQ && (<>{loading ? (
<div className="min-h-[300px] flex items-center justify-center">
<div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
</div>) : (currentQuestion && (
<div className="w-full max-w-3xl p-4 bg-white rounded-xl shadow">
<p className="font-medium mb-4">{currentIndex + 1}. {currentQuestion.question}</p>

{currentQuestion.options?.map((opt) => {
const isSelected = selectedOptions[currentIndex] === opt.label;
const isCorrect =selectedOptions[currentIndex] && opt.label === currentQuestion.answer;
const isWrong =selectedOptions[currentIndex] && isSelected && opt.label !== currentQuestion.answer;

return (

<button key={opt.label}
onClick={() => handleOptionClick(currentIndex, opt.label)}
disabled={!!selectedOptions[currentIndex]}
className={`block w-full text-left px-4 py-2 mb-2 rounded-lg border transition
${isCorrect ? "bg-green-200 border-green-500" : ""}
${isWrong ? "bg-red-200 border-red-500" : ""}
${!selectedOptions[currentIndex] ? "hover:bg-blue-100" : ""}`}>
{opt.label}) {opt.text}</button>

)})}

{selectedOptions[currentIndex] && ( <><p className="mt-3 text-sm text-gray-800">
<strong>Correct Answer:</strong>{" "}{currentQuestion.answer}){" "}{
currentQuestion.options.find((o) => o.label === currentQuestion.answer)?.text }
</p>{currentQuestion.explanation && (
<div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">

<strong>Explanation:</strong> {currentQuestion.explanation}
</div>)}</>)}
<div className="flex justify-between mt-6">

<button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)}
className={`px-4 py-2 rounded-lg border ${currentIndex === 0 ? "opacity-40" : "hover:bg-gray-200"}`} > ⬅ Prev</button>

<button disabled={currentIndex === questions.length - 1} onClick={() => setCurrentIndex(currentIndex + 1)}
className={`px-4 py-2 rounded-lg border ${currentIndex === questions.length - 1 ? "opacity-40" : "hover:bg-gray-200"}`}>
 Next ➡ </button></div>
{currentIndex === questions.length - 1 &&selectedOptions[currentIndex] && (
<button onClick={endQuiz}
className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full"> Finish Quiz
</button>)}
</div>
))}</>)}
</div>
  );
}
