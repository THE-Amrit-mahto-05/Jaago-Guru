import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/sidebar";

export default function MyAttempts() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (id) {
          const res = await api.get(`/mcq/attempt/${id}`);
          setDetails(res.data);
        } else {
          const res = await api.get("/mcq/attempts");
          setAttempts(res.data.attempts || []);
        }
      } catch (err) {
        console.error("Load attempts error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8">Loading...</main>
      </div>
    );
  }

  if (id && details) {
    const { attempt } = details;
    return (
      <div className="min-h-screen flex bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold">MCQ Attempt</h1>
              <p className="text-slate-600">{attempt.subject} • {attempt.topic}</p>
              <div className="grid sm:grid-cols-4 gap-4 mt-4">
                <Stat label="Correct" value={attempt.correct} color="blue" />
                <Stat label="Wrong" value={attempt.wrong} color="red" />
                <Stat label="Total" value={attempt.total} color="slate" />
                <Stat label="Time" value={`${Math.floor(attempt.timeSec/60)}:${(attempt.timeSec%60).toString().padStart(2,"0")}`} color="slate" />
              </div>
            </div>

            <div className="space-y-4">
              {((attempt.questions || [])).map((q, idx) => {
                const opts = q.options || [];
                const correctText = opts.find(o => o.label === q.answer)?.text || "";
                const selected = (attempt.selected || {})[idx];
                const isCorrect = selected && selected === q.answer;
                return (
                  <div key={q.id} className="bg-white border border-slate-200 rounded p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex w-8 h-8 bg-blue-600 text-white rounded-lg items-center justify-center font-bold text-sm">{idx+1}</span>
                        <h3 className="font-semibold text-slate-900">{q.question}</h3>
                      </div>
                      <div className={`text-right ${isCorrect ? "text-green-600" : selected ? "text-red-600" : "text-slate-500"}`}>{selected ? (isCorrect ? "Correct" : "Wrong") : "Not attempted"}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-semibold">Your Answer</div>
                      <div className="mt-1">{selected ? `${selected.toUpperCase()}. ${opts.find(o=>o.label===selected)?.text || ""}` : "No selection"}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-semibold">Correct Answer</div>
                      <div className="mt-1">{q.answer?.toUpperCase()}. {correctText}</div>
                    </div>
                    {q.explanation && (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded">
                        <div className="text-sm font-semibold text-slate-700">Explanation</div>
                        <div className="text-slate-800">{q.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">My MCQ Attempts</h1>
          <div className="grid gap-4">
            {attempts.map((a) => (
              <button key={a.id} onClick={() => navigate(`/my-attempts/${a.id}`)} className="text-left bg-white border border-slate-200 rounded p-5 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{a.subject} • {a.topic}</div>
                    <div className="text-slate-600 text-sm">{new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Stat label="Correct" value={a.correct} color="blue" />
                    <Stat label="Wrong" value={a.wrong} color="red" />
                    <Stat label="Total" value={a.total} color="slate" />
                    <Stat label="Time" value={`${Math.floor(a.timeSec/60)}:${(a.timeSec%60).toString().padStart(2,"0")}`} color="slate" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, color }) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    red: "bg-red-50 border-red-200 text-red-900",
    slate: "bg-slate-50 border-slate-200 text-slate-900",
  };
  return (
    <div className={`px-3 py-2 rounded border ${colorMap[color]}`}>
      <div className="text-xs">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
