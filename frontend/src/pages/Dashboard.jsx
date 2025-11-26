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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1s" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">
      <Sidebar logout={logout} />
      <main className="flex-1 p-6 overflow-auto">
        <div
          className="flex items-center justify-between mb-8"
          style={{ animation: "fadeInDown 0.6s ease-out" }}
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back! Ready to ace your interviews?</p>
          </div>
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-lg px-6 py-3 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
              {user?.email ? user.email.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="font-semibold text-gray-800">{user?.name || user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
            style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Total Interviews</h3>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">12</p>
              <p className="text-green-600 text-sm font-medium mt-2">↑ 3 this week</p>
            </div>
          </div>

          <div
            className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
            style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Success Score</h3>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <Award className="text-white" size={24} />
                </div>
              </div>
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">82%</p>
              <p className="text-green-600 text-sm font-medium mt-2">↑ 5% improvement</p>
            </div>
          </div>

          <div
            className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
            style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Streak Days</h3>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <Flame className="text-white animate-pulse" size={24} />
                </div>
              </div>
              <p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">5</p>
              <p className="text-orange-600 text-sm font-medium mt-2">🔥 Keep it up!</p>
            </div>
          </div>
        </div>

        <div className="mb-10" style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}>
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-10 rounded-3xl shadow-2xl overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mb-48 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between">
              <div className="text-white mb-6 md:mb-0">
                <h2 className="text-4xl font-bold mb-3 flex items-center gap-3">
                  Ready for your next interview?
                  <Target className="animate-bounce" size={32} />
                </h2>
                <p className="text-white/90 text-lg max-w-2xl">
                  Practice real interview questions with AI and get instant feedback to improve your performance.
                </p>
              </div>
              <button
                onClick={() => navigate("/interview")}
                className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-2 group/btn"
              >
                Start Interview
                <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" size={24} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Recent Attempts
          </h2>
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-200/50">
            <ul className="space-y-4">
              {[
                { name: "DSA Mock Interview", score: 85, color: "from-blue-500 to-blue-600" },
                { name: "System Design Basics", score: 72, color: "from-purple-500 to-purple-600" },
                { name: "HR Interview Practice", score: 90, color: "from-pink-500 to-pink-600" }
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group hover:shadow-md"
                  style={{ animation: `slideInRight 0.5s ease-out ${0.6 + index * 0.1}s both` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <FileText className="text-white" size={20} />
                    </div>
                    <span className="font-medium text-gray-700 text-lg">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.score}%
                    </span>
                    <ArrowRight className="text-gray-400 group-hover:translate-x-2 transition-transform" size={20} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes animate-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: animate-fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
}
