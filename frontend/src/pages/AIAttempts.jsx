import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, Award, ArrowRight, Terminal, Activity, Clock } from "lucide-react";
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
    <div className="min-h-screen flex bg-[#FDFCF8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen relative">
         {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
             style={{
                backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
             }}>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
            {/* Header */}
            <div className="mb-10 border-b border-neutral-200 pb-6 flex items-end justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-neutral-900 rounded-full animate-pulse"></span>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Your Interview Activity</p>
                   </div>
                   <h1 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
                      <Terminal size={28} strokeWidth={1.5} />
                      AI Voice Interview History
                   </h1>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-8">
               {["all", "completed", "in-progress"].map((f) => (
                  <button
                     key={f}
                     onClick={() => setFilter(f)}
                     className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition-all
                     ${filter === f 
                        ? "bg-neutral-900 text-white border-neutral-900" 
                        : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 cursor-pointer"}`}
                  >
                     {f === "all" ? "All Interviews" : f === "completed" ? "Completed" : "In Progress"}
                  </button>
               ))}
            </div>

            {loading ? (
               <div className="border border-dashed border-neutral-300 rounded-sm p-12 text-center bg-neutral-50/50">
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Retrieving Data...</p>
               </div>
            ) : filteredAttempts.length === 0 ? (
               <div className="border border-neutral-200 bg-white p-12 text-center shadow-sm flex flex-col items-center">
                  <Activity className="text-neutral-300 mb-6" size={48} strokeWidth={1} />
                  <p className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-2">No Records Found</p>
                  <p className="text-xs text-neutral-500 mb-6 max-w-xs">Start a mock interview to see it here.</p>
                  <button
                     onClick={() => navigate("/interview/start")}
                     className="px-6 py-2 bg-neutral-900 text-white text-sm font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition cursor-pointer"
                  >
                     Start an Interview
                  </button>
               </div>
            ) : (
               <div className="space-y-4">
                  {filteredAttempts.map((a) => (
                     <div
                        key={a.id}
                        className="bg-white p-6 border border-neutral-200 hover:border-neutral-400 transition-colors shadow-sm group relative overflow-hidden"
                     >
                        <div className="flex justify-between items-start">
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <span
                                    className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-sm
                                       ${
                                          a.status === "completed"
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : "bg-amber-50 text-amber-700 border-amber-200"
                                       }`}
                                    >
                                    <span className={`w-1.5 h-1.5 rounded-full
                                       ${a.status === "completed" ? "bg-green-600" : "bg-amber-600"}`} />
                                    {a.status === "completed" ? "Completed" : "In Progress"}
                                    </span>
                              </div>
                              
                              <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-4 group-hover:underline decoration-neutral-300 underline-offset-4">
                                 {a.role}
                              </h3>

                              <div className="flex gap-6 text-xs text-neutral-500 font-mono border-t border-neutral-100 pt-4">
                                 <span className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    {new Date(a.createdAt).toLocaleDateString()}
                                 </span>

                                 <span className="flex items-center gap-2">
                                    <FileText size={14} />
                                    {a.totalQ} Questions
                                 </span>

                                 {a.status === "completed" && (
                                    <span className="flex items-center gap-2 text-neutral-900 font-bold">
                                       <Award size={14} />
                                       Score: {a.avgScore}/10
                                    </span>
                                 )}
                              </div>
                           </div>

                           {/* Action Button */}
                           <div className="flex items-center">
                              {a.status === "completed" ? (
                                 <button
                                    onClick={() => navigate(`/interview/${a.id}/summary`)}
                                    className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 hover:text-indigo-900 transition-colors flex items-center gap-2 cursor-pointer"

                                 >
                                    Report
                                    <ArrowRight size={14} />
                                 </button>
                              ) : (
                                 <button
                                    onClick={() => navigate(`/interview/${a.id}`)}
                                    className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
                                 >
                                    Resume
                                    <ArrowRight size={14} />
                                 </button>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
        </div>
      </main>
    </div>
  );
}