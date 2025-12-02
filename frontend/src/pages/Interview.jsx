import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Briefcase, TrendingUp, Hash, Sparkles, ArrowRight } from "lucide-react"
import api from "../api"
import Sidebar from "../components/sidebar"

export default function StartInterview() {
  const navigate = useNavigate()

  // dropdown states
  const [role, setRole] = useState("")
  const [experience, setExperience] = useState("")
  const [count, setCount] = useState(5)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const jobRoles = [
    "Frontend Developer (React)",
    "Frontend Developer (Next.js)",
    "UI Developer",
    "Backend Developer (Node.js)",
    "Full Stack Developer (MERN)",
    "API Engineer",
    "React Native Developer",
    "Flutter Developer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "QA Engineer",
    "Automation Tester",
    "DevOps Engineer",
    "Cloud Engineer"
  ]

  const experienceLevels = ["Intern", "Junior", "Mid", "Senior"]

  const handleStart = async () => {
    if (!role || !experience || !count) {
      setError("Please fill all fields")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await api.post("/interview/start", {
        role,
        experience,
        questionCount: Number(count)
      })

      navigate(`/interview/${res.data.interviewId}`)
    } catch (err) {
      console.error(err)
      setError("Failed to start interview")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.2),
                        0 0 40px rgba(59, 130, 246, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.4),
                        0 0 60px rgba(59, 130, 246, 0.2);
          }
        }
        @keyframes slide-in {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .slide-in {
          animation: slide-in 0.5s ease-out;
        }
        .fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        /* Custom styling for select and input elements */
        select, input[type="number"] {
          transition: all 0.3s ease;
        }
        select:focus, input[type="number"]:focus {
          outline: none;
          border-color: rgb(59, 130, 246);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          transform: translateY(-2px);
        }
        select:hover, input[type="number"]:hover {
          border-color: rgb(147, 197, 253);
        }
      `}</style>

      <Sidebar />

      <div className="flex-1 p-10 fade-in">
        <div className="max-w-4xl mx-auto">

          {/* Header Section */}
          <div className="mb-10 slide-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 animate-float">
                <Sparkles className="text-white" size={32} strokeWidth={2.5} />
              </div>

              <div>
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600">
                  Start Mock Interview
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                  Prepare for success with AI-powered interview practice
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {/* Info Cards */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Role-Specific</h3>
              <p className="text-sm text-slate-600">Tailored questions for your target position</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Level-Matched</h3>
              <p className="text-sm text-slate-600">Questions suited to your experience</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 slide-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Hash className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Customizable</h3>
              <p className="text-sm text-slate-600">Choose the number of questions</p>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 animate-pulse-glow slide-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              Interview Configuration
            </h2>

            <div className="space-y-6">

              {/* Job Role */}
              <div>
                <label className="block mb-3 text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-600" />
                  Job Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-4 pr-12 border-2 border-blue-100 rounded-xl bg-gradient-to-br from-white to-blue-50 text-slate-900 font-semibold focus:border-blue-500 cursor-pointer appearance-none hover:border-blue-200 transition-all duration-300 focus:shadow-lg focus:shadow-blue-100"
                    style={{
                      backgroundImage: role ? 'linear-gradient(to bottom right, #eff6ff, white)' : 'linear-gradient(to bottom right, white, #eff6ff)'
                    }}
                  >
                    <option value="" disabled>Select your target job role...</option>
                    {jobRoles.map((r, idx) => (
                      <option key={idx} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {role && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block mb-3 text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" />
                  Experience Level
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {experienceLevels.map((lvl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setExperience(lvl)}
                      className={`p-4 rounded-xl font-semibold transition-all duration-300 ${experience === lvl
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-100"
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block mb-3 text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <Hash size={18} className="text-blue-600" />
                  Number of Questions
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={3}
                    max={12}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="flex-1 h-3 bg-blue-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${((count - 3) / 9) * 100}%, rgb(219, 234, 254) ${((count - 3) / 9) * 100}%, rgb(219, 234, 254) 100%)`
                    }}
                  />
                  <div className="w-20 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{count}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Choose between 3 to 12 questions
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-red-600 font-semibold">{error}</p>
                </div>
              )}

              <button
                onClick={handleStart}
                disabled={loading}
                className={`w-full py-5 rounded-2xl text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 ${loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Starting Interview...
                  </>
                ) : (
                  <>
                    Start Interview
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}