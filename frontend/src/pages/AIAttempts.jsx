import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, Award, ArrowRight } from "lucide-react";
import api from "../api";
import Sidebar from "../components/sidebar";

export default function AIAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | completed | in-progress
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/interview/ai-history");
        setAttempts(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch AI attempts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredAttempts =
    filter === "all"
      ? attempts
      : attempts.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">AI Interview Attempts</h1>

        {/* FILTER TABS */}
        <div className="flex gap-3 mb-6">
          {["all", "completed", "in-progress"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition
                ${
                  filter === f
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
              {f === "all"
                ? "All"
                : f === "completed"
                ? "Completed"
                : "In Progress"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : filteredAttempts.length === 0 ? (
          <p className="text-slate-500">No interviews in this category.</p>
        ) : (
          <div className="space-y-4">
            {filteredAttempts.map((a) => (
              <div
                key={a.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">{a.role}</h3>

                  <div className="flex gap-4 text-sm text-slate-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(a.createdAt).toLocaleString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      {a.totalQ} Questions
                    </span>

                    {a.status === "completed" && (
                      <span className="flex items-center gap-1">
                        <Award size={14} />
                        Score: {a.avgScore}/10
                      </span>
                    )}
                  </div>

                  {/* STATUS BADGE */}
                  <div className="mt-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full
                        ${
                          a.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                    >
                      {a.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                {a.status === "completed" ? (
                  <button
                    onClick={() => navigate(`/interview/${a.id}/summary`)}
                    className="flex items-center gap-2 text-indigo-600 hover:underline"
                  >
                    View Report <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/interview/${a.id}`)}
                    className="flex items-center gap-2 text-yellow-700 hover:underline"
                  >
                    Resume Interview <ArrowRight size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
