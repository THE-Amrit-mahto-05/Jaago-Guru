import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, TrendingUp, Target, Flame, Award, ArrowRight } from "lucide-react";
import api from "../api";
import Sidebar from "../components/sidebar.jsx";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/profile")
      .then((res) => {
        setUser(res.data.user);
        setTimeout(() => setLoading(false), 500);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Sidebar logout={logout} />

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {/* Header Section */}
        <header
          className="flex items-center justify-between mb-10"
          style={{ animation: "fadeInDown 0.6s ease-out" }}
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1 text-lg">
              Welcome back, <span className="font-medium text-indigo-600">{user?.name || "User"}</span>! 👋
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg border-2 border-white shadow-sm">
              {user?.email ? user.email.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="hidden md:block text-right mr-2">
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Profile</p>
              <p className="text-sm font-semibold text-slate-700 leading-tight">{user.name}</p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Interviews Card */}
          <div
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <TrendingUp size={24} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  +3 this week
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Total Interviews</h3>
              <p className="text-4xl font-bold text-slate-800 mt-1">12</p>
            </div>
          </div>

          {/* Success Score Card */}
          <div
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <Award size={24} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  +5% improvement
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Success Score</h3>
              <p className="text-4xl font-bold text-slate-800 mt-1">82%</p>
            </div>
          </div>

          {/* Streak Days Card */}
          <div
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                  <Flame size={24} className="group-hover:animate-pulse" />
                </div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
                  Keep it up!
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Current Streak</h3>
              <p className="text-4xl font-bold text-slate-800 mt-1">5 <span className="text-lg text-slate-400 font-normal">Days</span></p>
            </div>
          </div>
        </div>

        {/* Hero / CTA Section */}
        <div
          className="mb-10 relative overflow-hidden rounded-3xl shadow-xl group"
          style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transition-transform duration-700 group-hover:scale-105"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>

          <div className="relative p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4 border border-white/10">
                <Target size={16} />
                <span>AI-Powered Practice</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Ready to ace your next interview?
              </h2>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Practice with our advanced AI interviewer. Get real-time feedback on your answers, body language, and tone.
              </p>
            </div>

            <button
              onClick={() => navigate("/interview/start")}
              className="shrink-0 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-indigo-50 hover:scale-105 transition-all duration-300 flex items-center gap-3 group/btn"
            >
              Start Interview
              <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>

        {/* Recent Attempts Section */}
        <div style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Recent Attempts</h2>
            <button
              onClick={() => navigate("/my-attempts")}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {[
                { name: "DSA Mock Interview", score: 85, date: "Today, 10:30 AM", type: "Technical" },
                { name: "System Design Basics", score: 72, date: "Yesterday, 2:15 PM", type: "Design" },
                { name: "HR Interview Practice", score: 90, date: "Oct 24, 4:00 PM", type: "Behavioral" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
                      ${item.score >= 80 ? 'bg-green-100 text-green-700' :
                        item.score >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.score}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><FileText size={14} /> {item.type}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                    <ArrowRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
