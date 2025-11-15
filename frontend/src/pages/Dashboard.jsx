import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch logged-in user profile
  useEffect(() => {
    api.get("/auth/profile")
      .then((res) => {
        setUser(res.data.user)})
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600">AI Prep</h2>
        </div>

        <nav className="flex-1 p-6 space-y-4">
          <button
            className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/interview")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Start Interview
          </button>

          <button
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            My Attempts
          </button>

          <button
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Settings
          </button>
        </nav>

        <div className="p-6 border-t">
          <button
            onClick={logout}
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">

        {/* Top Navbar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <p className="font-medium text-gray-600">
              {user ? user.email : "Loading..."}
            </p>
            <img
              src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Interviews
            </h3>
            <p className="text-4xl font-bold mt-3">12</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold text-gray-700">
              Success Score
            </h3>
            <p className="text-4xl font-bold mt-3">82%</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold text-gray-700">
              Streak Days
            </h3>
            <p className="text-4xl font-bold mt-3">5</p>
          </div>

        </div>

        {/* CTA Section */}
        <div className="mt-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-10 rounded-2xl shadow-lg text-white flex flex-col md:flex-row items-center justify-between">

            <div>
              <h2 className="text-3xl font-bold mb-2">Ready for your next interview?</h2>
              <p className="text-white/90 text-lg">
                Practice real interview questions with AI and get instant feedback.
              </p>
            </div>

            <button
              onClick={() => navigate("/interview")}
              className="mt-6 md:mt-0 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Start Interview →
            </button>

          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Recent Attempts</h2>

          <div className="bg-white p-6 rounded-xl shadow">
            <ul className="space-y-3 text-gray-600">
              <li className="flex justify-between">
                <span>DSA Mock Interview</span> <span>Score: 85%</span>
              </li>
              <li className="flex justify-between">
                <span>System Design Basics</span> <span>Score: 72%</span>
              </li>
              <li className="flex justify-between">
                <span>HR Interview Practice</span> <span>Score: 90%</span>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}