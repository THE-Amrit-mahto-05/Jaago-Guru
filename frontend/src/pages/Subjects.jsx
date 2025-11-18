import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Subjects() {
const [user, setUser] = useState(null);
const navigate = useNavigate();

useEffect(() => {
api.get("/auth/profile")
.then((res) => setUser(res.data.user))
.catch(() => {
localStorage.removeItem("token");
navigate("/login");
});
  }, []);

const logout = () => {
localStorage.removeItem("token");
navigate("/login");
  };

const subjects = [
    { name: "DSA", slug: "dsa", color: "from-blue-500 to-blue-700" },
    { name: "MERN Stack", slug: "mern-stack", color: "from-green-500 to-emerald-700" },
    { name: "System Design", slug: "system-design", color: "from-purple-500 to-purple-700" },
    { name: "HR Interview", slug: "hr", color: "from-pink-500 to-rose-600" },
    { name: "Aptitude", slug: "aptitude", color: "from-yellow-500 to-orange-600" },
  ];

return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
      <div className="p-6 border-b">
      <h2 className="text-2xl font-bold text-blue-600">AI Prep</h2>
      </div>
      <nav className="flex-1 p-6 space-y-4">
      <button onClick={() => navigate("/dashboard")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition" >
        Dashboard
      </button>
      <button onClick={() => navigate("/interview")} className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
        Start Interview
      </button>
      <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition">
        My Attempts
      </button>
      <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition">
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

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <div className="flex items-center gap-3">
        <p className="font-medium text-gray-600">
              {user ? user.email : "Loading..."}
        </p>
        <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
              className="w-10 h-10 rounded-full" />
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <div
              key={s.name}
              onClick={() => navigate(`/interview/topics/${s.slug}`)}
              className={`cursor-pointer p-8 rounded-2xl shadow-xl text-white 
                bg-gradient-to-br ${s.color}
                hover:scale-[1.05] hover:shadow-2xl transition transform`}
            >
              <h2 className="text-2xl font-semibold">{s.name}</h2>
              <p className="opacity-80 mt-2 text-sm">Tap to start practicing</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
