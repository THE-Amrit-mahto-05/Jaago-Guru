import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, FileText, ArrowLeft, Layers, Terminal, ArrowRight } from "lucide-react";
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
      <div className="min-h-screen flex bg-[#FDFCF8] font-sans text-neutral-900">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
               <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Loading Data...</p>
            </div>
        </main>
      </div>
    );
  }

  // DETAILED VIEW (Single Attempt)
  if (id && details) {
    const { attempt } = details;
    const notAttempted = attempt.total - (attempt.correct + attempt.wrong);
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

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-6">
                <div>
                   <button 
                      onClick={() => navigate("/my-attempts")}
                      className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 flex items-center gap-1 mb-2 transition-colors cursor-pointer"
                   >
                      <ArrowLeft size={12} /> Back to Attempts
                   </button>
                   <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Performance Report</h1>
                   <p className="text-sm font-mono text-neutral-500 uppercase mt-1">{attempt.subject} • {attempt.topic}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Date</p>
                    <p className="text-sm font-mono text-neutral-900">{new Date(attempt.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-5 gap-4 mb-8">
              <Stat label="Correct Answers" value={attempt.correct} color="neutral" icon={<CheckCircle2 size={16} className="text-green-600"/>} />
              <Stat label="Wrong Answers" value={attempt.wrong} color="neutral" icon={<XCircle size={16} className="text-red-600"/>} />
              <Stat label="Not Attempted" value={notAttempted} icon={<FileText size={16} className="text-amber-500"/>} />
              <Stat label="Total Questions" value={attempt.total} color="neutral" icon={<Layers size={16} className="text-neutral-400"/>} />
              <Stat label="Duration" value={`${Math.floor(attempt.timeSec/60)}:${(attempt.timeSec%60).toString().padStart(2,"0")}`} color="neutral" icon={<Clock size={16} className="text-neutral-400"/>} />
            </div>

            {/* Question Log */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-neutral-500"/>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Question Review</h3>
               </div>

              {((attempt.questions || [])).map((q, idx) => {
                const opts = q.options || [];
                const correctText = opts.find(o => o.label === q.answer)?.text || "";
                const selected = (attempt.selected || {})[idx];
                const isCorrect = selected && selected === q.answer;
                
                return (
                  <div key={q.id} className="bg-white border border-neutral-200 p-6 shadow-sm group">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 bg-neutral-100 text-neutral-500 font-mono text-sm font-bold flex items-center justify-center rounded-sm border border-neutral-200">
                           {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-lg font-medium text-neutral-900 leading-relaxed">{q.question}</h3>
                      </div>
                      <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-sm h-fit whitespace-nowrap
                        ${isCorrect 
                           ? "bg-green-50 text-green-700 border-green-200" 
                           : selected 
                           ? "bg-red-50 text-red-700 border-red-200" 
                           : "bg-neutral-50 text-neutral-500 border-neutral-200"}`}>
                        {selected ? (isCorrect ? "Correct" : "Incorrect") : "Not Attempted"}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className={`p-4 border rounded-sm relative ${isCorrect ? "bg-green-100/70 border-green-100" : "bg-red-100/70 border-red-100"}`}>
                           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Your Answer</p>
                           <p className="text-sm font-medium text-neutral-900 font-mono">
                              {selected ? `${selected.toUpperCase()}. ${opts.find(o=>o.label===selected)?.text || ""}` : "No selection"}
                           </p>
                        </div>
                        
                        <div className="p-4 border border-neutral-200 bg-neutral-50/50 rounded-sm">
                           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Correct Answer</p>
                           <p className="text-sm font-medium text-neutral-900 font-mono">
                              {q.answer?.toUpperCase()}. {correctText}
                           </p>
                        </div>
                    </div>
                    
                    {q.explanation && (
                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Explanation</p>
                        <p className="text-sm text-neutral-600 font-mono text-xs leading-relaxed">{q.explanation}</p>
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

  // LIST VIEW (All Attempts)
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

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-10 border-b border-neutral-200 pb-6 flex items-end justify-between">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <span className="w-2 h-2 bg-neutral-900 rounded-full animate-pulse"></span>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Your Practice History</p>
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
                   <Layers size={28} strokeWidth={1.5} />
                   MCQ Attempts
                </h1>
             </div>
          </div>

          <div className="space-y-4">
            {attempts.length === 0 ? (
              <div className="bg-white border border-dashed border-neutral-300 p-16 text-center shadow-sm">
                <Layers size={32} className="mx-auto text-neutral-300 mb-4" />
                <h2 className="text-lg font-bold text-neutral-700 mb-2">No MCQ Attempts Yet</h2>
                <p className="text-sm text-neutral-500 mb-6">
                  You haven’t taken any quizzes yet. Start practicing to see your performance reports here.
                </p>
                <button
                  onClick={() => navigate("/interview")}
                  className="px-6 py-2 bg-neutral-900 text-white text-sm font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition cursor-pointer"
                >
                  Start a Quiz
                </button>
              </div>
            ) : (
              attempts.map((a) => (
                <button 
                  key={a.id} 
                  onClick={() => navigate(`/my-attempts/${a.id}`)} 
                  className="w-full text-left bg-white border border-neutral-200 p-6 shadow-sm hover:border-neutral-900 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-lg font-bold text-neutral-900 mb-1 group-hover:underline decoration-neutral-300 underline-offset-4">
                        {a.topic}
                      </h2>
                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                        <Terminal size={12} />
                        <span>{a.subject}</span>
                        <span className="text-neutral-300">|</span>
                        <span>{new Date(a.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Score</span>
                        <span className="text-xl font-bold text-neutral-900 tracking-tight">
                          {a.correct}<span className="text-sm text-neutral-400">/{a.total}</span>
                        </span>
                      </div>
                      <div className="h-8 w-px bg-neutral-200"></div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Time</span>
                        <span className="text-lg font-mono text-neutral-900">
                          {Math.floor(a.timeSec/60)}:{(a.timeSec%60).toString().padStart(2,"0")}
                        </span>
                      </div>
                      <ArrowRight className="text-neutral-300 group-hover:text-neutral-900 transition-colors ml-4" size={20} />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="p-4 border border-neutral-200 bg-white shadow-sm flex items-center justify-between">
      <div>
         <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{label}</div>
         <div className="text-2xl font-bold text-neutral-900 tracking-tight font-mono">{value}</div>
      </div>
      {icon}
    </div>
  );
}