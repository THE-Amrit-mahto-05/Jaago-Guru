import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, AlertTriangle, Lightbulb, FileText, CheckCircle2, Home, Award, Terminal, Target } from "lucide-react";
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

  const averageScore = summary.length > 0
    ? (summary.reduce((acc, q) => acc + (q.score || 0), 0) / summary.length).toFixed(1)
    : 0;

  const totalPoints = summary.reduce((acc, q) => acc + (q.score || 0), 0);
  const maxPoints = summary.length * 10;
  const percentage = summary.length > 0 ? ((totalPoints / maxPoints) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#FDFCF8] font-sans text-neutral-900">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
               <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Preparing your report...</p>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FDFCF8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen relative">
         <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
             style={{
                backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
             }}>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Report Header */}
          <div className="bg-white border border-neutral-200 p-8 shadow-sm mb-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                <FileText size={120} />
             </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-neutral-900 rounded-full"></span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Interview Completed</p>
                 </div>
                 <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">Performance Report</h1>
                 <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                    <span>{new Date(summary[0].createdAt).toLocaleString()}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
             <div className="bg-white border border-neutral-200 p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Questions</p>
                <p className="text-3xl font-bold text-neutral-900 font-mono">{summary.length}</p>
             </div>
             
             <div className="bg-white border border-neutral-200 p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Total Score</p>
                <p className="text-3xl font-bold text-neutral-900 font-mono">{totalPoints}<span className="text-lg text-neutral-400">/{maxPoints}</span></p>
             </div>
             
             <div className="bg-white border border-neutral-200 p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Average Score</p>
                <p className="text-3xl font-bold text-neutral-900 font-mono">{averageScore}</p>
             </div>
             
             <div className="bg-neutral-900 text-white p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Overall Performance</p>
                <p className="text-3xl font-bold font-mono">{percentage}%</p>
             </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-2 border-red-500 p-4 mb-6">
              <p className="text-red-700 font-bold text-xs uppercase">{error}</p>
            </div>
          )}

          {/* Detailed Question Analysis */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 mb-4">
               <Award size={18} className="text-neutral-500"/>
               <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Question-by-Question Feedback</h2>
            </div>

            {summary.map((q, index) => (
              <div key={q.id} className="bg-white border border-neutral-200 shadow-sm overflow-hidden group">
                
                {/* Header */}
                <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex items-start justify-between gap-4">
                   <div className="flex gap-4">
                      <span className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 font-mono text-sm font-bold rounded-sm">
                         {String(q.index).padStart(2, '0')}
                      </span>
                      <div>
                         <h3 className="text-lg font-medium text-neutral-900 leading-tight pt-1">{q.text}</h3>
                      </div>
                   </div>
                   
                   <div className="text-right flex-shrink-0">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Score</div>
                      <div className={`text-xl font-bold font-mono 
                         ${(q.score || 0) >= 8 ? 'text-green-600' : (q.score || 0) >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                         {q.score ?? "0"}/10
                      </div>
                   </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  
                  {/* Response */}
                  <div className="relative pl-4 border-l-2 border-neutral-200">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Your Response</p>
                     <p className="text-sm text-neutral-700 leading-relaxed font-mono">
                        "{q.userAnswer || "No answer recorded."}"
                     </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     {/* Strengths */}
                     <div className="bg-green-100/60 border border-green-200 p-5 rounded-sm">
                        <div className="flex items-center gap-2 mb-3">
                           <TrendingUp size={16} className="text-green-800"/>
                           <h4 className="text-xs font-bold uppercase tracking-widest text-green-900">
                           What You Did Well
                           </h4>
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed">
                           {q.strengths || "None identified."}
                        </p>
                     </div>
                     
                     {/* Weaknesses */}
                     <div className="bg-red-100/60 border border-red-200 p-5 rounded-sm">
                        <div className="flex items-center gap-2 mb-3">
                           <AlertTriangle size={16} className="text-red-800"/>
                           <h4 className="text-xs font-bold uppercase tracking-widest text-red-900">
                           Areas to Improve
                           </h4>
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed">
                           {q.weaknesses || "None identified."}
                        </p>
                     </div>
                  </div>

                  {/* Recommendations */}
                  {q.advice && (
                     <div className="bg-blue-50/60 border border-blue-200 p-5 rounded-sm">
                        <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={16} className="text-blue-700"/>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-blue-900">
                           Suggestions
                        </h4>
                        </div>
                        <p className="text-sm text-neutral-800 leading-relaxed">
                        {q.advice}
                        </p>
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="mt-8 pt-8 border-t border-neutral-200 flex justify-end">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
            >
              <Home size={16} />
              Back to Dashboard
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}