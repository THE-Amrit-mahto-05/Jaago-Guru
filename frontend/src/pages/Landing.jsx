import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../api"
import {
  Mic,
  BarChart3,
  LibraryBig,
  Zap,
  Target,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export default function Landing() {
  const [user, setUser] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return

    api.get("/auth/profile")
      .then(res => setUser(res.data.user))
      .catch(() => localStorage.removeItem("token"));
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
    else navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        .ticker-track {
          display: flex;
          width: max-content;
        }
        /* Grid Background Pattern */
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, #e5e5e5 1px, transparent 1px),
                            linear-gradient(to bottom, #e5e5e5 1px, transparent 1px);
        }
      `}</style>

      {/* Navbar: Utilitarian, Solid, Bordered */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-200 border-b border-neutral-200 ${scrollY > 20 ? 'bg-[#FDFCF8]/95 backdrop-blur-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 bg-neutral-900 rounded-sm flex items-center justify-center">
              <BrainCircuit className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-900">
              InterviewMate
            </span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 bg-neutral-900 text-white text-sm font-medium rounded-sm hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  onMouseEnter={() => import("./Login")}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  onMouseEnter={() => import("./SignUp")}
                  className="px-5 py-2 border border-neutral-900 text-neutral-900 text-sm font-bold rounded-sm hover:bg-neutral-900 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  Sign up free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section: Editorial Layout */}
      <section className="relative pt-32 pb-24 border-b border-neutral-200">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] z-0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 pt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-mono text-neutral-600 uppercase tracking-wider">AI Interview Practice Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-semibold tracking-tighter text-neutral-900 mb-8 leading-[1.1]">
                Practice smarter. <br />
                <span className="text-neutral-500">Perform better.</span>
              </h1>

              <p className="text-xl text-neutral-600 mb-10 max-w-xl leading-relaxed font-light border-l-2 border-neutral-300 pl-6">
                Practice technical, behavioral, and system design interviews with instant AI feedback to improve every attempt.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-neutral-900 text-white rounded-sm font-medium text-lg hover:bg-neutral-800 transition-colors flex items-center gap-3 group cursor-pointer"
                >
                  Start Practicing Now
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                        style={{ backgroundColor: `hsl(${i * 90}, 35%, 55%)` }}
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-neutral-500">Used by engineers at FAANG</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex items-center justify-center">
              {/* Bigger Preview Card */}
              <div className="relative w-full max-w-xl border border-neutral-200 bg-white shadow-md rounded-sm overflow-hidden">
                <img
                  src="/screenshot.png"
                  alt="InterviewMate Dashboard Preview"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Feedback Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-neutral-200 p-4 shadow-sm z-20 rounded-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-600"/>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase font-mono">Feedback Speed</p>
                    <p className="text-lg font-bold text-neutral-900">Instant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 border-b border-neutral-200 pb-12">
             <div className="max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Everything You Need to Prepare</h2>
                <p className="mt-4 text-neutral-600">Tools designed to help you practice and improve in real interview scenarios.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { 
                icon: Mic, 
                title: "Voice Analysis", 
                desc: "Get feedback on your speaking pace, clarity, and confidence." 
              },
              { 
                icon: BarChart3, 
                title: "Progress Tracking", 
                desc: "See how your skills improve over time with detailed charts." 
              },
              { 
                icon: BookOpen, 
                title: "Technical Quizzes", 
                desc: "Test your knowledge with topic-specific multiple choice questions." 
              },
              { 
                icon: LibraryBig, 
                title: "Question Bank", 
                desc: "Access 500+ real interview questions from top companies." 
              },
              { 
                icon: Zap, 
                title: "Instant Feedback", 
                desc: "Receive immediate tips on how to improve your answers." 
              },
              { 
                icon: Target, 
                title: "Mock Interviews", 
                desc: "Simulate real interviews to get used to the pressure." 
              },
            ].map((item, i) => (
              <div key={i} className="group flex flex-col items-start p-6 border border-neutral-200 hover:border-neutral-900 transition-colors duration-300 bg-neutral-50/50">
                <div className="mb-6 p-2 bg-white border border-neutral-200 rounded-sm text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">{item.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials: The "Ticker Tape" Data Feed */}
      <section className="py-20 border-y border-neutral-200 bg-[#FDFCF8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-500">Success Stories</h2>
          <div className="h-px bg-neutral-200 flex-1 ml-6"></div>
        </div>

        <div className="relative w-full">
          <div className="flex animate-ticker gap-8 w-max hover:[animation-play-state:paused]">
            {(() => {
              const testimonials = [
                { name: "Zeeshan Adeen", role: "Google", text: "Feedback accuracy is remarkably high." },
                { name: "Ankit Singh Yadav", role: "Meta", text: "Mock sessions mirror reality perfectly." },
                { name: "Gaurav Gehlot", role: "Amazon", text: "System design module is top tier." },
                { name: "Aanchal Tiwari", role: "Netflix", text: "Instant coaching loop is effective." },
                { name: "Ankur Singh", role: "Stripe", text: "Strengthened my algorithm intuition." },
                { name: "Pranav Tyagi", role: "Uber", text: "Behavioral prep felt genuinely useful." },
                { name: "Krushn Dayshmookh", role: "OpenAI", text: "Identified weak points immediately." },
                { name: "ShivShakti Sir", role: "Microsoft", text: "Communication analysis is key." },
                { name: "Adhyyan Awasthi", role: "Google", text: "This platform completely changed how I prepare." },
                { name: "Purva Kashid", role: "Meta", text: "Landed my dream job thanks to the practice." },
                { name: "Ishika Sahu", role: "Amazon", text: "The system design questions are well-crafted." },
                { name: "Anshul Johri", role: "Netflix", text: "Like having a personal coach available 24/7." }
              ];
              return [...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="w-80 p-6 bg-white border border-neutral-200 flex-shrink-0 flex flex-col justify-between h-48">
                  <p className="text-neutral-800 font-serif italic text-lg leading-snug">"{t.text}"</p>
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-neutral-900 text-xs uppercase tracking-wide">{t.name}</p>
                      <p className="text-neutral-500 text-xs font-mono mt-1">Engineer @ {t.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => <div key={j} className="w-1 h-1 bg-neutral-900 rounded-full"></div>)}
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* CTA: High Contrast, Minimal */}
      <section className="py-32 bg-neutral-900 text-white relative overflow-hidden">
        {/* Abstract lines */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <svg width="100%" height="100%">
              <pattern id="lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="1" fill="none"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#lines)"/>
           </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8">
            Ready to land your dream job?
          </h2>
          <p className="text-neutral-400 text-lg mb-12 max-w-2xl mx-auto">
            Join thousands of developers using InterviewMate to master their technical interviews.
          </p>
          <button 
            onClick={handleGetStarted} 
            className="px-10 py-5 bg-white text-neutral-900 font-bold text-lg hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 cursor-pointer"
          > 
            Start Free Practice
            <ArrowRight size={20}/>
          </button>
        </div>
      </section>

      {/* Footer: Simple, Clean */}
      <footer className="bg-[#FDFCF8] py-12 border-t border-neutral-200 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-neutral-900 rounded-sm flex items-center justify-center">
              <BrainCircuit className="text-white" size={14} />
            </div>
            <span className="font-bold text-neutral-900 tracking-tight">InterviewMate</span>
          </div>
          
          <div className="text-neutral-500 font-mono">
            © {new Date().getFullYear()} InterviewMate. All rights reserved.
          </div>
          
          <div className="flex gap-8">
            <a href="https://github.com/THE-Amrit-mahto-05/Jaago-Guru" className="text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-wider text-xs font-bold">GitHub</a>
            <a href="https://www.linkedin.com/feed/" className="text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-wider text-xs font-bold">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
