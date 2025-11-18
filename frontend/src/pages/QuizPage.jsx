import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";

export default function QuizPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const subject = params.get("subject");
  const topic = params.get("topic");
  const mode = params.get("mode");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [timer, setTimer] = useState(60 * 60); 

  useEffect(() => {
    async function fetchQuestions() {
    try {
        const res = await api.post("/ai/ask", { subject, topic, mode });
        setQuestions(res.data.data); 
      }catch (err) {
        console.error("Failed to load questions", err);
      }finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [subject, topic, mode]);

  useEffect(() => {
    if (mode !== "session") return;
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  const handleNext = () => {
    setUserAnswer("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert("Session completed!");
    }
  };

  if (loading) return <p className="p-6">Loading questions...</p>;

  if (!questions.length) return <p className="p-6">No questions found.</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {mode === "session" && (
        <div className="mb-4 text-lg font-semibold">
          Time Remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}{timer % 60} 
        </div>
      )}

      <div className="p-6 bg-white rounded-xl shadow-lg mb-4">
        <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>

        {mode === "mcq" && currentQuestion.options && (
          <div className="mt-4 flex flex-col gap-3">
            {currentQuestion.options.map((opt, i) => (
              <button key={i} className="p-2 border rounded">{opt}</button>
            ))}
          </div>
        )}

        {mode === "subjective" && (
          <textarea
            className="w-full p-2 mt-4 border rounded"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here"
          />
        )}

        {mode === "session" && (
          <textarea
            className="w-full p-2 mt-4 border rounded"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Answer the question here"
          />
        )}

        <button
          onClick={handleNext}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
