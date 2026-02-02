import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Briefcase, TrendingUp, Hash, FileText, ArrowRight, Terminal, Cpu } from "lucide-react"
import api from "../api"
import Sidebar from "../components/sidebar"

export default function StartInterview() {
  const navigate = useNavigate()

  const [role, setRole] = useState("")
  const [experience, setExperience] = useState("")
  const [count, setCount] = useState(5)
  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const jobRoles = [
    "Frontend Developer (React)",
    "Frontend Developer (Next.js)",
    "Backend Developer (Node.js)",
    "Full Stack Developer (MERN)",
    "Technical Interview – DSA",
    "UI Developer",
    "API Engineer",
    "React Native Developer",
    "Data Analyst",
    "Data Scientist",
    "Flutter Developer",
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
      setError("Failed to start interview. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FDFCF8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto h-screen relative">
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
             style={{
                backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
             }}>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="mb-10 border-b border-neutral-200 pb-6 flex items-center gap-4">
             <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center rounded-sm shadow-sm">
                <FileText className="text-white" size={20} strokeWidth={1.5} />
             </div>
             <div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-neutral-900 rounded-full animate-pulse"></span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Configuration Mode</p>
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Interview Setup</h1>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left Column: Info Cards */}
             <div className="space-y-4 lg:col-span-1">
                <div className="bg-white border border-neutral-200 p-6 shadow-sm">
                   <div className="flex items-center gap-3 mb-3 text-neutral-900">
                      <Briefcase size={18} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Role Specific</h3>
                   </div>
                   <p className="text-xs text-neutral-500 leading-relaxed">
                      Questions are generated based on the role you choose.
                   </p>
                </div>

                <div className="bg-white border border-neutral-200 p-6 shadow-sm">
                   <div className="flex items-center gap-3 mb-3 text-neutral-900">
                      <TrendingUp size={18} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Difficulty Level</h3>
                   </div>
                   <p className="text-xs text-neutral-500 leading-relaxed">
                      Complexity scales according to the selected seniority tier (Intern to Senior).
                   </p>
                </div>

                <div className="bg-white border border-neutral-200 p-6 shadow-sm">
                   <div className="flex items-center gap-3 mb-3 text-neutral-900">
                      <Hash size={18} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Number of Questions</h3>
                   </div>
                   <p className="text-xs text-neutral-500 leading-relaxed">
                      Choose how many questions you want in this interview.
                   </p>
                </div>
             </div>

             {/* Right Column: Form */}
             <div className="lg:col-span-2">
                <div className="bg-white border border-neutral-200 shadow-sm p-8 relative">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Cpu size={64} strokeWidth={1} />
                   </div>
                   
                   <h2 className="text-lg font-bold text-neutral-900 mb-8 flex items-center gap-2">
                      <Terminal size={18} />
                      INTERVIEW CONFIGURATION
                   </h2>

                   <div className="space-y-8">
                      {/* Job Role Dropdown */}
                      <div className="relative w-full">
                         <label className="block mb-3 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                            Job Role
                         </label>
                         <div 
                            onClick={() => setOpen(!open)}
                            className={`w-full bg-neutral-50 border p-4 cursor-pointer transition-all duration-200 flex justify-between items-center hover:bg-white
                            ${open ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-400'}`} 
                         >
                            <span className={`text-sm font-medium ${role ? 'text-neutral-900' : 'text-neutral-400'}`}>
                               {role || "Select Role..."}
                            </span>
                            <svg className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg> 
                         </div>

                         {open && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 shadow-xl z-50 max-h-60 overflow-y-auto">
                               {jobRoles.map((item, idx) => ( 
                                  <div 
                                     key={idx} 
                                     onClick={() => {setRole(item); setOpen(false);}}
                                     className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors border-b border-neutral-100 last:border-0
                                     ${role === item ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-50'}`} 
                                  >
                                     {item}
                                  </div>
                               ))}
                            </div> 
                         )}
                      </div>

                      {/* Experience Level */}
                      <div>
                         <label className="block mb-3 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                            Experience Level
                         </label>
                         <div className="grid grid-cols-4 gap-2">
                            {experienceLevels.map((lvl, i) => (
                               <button
                                  type="button"
                                  key={i}
                                  onClick={() => setExperience(lvl)}
                                  className={`py-3 px-2 text-sm font-bold uppercase tracking-wider transition-all border
                                  ${experience === lvl
                                     ? "bg-neutral-900 text-white border-neutral-900"
                                     : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 cursor-pointer"
                                  }`}
                               >
                                  {lvl}
                               </button>
                            ))}
                         </div>
                      </div>

                      {/* Question Count Slider */}
                      <div>
                         <label className="block mb-3 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                            Number of Questions
                         </label>
                         <div className="flex items-center gap-6 bg-neutral-50 p-4 border border-neutral-200">
                            <input
                               type="range"
                               min={3}
                               max={12}
                               value={count}
                               onChange={(e) => setCount(Number(e.target.value))}
                               className="flex-1 h-1 bg-neutral-200 rounded-none appearance-none cursor-pointer accent-neutral-900"
                            />
                            <div className="w-12 h-12 bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                               <span className="text-lg font-bold text-neutral-900 font-mono">{count}</span>
                            </div>
                         </div>
                         <p className="text-[10px] text-neutral-400 mt-2 font-mono text-right">
                            RANGE: 03 - 12
                         </p>
                      </div>

                      {/* Error & Action */}
                      {error && (
                         <div className="bg-red-50 border-l-2 border-red-500 p-4">
                            <p className="text-red-700 font-medium text-xs font-mono uppercase">{error}</p>
                         </div>
                      )}

                      <button
                         onClick={handleStart}
                         disabled={loading}
                         className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 border
                         ${loading
                            ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                            : "bg-neutral-900 text-white border-neutral-900 hover:bg-white hover:text-neutral-900 cursor-pointer"
                         }`}
                      >
                         {loading ? (
                            <>
                               <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                               STARTING INTERVIEW...
                            </>
                         ) : (
                            <>
                               START INTERVIEW
                               <ArrowRight size={16} />
                            </>
                         )}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}