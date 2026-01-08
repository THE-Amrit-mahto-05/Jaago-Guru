import { useLocation, useNavigate } from "react-router-dom";

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const { subject, topic, questions = [], selectedOptions = {}, score = { correct: 0, wrong: 0 }, time = 0 } = location.state || {};

  if (!location.state) {
    return (
      <div className="p-6 text-center">
        <h2>No result data found</h2>
        <button
          onClick={() => navigate("/interview")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const total = questions.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Quiz Results</h1>
        <p className="text-slate-600 mt-1">{subject} • {topic}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="text-sm text-blue-700">Correct</div>
          <div className="text-2xl font-bold text-blue-900">{score.correct}</div>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <div className="text-sm text-red-700">Wrong</div>
          <div className="text-2xl font-bold text-red-900">{score.wrong}</div>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded">
          <div className="text-sm text-slate-700">Time</div>
          <div className="text-2xl font-bold text-slate-900">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}</div>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const selected = selectedOptions[idx];
          const correct = q.answer;
          const isCorrect = selected && selected === correct;
          const correctText = q.options.find((o) => o.label === correct)?.text || "";
          const selectedText = q.options.find((o) => o.label === selected)?.text || "";

          return (
            <div key={idx} className="bg-white border border-slate-200 rounded p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg font-bold text-sm">
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold text-slate-900">{q.question}</h3>
                  </div>
                </div>
                <div className={`text-right ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  <div className="text-xs text-slate-500">Result</div>
                  <div className="text-xl font-bold">{selected ? (isCorrect ? "Correct" : "Wrong") : "Not attempted"}</div>
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded border ${isCorrect ? "bg-green-50 border-green-200" : selected ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
                  <div className="text-sm font-semibold">Your Answer</div>
                  <div className="mt-1 text-slate-800">
                    {selected ? `${selected.toUpperCase()}. ${selectedText}` : "No selection"}
                  </div>
                </div>
                <div className="p-4 rounded border bg-blue-50 border-blue-200">
                  <div className="text-sm font-semibold">Correct Answer</div>
                  <div className="mt-1 text-slate-800">
                    {`${correct.toUpperCase()}. ${correctText}`}
                  </div>
                </div>
              </div>

              {q.explanation && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-sm font-semibold text-slate-700">Explanation</div>
                  <div className="mt-1 text-slate-800">{q.explanation}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate("/interview")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Subjects
        </button>
      </div>
    </div>
  );
}
