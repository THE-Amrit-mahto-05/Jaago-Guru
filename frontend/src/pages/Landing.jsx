import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../api"

export default function Landing() {
  const [user, setUser] = useState(null);
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

  const handleGetStarted = () => {
    const token = localStorage.getItem("token")
    if (token){
        navigate("/dashboard")
    }
    else{
        navigate("/signup")
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Navbar */}
      <nav className="backdrop-blur-sm bg-white/80 border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            AI Interview Prep
          </h1>

          {user ? (
            <div className="flex gap-3 items-center">
              <p className="text-sm text-gray-600 hidden sm:block">
                Welcome, <span className="font-semibold text-gray-900">{user.email}</span>
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Dashboard
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full">
              <span className="text-sm font-medium text-blue-700">AI-Powered Practice</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Ace Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Tech Interviews
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Practice unlimited mock interviews with AI, get instant feedback, and build the confidence you need to land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-600">Users</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">4.9★</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-2xl opacity-20"></div>
            <img
              src="https://illustrations.popsy.co/blue/web-design.svg"
              alt="Interview Illustration"
              className="relative w-full rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and transform your interview preparation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "https://illustrations.popsy.co/blue/woman-on-laptop-google.svg",
                step: "01",
                title: "Choose Interview Type",
                desc: "Select from DSA, HR, Machine Learning, System Design, and more specialized tracks."
              },
              {
                img: "https://illustrations.popsy.co/blue/communication.svg",
                step: "02",
                title: "Practice with AI",
                desc: "Answer questions from our intelligent AI interviewer that adapts to your skill level."
              },
              {
                img: "https://illustrations.popsy.co/blue/finance-growth.svg",
                step: "03",
                title: "Get Instant Feedback",
                desc: "Receive detailed performance analysis with personalized improvement suggestions."
              }
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="text-6xl font-bold text-blue-100 mb-4">{item.step}</div>
                  <img src={item.img} className="w-32 h-32 mx-auto mb-6" alt={item.title} />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to excel in technical interviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI Mock Interviews",
                desc: "Realistic interview simulations powered by advanced AI that mimics real interviewer behavior."
              },
              {
                icon: "📊",
                title: "Performance Analytics",
                desc: "Comprehensive reports showing your strengths, weaknesses, and progress over time."
              },
              {
                icon: "📚",
                title: "500+ Questions",
                desc: "Extensive question bank covering DSA, DBMS, OOP, System Design, and more."
              },
              {
                icon: "⚡",
                title: "Instant Feedback",
                desc: "Get real-time evaluation and suggestions to improve your answers immediately."
              },
              {
                icon: "🎯",
                title: "Personalized Learning",
                desc: "AI adapts to your skill level and focuses on areas that need improvement."
              },
              {
                icon: "🏆",
                title: "Track Progress",
                desc: "Monitor your improvement with detailed metrics and performance trends."
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who have successfully prepared for their dream jobs with AI Interview Prep.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-10 py-5 bg-white text-blue-600 text-lg font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
          >
            Start Practicing Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p className="text-blue-100 mt-6 text-sm">No credit card required • Free to start</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">AI Interview Prep</h3>
              <p className="text-sm">Ace your interviews with AI-powered practice</p>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} AI Interview Prep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}