import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, TrendingUp, Target, Flame, Award, ArrowRight, Zap, Terminal } from "lucide-react";
import api from "../api";
import Sidebar from "../components/sidebar.jsx";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, analyticsRes] = await Promise.all([
          api.get("/auth/profile"),
          api.get("/interview/analytics"),
        ]);

        setUser(profileRes.data.user);
        setAnalytics(analyticsRes.data.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
           <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <style>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, #e5e5e5 1px, transparent 1px),
                            linear-gradient(to bottom, #e5e5e5 1px, transparent 1px);
        }
      `}</style>
      
      {/* Sidebar remains functional */}
      <Sidebar logout={logout} />

      <main className="flex-1 overflow-y-auto h-screen relative">
         {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] pointer-events-none z-0"></div>

        <div className="relative z-10 p-8 max-w-7xl mx-auto">
            
          {/* Header: Technical & Minimal */}
          <header className="flex items-end justify-between mb-12 border-b border-neutral-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">System Online</p>
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight leading-none">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Operator</p>
                <p className="text-sm font-bold text-neutral-900">{user?.name || "User"}</p>
              </div>
              <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center font-bold text-sm rounded-sm">
                {user?.email ? user.email.charAt(0).toUpperCase() : "?"}
              </div>
            </div>
          </header>

          {/* KPI Grid: Enhanced Minimal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

            {/* Total Interviews */}
            <div className="relative bg-white border border-neutral-200 p-6 overflow-hidden group hover:border-neutral-900 transition-all">
              <div className="absolute top-0 left-0 h-full w-1 bg-neutral-900 opacity-70"></div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Total Sessions</span>
                <TrendingUp size={18} className="text-neutral-400 group-hover:text-neutral-900 transition-colors"/>
              </div>
              <p className="text-4xl font-bold text-neutral-900 tracking-tight"> {analytics?.totalInterviews ?? 0} </p>
              <p className="text-xs text-neutral-400 mt-2 font-mono">interviews completed</p>
            </div>

            {/* Average Score */}
            <div className="relative bg-white border border-neutral-200 p-6 overflow-hidden group hover:border-neutral-900 transition-all">
              {/* Subtle background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-transparent opacity-60 pointer-events-none"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500"> Average Score</span>
                <Award size={18} className="text-neutral-400 group-hover:text-neutral-900 transition-colors"/>
              </div>

              <div className="relative z-10">
                <p className="text-4xl font-bold text-neutral-900 tracking-tight">
                  {analytics?.successScore ?? 0}
                  <span className="text-lg text-neutral-400 font-medium">%</span>
                </p>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-neutral-100 rounded-sm overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out
                      ${
                        analytics?.successScore >= 75
                          ? "bg-green-600"
                          : analytics?.successScore >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    style={{ width: `${analytics?.successScore ?? 0}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-400 mt-2 font-mono">overall performance</p>
              </div>
            </div>

            {/* Active Streak */}
            <div className="relative bg-white border border-neutral-200 p-6 overflow-hidden group hover:border-neutral-900 transition-all">
              <div className="absolute bottom-0 right-0 text-[120px] font-bold text-neutral-50 opacity-70 select-none pointer-events-none">
                {analytics?.currentStreak ?? 0}
              </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Active Streak</span>
                <Flame size={18} className="text-neutral-400 group-hover:text-neutral-900 transition-colors"/>
              </div>

              <p className="text-4xl font-bold text-neutral-900 tracking-tight relative z-10">
                {analytics?.currentStreak ?? 0}
                <span className="text-lg text-neutral-400 font-medium ml-1">days</span>
              </p>

              {/* Streak Visual */}
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-1 relative z-10">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`h-1 flex-1 ${ i < (analytics?.currentStreak % 7 || 0) ? "bg-neutral-900" : "bg-neutral-100" }`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Banner: High Contrast Industrial */}
          <div className="mb-12 relative overflow-hidden bg-neutral-900 text-white border border-neutral-900 shadow-xl group">
             {/* Abstract Lines */}
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <Terminal size={120} strokeWidth={1} />
             </div>
             
            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-sm text-xs font-mono mb-4 text-neutral-300">
                  <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>AI SIMULATION READY</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 tracking-tight">
                  Start a Mock Interview
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                  Practice with an AI interviewer and improve your technical and communication skills.
                </p>
              </div>

              <button
                onClick={() => navigate("/interview/start")}
                className="shrink-0 px-8 py-4 bg-white text-neutral-900 rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-3 cursor-pointer"
              >
                Start Interview
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Recent Attempts: Data Log Style */}
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-neutral-200 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <Target size={16} />
                Recent Interviews
              </h2>
              <button
                onClick={() => navigate("/ai-attempts")}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-900 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                View All <ArrowRight size={12} />
              </button>
            </div>

            <div className="bg-white border border-neutral-200 rounded-sm shadow-sm">
              {analytics?.recentAttempts?.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {analytics.recentAttempts.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-6">
                        {/* Score Badge - Squared, Technical */}
                        <div
                          className={`w-12 h-12 border-2 flex flex-col items-center justify-center text-sm font-bold font-mono rounded-sm transition-colors
                            ${
                              item.score >= 8
                                ? "border-green-500 text-green-700 bg-green-50"
                                : item.score >= 5
                                ? "border-amber-400 text-amber-700 bg-amber-50"
                                : "border-red-400 text-red-600 bg-red-50"
                            }`}
                        >
                          {item.score}
                          <span className={`text-[9px] font-semibold uppercase tracking-wider mt-1
                            ${
                              item.score >= 8
                                ? "text-green-700"
                                : item.score >= 5
                                ? "text-amber-700"
                                : "text-red-600"
                            }`}
                          >
                            {item.score >= 8 ? "Strong" : item.score >= 5 ? "Average" : "Improve"}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900 text-sm group-hover:underline decoration-neutral-400 underline-offset-4 transition-all">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-neutral-500 mt-1 font-mono">
                            <span className="flex items-center gap-1 uppercase">
                              <FileText size={12} /> {item.type}
                            </span>
                            <span className="text-neutral-300">|</span>
                            <span>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/interview/${item.id}/summary`)}
                        className="p-2 text-neutral-300 hover:text-neutral-900 transition-colors cursor-pointer">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                    <Terminal size={20} />
                  </div>
                  <p className="text-neutral-900 font-bold text-sm">No interviews yet</p>
                  <p className="text-neutral-500 text-xs mt-1">Initialize your first interview to see results here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}