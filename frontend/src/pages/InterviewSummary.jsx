// client/src/pages/InterviewSummary.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/sidebar";

export default function InterviewSummary() {
  const { id: interviewIdParam } = useParams();
  const interviewId = Number(interviewIdParam);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/interview/${interviewId}/question`);
        if (!res.data.finished) {
          // not finished yet — redirect to interview page
          navigate(`/interview/${interviewId}`);
          return;
        }
        setSummary(res.data.summary || []);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        setError("Failed to load summary");
      } finally {
        setLoading(false);
      }
    })();
  }, [interviewId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h2>Loading summary...</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Interview Summary</h1>

          {error && <p className="text-red-500">{error}</p>}

          <div className="space-y-6">
            {summary.map((q) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl shadow">
                <div className="mb-3">
                  <strong>Q{q.index}:</strong> <span>{q.text}</span>
                </div>

                <div className="mb-2">
                  <strong>Your answer:</strong>
                  <div className="mt-1 whitespace-pre-wrap p-3 bg-gray-50 rounded">{q.userAnswer || "—"}</div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <strong>Score</strong>
                    <div className="mt-1 text-xl">{q.score ?? "-"}/10</div>
                  </div>
                  <div>
                    <strong>Strengths</strong>
                    <div className="mt-1 text-sm">{q.strengths || "—"}</div>
                  </div>
                  <div>
                    <strong>Weaknesses</strong>
                    <div className="mt-1 text-sm">{q.weaknesses || "—"}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <strong>Advice</strong>
                  <div className="mt-1 text-sm whitespace-pre-wrap">{q.advice || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}