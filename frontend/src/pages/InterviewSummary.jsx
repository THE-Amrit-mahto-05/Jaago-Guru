// client/src/pages/InterviewSummary.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, AlertTriangle, Lightbulb, FileText, CheckCircle2, Home, Award } from "lucide-react";
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

  // Calculate statistics
  const averageScore = summary.length > 0
    ? (summary.reduce((acc, q) => acc + (q.score || 0), 0) / summary.length).toFixed(1)
    : 0;

  const totalPoints = summary.reduce((acc, q) => acc + (q.score || 0), 0);
  const maxPoints = summary.length * 10;
  const percentage = summary.length > 0 ? ((totalPoints / maxPoints) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-700">Loading Interview Analysis...</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">

          {/* Report Header */}
          <div className="bg-white border-l-4 border-blue-600 rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="text-blue-600" size={32} strokeWidth={2} />
                  <h1 className="text-3xl font-bold text-slate-900">Interview Performance Report</h1>
                </div>
                <p className="text-slate-600 text-lg">Detailed Analysis & Feedback</p>
                <p className="text-sm text-slate-500 mt-1">Interview ID: #{interviewId}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 uppercase tracking-wide mb-1">Date</div>
                <div className="text-slate-900 font-medium">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={24} />
              Performance Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Total Questions</div>
                <div className="text-3xl font-bold text-slate-900">{summary.length}</div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Total Score</div>
                <div className="text-3xl font-bold text-blue-600">{totalPoints}/{maxPoints}</div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Average Score</div>
                <div className="text-3xl font-bold text-purple-600">{averageScore}/10</div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Overall Performance</div>
                <div className="text-3xl font-bold text-slate-900">{percentage}%</div>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Performance Level</span>
                <span className="text-sm font-medium text-slate-900">{percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all ${percentage >= 80 ? 'bg-green-500' :
                    percentage >= 60 ? 'bg-blue-500' :
                      percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-slate-500">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Detailed Question Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Award className="text-blue-600" size={24} />
              Detailed Question Analysis
            </h2>

            <div className="space-y-6">
              {summary.map((q, index) => (
                <div key={q.id} className="border border-slate-200 rounded-lg overflow-hidden">

                  {/* Question Header */}
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg font-bold text-sm">
                            {q.index}
                          </span>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {q.text}
                          </h3>
                        </div>
                      </div>

                      {/* Score Display */}
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Score</div>
                        <div className={`text-2xl font-bold ${(q.score || 0) >= 8 ? 'text-green-600' :
                          (q.score || 0) >= 5 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {q.score ?? "0"}/10
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Body */}
                  <div className="p-6 space-y-5">

                    {/* Your Response */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="text-slate-600" size={18} />
                        <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Your Response</h4>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {q.userAnswer || "No response recorded"}
                        </p>
                      </div>
                    </div>

                    {/* Analysis Grid */}
                    <div className="grid md:grid-cols-2 gap-4">

                      {/* Strengths */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="text-green-600" size={18} />
                          <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Strengths Identified</h4>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-900 text-sm leading-relaxed">
                            {q.strengths || "No specific strengths identified"}
                          </p>
                        </div>
                      </div>

                      {/* Areas for Improvement */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="text-orange-600" size={18} />
                          <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Areas for Improvement</h4>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <p className="text-orange-900 text-sm leading-relaxed">
                            {q.weaknesses || "No specific weaknesses identified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {q.advice && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="text-blue-600" size={18} />
                          <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Recommendations</h4>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-900 text-sm leading-relaxed whitespace-pre-wrap">
                            {q.advice}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Home size={20} />
              Return to Dashboard
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
