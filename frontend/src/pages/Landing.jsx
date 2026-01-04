import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../api"
import {
  Mic,
  BarChart3,
  LibraryBig,
  Zap,
  Clapperboard,
  Target,
  BrainCircuit,
  ArrowRight,
  Star
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.3),
                        0 0 40px rgba(139, 92, 246, 0.2),
                        0 20px 60px rgba(0, 0, 0, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.5),
                        0 0 60px rgba(139, 92, 246, 0.3),
                        0 25px 80px rgba(0, 0, 0, 0.15);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        }
        .animate-scroll {
          animation: scroll-left 25s linear infinite;
        }
        .scroll-track {
          display: flex;
          width: max-content;
        }
        .hero-image-wrapper {
          animation: float 6s ease-in-out infinite;
        }
        .hero-image-inner {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 20 ? 'glass-nav py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">AI Prep</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  onMouseEnter={() => import("./Login")}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:text-indigo-600 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  onMouseEnter={() => import("./SignUp")}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Sign up free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
            Master your next interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">AI-powered</span> practice.
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get real-time feedback on your answers, body language, and tone. Practice DSA, System Design, and Behavioral questions anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            >
              Start Practicing Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <div
            className="mt-20 relative max-w-5xl mx-auto hero-image-wrapper"
            style={{
              opacity: Math.min(1, 0.3 + scrollY / 300),
              transform: `scale(${Math.min(1, 0.85 + scrollY / 1000)})`,
            }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 hero-image-inner"></div>
            <div
              className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-700 ease-out"
              style={{
                transform: `translateY(${Math.max(0, 40 - scrollY / 8)}px)`,
              }}
            >
              <img
                src="/screenshot.png"
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Bento Style) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Our platform provides comprehensive tools to help you crack technical and behavioral interviews.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Item */}
            <div className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-indigo-100 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Mic size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <Mic size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Voice Analysis</h3>
                <p className="text-slate-600 text-lg leading-relaxed max-w-md">
                  Our advanced AI analyzes your speech patterns, tone, and clarity to provide actionable feedback on your communication skills.
                </p>
              </div>
            </div>

            {/* Tall Item */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Deep Analytics</h3>
                <p className="text-slate-300 leading-relaxed mb-8">
                  Track your progress over time with detailed charts and performance metrics.
                </p>
                <div className="mt-auto">
                  <div className="flex items-end gap-2 mb-2">
                    <div className="w-8 h-12 bg-indigo-500 rounded-t-lg opacity-50"></div>
                    <div className="w-8 h-16 bg-indigo-500 rounded-t-lg opacity-75"></div>
                    <div className="w-8 h-24 bg-indigo-500 rounded-t-lg"></div>
                  </div>
                  <div className="h-px bg-white/20 w-full"></div>
                </div>
              </div>
            </div>

            {/* Standard Items */}
            {[
              { title: "Question Bank", desc: "500+ curated questions across all topics.", icon: <LibraryBig size={24} />, color: "bg-blue-100 text-blue-600" },
              { title: "Instant Feedback", desc: "Get detailed feedback within seconds.", icon: <Zap size={24} />, color: "bg-yellow-100 text-yellow-600" },
              { title: "Mock Interviews", desc: "Realistic simulations of actual interviews.", icon: <Target size={24} />, color: "bg-green-100 text-green-600" },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-indigo-100 transition-colors group">
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Loved by developers</h2>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="scroll-track animate-scroll gap-6">
            {(() => {
              const testimonials = [
                { name: "Zeeshan Adeen", role: "Software Engineer at Google", text: "This platform completely changed how I prepare for interviews. The AI feedback is incredibly accurate and helpful." },
                { name: "Ankit Singh Yadav", role: "Senior Developer at Meta", text: "The mock interview sessions feel incredibly realistic. I landed my dream job thanks to the practice I got here." },
                { name: "Gaurav Gehlot", role: "Tech Lead at Amazon", text: "The system design questions are particularly well-crafted. They mirror real interview scenarios perfectly." },
                { name: "Aanchal Tiwari", role: "Full Stack Engineer at Netflix", text: "I love the instant feedback feature. It's like having a personal interview coach available 24/7." },
                { name: "Ankur Singh", role: "Backend Engineer at Stripe", text: "The DSA practice module helped me strengthen my algorithm skills significantly. Highly recommend!" },
                { name: "Pranav Tyagi", role: "Frontend Developer at Uber", text: "The behavioral question practice was a game-changer. I felt so much more confident in my interviews." },
                { name: "Krushn Dayshmookh", role: "ML Engineer at OpenAI", text: "Outstanding platform! The AI analysis of my responses helped me identify and fix my weak points quickly." },
                { name: "ShivShakti Sir", role: "DevOps Engineer at Microsoft", text: "The voice analysis feature is incredible. It helped me improve my communication skills tremendously." },
                { name: "Adhyyan Awasthi", role: "Software Engineer at Google", text: "This platform completely changed how I prepare for interviews. The AI feedback is incredibly accurate and helpful." },
                { name: "Purva Khasid", role: "Senior Developer at Meta", text: "The mock interview sessions feel incredibly realistic. I landed my dream job thanks to the practice I got here." },
                { name: "Ishika Sahu", role: "Tech Lead at Amazon", text: "The system design questions are particularly well-crafted. They mirror real interview scenarios perfectly." },
                { name: "Anshul Jhori", role: "Full Stack Engineer at Netflix", text: "I love the instant feedback feature. It's like having a personal interview coach available 24/7." },
              ];
              return [...testimonials, ...testimonials].map((testimonial, i) => (
                <div key={i} className="w-96 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
                  <div className="flex gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random&color=fff`}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{testimonial.name}</p>
                      <p className="text-slate-500 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* CTA & Footer */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-indigo-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to land your dream job?</h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of developers who are using AI Prep to master their technical interviews.</p>
              <button onClick={handleGetStarted} className="px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300" > Get Started for Free </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <span className="text-lg font-bold text-slate-900">AI Prep</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AI Prep. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">GitHub</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
