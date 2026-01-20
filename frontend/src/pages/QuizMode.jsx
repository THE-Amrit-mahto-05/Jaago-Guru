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

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

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
      const res = await api.post("/mcq/ask", { subject, topic, mode: "mcq" });
      if (res.data.success) {
        const rawText = res?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText || typeof rawText !== "string") {
          throw new Error("Invalid MCQ response from AI");
        }
        const qArr = rawText
          .split(/\n(?=\d+[\.\)])/)
          .map((qBlock) => {
            const lines = qBlock.split("\n").filter(Boolean);
            const questionText = (lines[0] || "").replace(/^\d+[\.\)]\s*/, "");
            const options = lines
              .filter((line) => /^[abcd][\.\)]\s/.test(line))
              .map((opt) => ({
                label: opt[0].toLowerCase(),
                text: opt.slice(2).trim(),
              }));

            const answerLine = lines.find((line) =>
              /^Answer:/i.test(line)
            );
            const answer = answerLine
              ? answerLine.replace(/Answer:/i, "").trim()[0].toLowerCase()
              : "";

            const explanationLine = lines.find((line) =>
              /^Explanation:/i.test(line)
            );
            const explanation = explanationLine
              ? explanationLine.replace(/Explanation:/i, "").trim()
              : "";

            return { question: questionText, options, answer, explanation };
          });
        setQuestions(qArr);
      }
    } catch (err) {
      console.error("Error loading MCQ:", err);
      alert("AI is busy right now. Please try again.");
    }
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

  const finalizeQuiz = async () => {
    const scoreData = calculateScore();

    const payloadQuestions = questions.map((q, idx) => {
      const selected = selectedOptions[idx] || "";
      const isCorrect = selected && selected === q.answer;
      const analysis = selected
        ? `Selected: ${selected.toUpperCase()} | Correct: ${q.answer.toUpperCase()} | Result: ${isCorrect ? "Correct" : "Incorrect"}`
        : "Not attempted";
      const explanation = [analysis, q.explanation].filter(Boolean).join(" | ");
      return { question: q.question, options: q.options, answer: q.answer, explanation };
    });

    try {
      await api.post("/mcq/attempt", {
        subject,
        topic,
        score: scoreData,
        time: seconds,
        selectedOptions,
        questions: payloadQuestions,
      });
    } catch (err) {
      console.error("Save attempt error:", err);
    }

    navigate("/interview/quiz/results", {
      state: {
        subject,
        topic,
        questions: payloadQuestions,
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
    setShowConfirmPopup(false);
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
   <div className="h-screen bg-gradient-to-b from-white via-blue-50 to-white relative">
   <div className="max-w-4xl mx-auto px-4 py-8">
 <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 mb-6 backdrop-blur-sm">
  <div className="flex items-center justify-between flex-wrap gap-4">
  <div>
  <h1 className="text-3xl font-bold text-blue-900">{topic}</h1>
    <p className="text-sm text-blue-600 font-medium">MCQ Mode</p>
  </div>

  <div className="flex items-center gap-3">   {startMCQ && (
    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 shadow-sm">
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
   <span className="font-mono text-lg font-semibold text-blue-700">   {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
 </span> </div>  )}

<button onClick={() => 
{ if (startMCQ) setShowConfirmPopup(true);
   else fetchMCQ(); }}
 disabled={loading}
  className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${
    startMCQ  ? "bg-red-500 text-white" : "bg-blue-600 text-white"  }`}   >
  {startMCQ ? "End Quiz" : loading ? "Loading..." : "Start Quiz"}
  </button>
 </div>
 </div>
  </div>

        {startMCQ && (
          <>
            {loading ? (
              <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-lg font-medium text-blue-700">Generating questions...</p>
              </div>
            ) : (
              currentQuestion && (
                <div className="space-y-6">

                  <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-blue-700">
                        Question {currentIndex + 1} of {questions.length}
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                        {currentIndex + 1}
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900 leading-relaxed flex-1">
                        {currentQuestion.question}
                      </h2>
                    </div>

                    <div className="space-y-3 mb-6">
                      {currentQuestion.options?.map((opt) => {
                        const isSelected =
                          selectedOptions[currentIndex] === opt.label;
                        const isCorrect =
                          selectedOptions[currentIndex] &&
                          opt.label === currentQuestion.answer;
                        const isWrong =
                          selectedOptions[currentIndex] &&
                          isSelected &&
                          opt.label !== currentQuestion.answer;

                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleOptionClick(currentIndex, opt.label)}
                            disabled={!!selectedOptions[currentIndex]}
                            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 shadow-sm ${
                              isCorrect
                                ? "bg-green-50 border-green-500"
                                : isWrong
                                ? "bg-red-50 border-red-500"
                                : isSelected
                                ? "bg-blue-50 border-blue-400"
                                : "bg-white border-blue-100 hover:bg-blue-50 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  isCorrect
                                    ? "bg-green-500 text-white"
                                    : isWrong
                                    ? "bg-red-500 text-white"
                                    : isSelected
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {opt.label.toUpperCase()}
                              </span>

                              <span className="text-gray-800 font-medium flex-1">
                                {opt.text}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {selectedOptions[currentIndex] && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                          <p className="text-sm font-semibold text-blue-700 mb-1">
                            Correct Answer
                          </p>
                          <p className="text-gray-900 font-medium">
                            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-full text-sm font-bold mr-2">
                              {currentQuestion.answer.toUpperCase()}
                            </span>
                            {
                              currentQuestion.options.find(
                                (o) => o.label === currentQuestion.answer
                              )?.text
                            }
                          </p>
                        </div>

                        {currentQuestion.explanation && (
                          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                            <p className="text-sm font-semibold text-blue-700 mb-2">
                              Explanation
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                              {currentQuestion.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                    <div className="flex items-center justify-between">

                      <button
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                          currentIndex === 0
                            ? "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200"
                            : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                        }`}
                      >
                        Previous
                      </button>

                      {currentIndex === questions.length - 1 &&
                      selectedOptions[currentIndex] ? (
                        <button
                          onClick={() => setShowConfirmPopup(true)}
                          className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold transition-all duration-300 shadow-md hover:scale-105"
                        >
                          Finish Quiz
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentIndex(currentIndex + 1)}
                          disabled={currentIndex === questions.length - 1}
                          className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                            currentIndex === questions.length - 1
                              ? "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200"
                              : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )
            )}
          </>
        )}
      </div>
      {showConfirmPopup && (
 <div className="absolute inset-0 backdrop-blur-md bg-transparent flex items-center justify-center z-50">
 <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-blue-200 animate-fade-in-scale">
<h2 className="text-2xl font-bold text-blue-900 mb-4 text-center"> End Quiz? </h2>

 <p className="text-gray-700 text-center mb-6">Are you sure you want to end the quiz? Your answers will be submitted.</p>
 <div className="flex items-center justify-center gap-4">
 <button onClick={() => setShowConfirmPopup(false)} className="px-6 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition" >
Cancel</button>

 <button
onClick={finalizeQuiz}
 className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-md">
 Yes, End Quiz </button>
</div>
</div>

 </div> )}
 </div>
  );
}
