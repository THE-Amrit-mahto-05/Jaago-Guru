import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function Topics() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const readableSubject = subject
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await api.post("/ai/topics", { subject: readableSubject });
        setTopics(res.data.topics);
      } catch (err) {
        console.error("Failed to load topics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, [subject]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Topics — {readableSubject}
      </h1>

      {loading ? (
        <p className="text-gray-600 text-lg">Generating topics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(`/interview/quiz?subject=${subject}&topic=${topic}`)
              }
              className="cursor-pointer p-6 rounded-2xl shadow-lg text-white 
                bg-gradient-to-br from-indigo-500 to-indigo-700
                hover:scale-[1.05] hover:shadow-2xl transition transform"
            >
              <h2 className="text-xl font-semibold">{topic}</h2>
              <p className="text-sm opacity-80 mt-1">Tap to view questions</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
