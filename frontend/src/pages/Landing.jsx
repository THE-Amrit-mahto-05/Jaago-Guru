import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import api from "../api"
import {
  Mic,
  BarChart3,
  LibraryBig,
  Zap,
  Clapperboard,
  Target
} from "lucide-react";

export default function Landing() {
  const [user, setUser] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroImageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return

    api.get("/auth/profile")
    .then(res => setUser(res.data.user))
    .catch(() => {
      localStorage.removeItem("token")
    });
  }, []);

  // Mouse tracking and scroll effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleGetStarted = () => {
    const token = localStorage.getItem("token")
    if (token){
        navigate("/dashboard")
    }
    else{
        navigate("/signup")
    }
  };

  // Calculate 3D tilt based on scroll (starts tilted, becomes flat)
  const heroImageTransform = () => {
    const maxScroll = 600;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Start with more dramatic tilt, flatten on scroll
    const rotateX = 35 - (scrollProgress * 35);
    const scale = 0.85 + (scrollProgress * 0.15);
    const translateY = scrollProgress * -30;
    
    return {
      transform: `perspective(1200px) rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`,
      transition: 'transform 0.1s ease-out'
    };
  };

  // Mouse parallax effect
  const mouseParallax = (speed = 20) => {
    const x = (mousePos.x - window.innerWidth / 2) / speed;
    const y = (mousePos.y - window.innerHeight / 2) / speed;
    return { transform: `translate(${x}px, ${y}px)` };
  };

  return (
    <>
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fadeInUp-1 { animation: fadeInUp 0.6s ease-out 0s backwards; }
        .animate-fadeInUp-2 { animation: fadeInUp 0.6s ease-out 0.2s backwards; }
        .animate-fadeInUp-3 { animation: fadeInUp 0.6s ease-out 0.4s backwards; }
      `}</style>

      <div className="relative min-h-screen overflow-hidden">
        {/* Animated gradient background that follows mouse */}
        <div 
          className="fixed inset-0 z-0 opacity-60 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`,
            transition: 'background 0.3s ease'
          }}
        />
        
        {/* Floating animated orbs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            style={{
              top: '20%',
              left: '10%',
              animation: 'blob 7s infinite'
            }}
          />
          <div 
            className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            style={{
              top: '40%',
              right: '10%',
              animation: 'blob 7s infinite 2s'
            }}
          />
          <div 
            className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            style={{
              bottom: '20%',
              left: '30%',
              animation: 'blob 7s infinite 4s'
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Navbar with glassmorphism */}
          <nav className="flex items-center justify-between px-10 py-6 backdrop-blur-md bg-white/70 shadow-lg sticky top-0 z-50 border-b border-white/20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              AI Interview Prep
            </h1>

            {user ? (
              <div className="flex gap-4 items-center">
                <p className="font-medium text-gray-700">Hello, {user.email}</p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>

          {/* HERO SECTION */}
          <section className="flex flex-col items-center justify-center px-6 lg:px-20 py-20 min-h-screen relative text-center">
            {/* Animated background grid */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none" 
              style={{
                backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                transform: `translate(${mousePos.x / 100}px, ${mousePos.y / 100}px)`
              }} 
            />

            {/* Text Section - Centered */}
            <div className="max-w-5xl mx-auto space-y-6 z-10 mb-12" style={mouseParallax(50)}>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                AI-Enhanced Preparation for{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-transparent bg-clip-text animate-gradient">
                    Career-Defining Moments
                  </span>
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
                </span>
              </h1>

              <p className="text-gray-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Advance your career with personalized guidance, interview prep, and AI-powered tools for job success. Practice with intelligent mock interviews and get real-time feedback.
              </p>

              <div className="flex gap-4 justify-center items-center pt-4">
                <button
                  onClick={handleGetStarted}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

              </div>
            </div>

            {/* Hero Image - Full Width, Centered with 3D tilt effect */}
            <div className="w-full max-w-6xl mx-auto relative z-10 px-4" style={mouseParallax(30)}>
              <div 
                ref={heroImageRef}
                className="relative w-full"
                style={heroImageTransform()}
              >
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl blur-3xl opacity-30 scale-105"></div>
                
                {/* Main hero image container */}
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden border border-white/10">
                  <img
                    src="https://www.salesforce.com/blog/wp-content/uploads/sites/2/2025/04/360-Blog_-Can-You-SPEAK-AI_-Build-an-Effective-Prompt-Framework.png?w=889"
                    alt="AI Interview Platform"
                    className="w-full h-auto"
                  />
                  
                  {/* Overlay gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
                </div>

                {/* Floating elements for visual interest */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500 rounded-full blur-2xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Stats below hero image */}
            <div className="flex flex-wrap gap-8 lg:gap-16 justify-center pt-16 z-10">
              {[
                { num: "500+", label: "Practice Questions" },
                { num: "10k+", label: "Active Users" },
                { num: "95%", label: "Success Rate" },
                { num: "24/7", label: "AI Support" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    {stat.num}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="bg-white/50 backdrop-blur-sm py-20 px-10 text-center relative">
            <div className="max-w-xl mx-auto mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                How It Works
              </h2>
              <p className="text-gray-600 text-lg">Three simple steps to transform your interview performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {[
                {
                  img: "https://illustrations.popsy.co/blue/woman-on-laptop-google.svg",
                  title: "Choose Your Path",
                  desc: "Select from DSA, System Design, HR, Machine Learning, or customize your own interview experience.",
                  animClass: "animate-fadeInUp-1",
                },
                {
                  img: "https://illustrations.popsy.co/blue/communication.svg",
                  title: "Practice with AI",
                  desc: "Engage in realistic conversations with our advanced AI interviewer that adapts to your skill level.",
                  animClass: "animate-fadeInUp-2",
                },
                {
                  img: "https://illustrations.popsy.co/blue/finance-growth.svg",
                  title: "Get Insights",
                  desc: "Receive detailed performance analytics, personalized feedback, and actionable improvement tips.",
                  animClass: "animate-fadeInUp-3",
                }
              ].map((step, i) => (
                <div
                  key={i}
                  className={`group p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden ${step.animClass}`}
                >
                  {/* Number badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {i + 1}
                  </div>

                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={step.img}
                      className="w-32 mx-auto"
                      alt={step.title}
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <section className="py-20 px-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent"></div>
            
            <div className="max-w-xl mx-auto mb-16 relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Powerful Features
              </h2>
              <p className="text-gray-600 text-lg">Everything you need to land your dream job</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
              {[
                {
                  title: "AI-Powered Mock Interviews",
                  desc: "Experience realistic interview scenarios with our advanced AI that adapts to your responses in real-time.",
                  gradient: "from-blue-500 to-cyan-500",
                  icon: <Mic className="w-8 h-8 text-cyan-400" />
                },
                {
                  title: "Detailed Performance Analytics",
                  desc: "Track your progress with comprehensive reports highlighting strengths, weaknesses, and growth areas.",
                  gradient: "from-purple-500 to-pink-500",
                  icon: <BarChart3 className="w-8 h-8 text-pink-400" />
                },
                {
                  title: "500+ Practice Questions",
                  desc: "Master DSA, DBMS, OOP, System Design, and more with our extensive question bank.",
                  gradient: "from-orange-500 to-red-500",
                  icon: <LibraryBig className="w-8 h-8 text-orange-400" />
                },
                {
                  title: "Real-time Feedback",
                  desc: "Get instant, actionable feedback on your answers to improve faster than ever before.",
                  gradient: "from-green-500 to-teal-500",
                  icon: <Zap className="w-8 h-8 text-teal-400" />
                },
                {
                  title: "Interview Recording",
                  desc: "Review your performance with full session recordings and detailed transcripts.",
                  gradient: "from-indigo-500 to-purple-500",
                  icon: <Clapperboard className="w-8 h-8 text-indigo-400" />
                },
                {
                  title: "Personalized Learning Path",
                  desc: "AI-curated practice plans tailored to your skill level and career goals.",
                  gradient: "from-pink-500 to-rose-500",
                  icon: <Target className="w-8 h-8 text-rose-400" />
                }
              ].map((f, i) => (
                <div
                  key={i}
                  className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${f.gradient} transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300`}></div>
                  
                  <div className="flex justify-center text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 relative z-10">
                    {f.title}
                  </h3>
                  <p className="text-gray-600 relative z-10 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-center relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-20" 
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            ></div>
            
            <h2 className="text-4xl font-bold mb-6 text-white relative z-10">
              Ready to Start Your AI-Powered Interview Journey?
            </h2>
            <p className="text-white/90 mb-8 text-lg relative z-10">Join thousands of successful candidates</p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative z-10"
            >
              Get Started Now →
            </button>
          </section>

          {/* FOOTER */}
          <footer className="bg-gray-900 text-white py-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent"></div>
            <p className="relative z-10">© {new Date().getFullYear()} AI Interview Prep. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
}