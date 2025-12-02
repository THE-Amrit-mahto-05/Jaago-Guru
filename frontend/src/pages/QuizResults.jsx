import { useLocation, useNavigate } from "react-router-dom";

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, total, userAnswers, correctAnswers, explanation } =
    location.state || {};

  if (!location.state) {
    return (
      <div className="p-6 text-center">
        <h2>No result data found!</h2>
        <button
          onClick={() => navigate("/subjects")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const questionList = explanation
    .split(/\n(?=\d+\.)/)
    .filter((q) => q.trim() !== "");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Quiz Results</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-semibold">
          Score: {score} / {total}
        </p>
      </div>

      <h2 className="text-xl font-bold mb-2">Explanation</h2>
      <div className="space-y-4">
        {questionList.map((q, index) => (
          <div key={index} className="p-4 border rounded bg-white">
            <pre className="whitespace-pre-wrap">{q}</pre>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/subjects")}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Back to Subjects
      </button>
    </div>
  );
}
