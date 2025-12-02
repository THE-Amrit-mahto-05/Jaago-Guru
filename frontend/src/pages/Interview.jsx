import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Start Mock Interview
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-xl">
          {/* Job Role */}
          <label className="block mb-2 text-lg font-semibold">Job Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border rounded-lg mb-5"
          >
            <option value="">Select job role...</option>
            {jobRoles.map((r, idx) => (
              <option key={idx} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Experience Level */}
          <label className="block mb-2 text-lg font-semibold">
            Experience Level
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full p-3 border rounded-lg mb-5"
          >
            <option value="">Choose experience level...</option>
            {experienceLevels.map((lvl, i) => (
              <option key={i} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          {/* Number of Questions */}
          <label className="block mb-2 text-lg font-semibold">
            Number of Questions
          </label>
          <input
            type="number"
            min={3}
            max={12}
            value={count}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 3) setCount(3)
              else if (val > 12) setCount(12)
              else setCount(val)
            }}
            className="w-full p-3 border rounded-lg mb-5"
          />

          {error && <p className="text-red-500 mb-3 font-medium">{error}</p>}

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}