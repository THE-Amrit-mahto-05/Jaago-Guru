import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Briefcase, TrendingUp, Hash, FileText, ArrowRight } from "lucide-react"
import api from "../api"
import Sidebar from "../components/sidebar"

export default function StartInterview() {
  const navigate = useNavigate()

  // dropdown states
  const [role, setRole] = useState("")
  const [experience, setExperience] = useState("")
  const [count, setCount] = useState(5)
  const [open, setOpen] = useState(false)

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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="text-white" size={28} strokeWidth={2} />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Mock Interview Setup
                </h1>
                <p className="text-slate-600 mt-1 text-lg">
                  Configure your interview parameters
                </p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="text-blue-600" size={20} />
                </div>
                <h3 className="font-semibold text-slate-900">Role-Specific</h3>
              </div>
              <p className="text-sm text-slate-600">Questions tailored to your target position</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <h3 className="font-semibold text-slate-900">Level-Matched</h3>
              </div>
              <p className="text-sm text-slate-600">Difficulty suited to your experience</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Hash className="text-blue-600" size={20} />
                </div>
                <h3 className="font-semibold text-slate-900">Customizable</h3>
              </div>
              <p className="text-sm text-slate-600">Set your preferred question count</p>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Interview Configuration
            </h2>

            <div className="space-y-6">

              <div className="relative w-full">
                <label className="block mb-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Job Role
                </label>

                <div
                  onClick={() => setOpen(!open)}
                  className={`
                    bg-gradient-to-br from-white to-blue-50/30 p-4 rounded-xl border-2 
                    ${open ? 'border-blue-500 shadow-lg' : 'border-slate-200'}
                    cursor-pointer transition-all duration-200
                    flex justify-between items-center
                    hover:border-blue-300
                  `}
                >
                  <span className={`font-medium ${role ? 'text-slate-800' : 'text-slate-400'}`}>
                    {role || "Select your target job role..."}
                  </span>

                  <svg
                    className={`w-5 h-5 text-blue-600 transition-transform duration-200 ${open ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {open && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {jobRoles.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setRole(item);
                          setOpen(false);
                        }}
                        className={`
                          px-4 py-3 cursor-pointer font-medium transition-all
                          ${role === item
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                          }
                        `}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience Level */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Experience Level
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {experienceLevels.map((lvl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setExperience(lvl)}
                      className={`p-3 rounded-lg font-semibold transition-colors border-2 ${experience === lvl
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Number of Questions
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={3}
                    max={12}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${((count - 3) / 9) * 100}%, rgb(226, 232, 240) ${((count - 3) / 9) * 100}%, rgb(226, 232, 240) 100%)`
                    }}
                  />
                  <div className="w-16 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{count}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Select between 3 to 12 questions
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleStart}
                disabled={loading}
                className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2 ${loading
                    ? "bg-slate-300 cursor-not-allowed text-slate-500"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Starting Interview...
                  </>
                ) : (
                  <>
                    Start Interview
                    <ArrowRight size={20} />
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