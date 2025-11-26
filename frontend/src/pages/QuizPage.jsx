import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function QuizPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const subject = params.get("subject");
  const topic = params.get("topic");
  const mode = params.get("mode");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await api.post("/ai/ask", { subject, topic, mode });
        if (res.data.success) {
          const rawText = res.data.data.candidates[0].content.parts[0].text;

          if (mode === "mcq") {
            const qArr = rawText
              .split(/\n(?=\d+\.)/) 
              .map((qBlock) => {
                const lines = qBlock.split("\n").filter(Boolean);
                const questionText = lines[0].replace(/^\d+\.\s*/, "");
                const options = lines
                  .filter((line) => /^[abcd]\)/.test(line))
                  .map((opt) => ({
                    label: opt[0],
                    text: opt.slice(2).trim(),
                  }));
                const answerLine = lines.find((line) => /^Answer:/.test(line));
                const answer = answerLine ? answerLine.replace("Answer:", "").trim()[0] : "";

                return { questionText, options, answer };
              });

            setQuestions(qArr);
          } else {
            setQuestions(rawText.split("\n").filter(Boolean).map((q) => ({ questionText: q })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [subject, topic, mode]);

  const handleOptionClick = (qIndex, selectedLabel) => {
    if (selectedOptions[qIndex]) return;
    setSelectedOptions({ ...selectedOptions, [qIndex]: selectedLabel });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">
        {topic} - {mode.toUpperCase()} Questions
      </h1>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition">
            <p className="font-medium mb-4">
              {idx + 1}. {q.questionText}
            </p>

            {q.options?.map((opt) => {
              const isSelected = selectedOptions[idx] === opt.label;
              const isCorrect = selectedOptions[idx] && opt.label === q.answer;
              const isWrong = selectedOptions[idx] && isSelected && opt.label !== q.answer;

              return (
                <button
                  key={opt.label}
                  onClick={() => handleOptionClick(idx, opt.label)}
                  disabled={!!selectedOptions[idx]}
                  className={`block w-full text-left px-4 py-2 mb-2 rounded-lg border transition
                    ${isCorrect ? "bg-green-200 border-green-500" : ""}
                    ${isWrong ? "bg-red-200 border-red-500" : ""}
                    ${!selectedOptions[idx] ? "hover:bg-blue-100" : ""}`}
                >
                  {opt.label}) {opt.text}
                </button>
              );
            })}

            {selectedOptions[idx] && q.answer && (
              <p className="mt-2 text-sm text-gray-700">
                Correct Answer: {q.answer}) {q.options.find((o) => o.label === q.answer)?.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
