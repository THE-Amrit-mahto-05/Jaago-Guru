import { useLocation, useNavigate } from "react-router-dom";

export default function QuizMode() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const subject = params.get("subject");
  const topic = params.get("topic");

  if (!subject || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">Subject or topic missing!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">{topic} - Choose Mode</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <div
          onClick={() =>
            navigate(`/interview/quiz/play?subject=${subject}&topic=${topic}&mode=mcq`)
          }
          className="cursor-pointer p-8 rounded-2xl shadow-lg text-white 
            bg-gradient-to-br from-blue-500 to-blue-700
            hover:scale-[1.05] hover:shadow-2xl transition transform text-center"
        >
          <h2 className="text-xl font-semibold mb-2">MCQ Questions</h2>
          <p className="text-sm opacity-80">AI-generated multiple choice questions</p>
        </div>
        <div
          onClick={() =>
            navigate(`/interview/quiz/play?subject=${subject}&topic=${topic}&mode=subjective`)
          }
          className="cursor-pointer p-8 rounded-2xl shadow-lg text-white 
            bg-gradient-to-br from-green-500 to-emerald-700
            hover:scale-[1.05] hover:shadow-2xl transition transform text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Subjective Questions</h2>
          <p className="text-sm opacity-80">AI-generated open-ended questions</p>
        </div>
        <div
          onClick={() =>
            navigate(`/interview/quiz/play?subject=${subject}&topic=${topic}&mode=session`)
          }
          className="cursor-pointer p-8 rounded-2xl shadow-lg text-white 
            bg-gradient-to-br from-purple-500 to-purple-700
            hover:scale-[1.05] hover:shadow-2xl transition transform text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Session-wise Interview</h2>
          <p className="text-sm opacity-80">1-hour AI interview session</p>
        </div>
      </div>
    </div>
  );
}
