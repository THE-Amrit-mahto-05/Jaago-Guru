import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard");
      }
    }, [navigate])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await api.post("/auth/register", form)
      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans text-neutral-900">
       <style>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, #e5e5e5 1px, transparent 1px),
                            linear-gradient(to bottom, #e5e5e5 1px, transparent 1px);
        }
      `}</style>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-10">
            <button  
                onClick={() => navigate("/")}
                className="group inline-flex items-center gap-2 hover:opacity-80 transition-opacity" 
            >
                <div className="w-6 h-6 bg-neutral-900 rounded-sm flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M3.343 19.05l.707-.707m16.598-.014l-.707.707M6.637 4.636l.707.707M9 21h6" />
                    </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-neutral-900">
                  InterviewMate
                </span>
            </button>
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-200 p-8 rounded-sm shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">Create Account</h2>
                <p className="text-neutral-500 text-sm">Start your interview preparation journey today.</p> 
            </div>

            {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-2 border-red-500 rounded-r-sm">
                <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>    
            </div> )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                <label className="block text-neutral-900 font-bold mb-2 text-xs uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors text-neutral-900 placeholder:text-neutral-400"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-neutral-900 font-bold mb-2 text-xs uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                        <input
                            required
                            type="email"
                            placeholder="name@company.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors text-neutral-900 placeholder:text-neutral-400"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-neutral-900 font-bold mb-2 text-xs uppercase tracking-wider">Password</label>
                    <div className="relative">
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors text-neutral-900 placeholder:text-neutral-400"
                        />
                    </div>
                    <p className="mt-2 text-[10px] uppercase tracking-wide text-neutral-400 font-bold">
                        Must be at least 6 characters
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-neutral-900 text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                {loading ? (
                    <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                    </>
                ) : (
                    <>
                    Sign Up
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    </>
                )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                <p className="text-neutral-500 text-sm">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-neutral-900 font-bold hover:underline transition-all ml-1"
                >
                    Sign in
                </button>
                </p>
            </div>
        </div>

        <div className="text-center mt-8">
            <button
                onClick={() => navigate("/")}
                className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest font-bold inline-flex items-center gap-2"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </button>
        </div>
      </div>
    </div>
  );
}