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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">AI Interview Prep</h1>

        {user ? (
        // If logged in, show profile / dashboard link
        <div className="flex gap-4 items-center">
          <p className="font-medium">Hello, {user.email}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        // If not logged in, show login/signup
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>
      )}
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row items-center px-10 lg:px-20 py-20">
        {/* Text Section */}
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Ace Your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Tech Interviews
            </span>{" "}
            with AI
          </h1>

          <p className="text-gray-600 text-lg max-w-xl">
            Practice unlimited mock interviews with AI, get instant feedback,
            and improve your confidence to crack your next dream job.
          </p>

          <button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition w-fit"
          >
            Get Started →
          </button>
        </div>

        {/* Hero Image / Illustration */}
        <div className="flex-1 flex justify-center mt-10 lg:mt-0">
          <img
            src="https://illustrations.popsy.co/blue/web-design.svg"
            alt="Interview Illustration"
            className="w-3/4 lg:w-2/3"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20 px-10 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="p-6 bg-gray-100 rounded-xl shadow-sm">
            <img
              src="https://illustrations.popsy.co/blue/woman-on-laptop-google.svg"
              className="w-24 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">1. Choose Interview Type</h3>
            <p className="text-gray-600">
              Pick interviews like DSA, HR, ML, or System Design to begin.
            </p>
          </div>

          <div className="p-6 bg-gray-100 rounded-xl shadow-sm">
            <img
              src="https://illustrations.popsy.co/blue/communication.svg"
              className="w-24 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">2. Answer AI Questions</h3>
            <p className="text-gray-600">
              Your AI interviewer asks questions and evaluates your responses.
            </p>
          </div>

          <div className="p-6 bg-gray-100 rounded-xl shadow-sm">
            <img
              src="https://illustrations.popsy.co/blue/finance-growth.svg"
              className="w-24 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">3. Get Instant Feedback</h3>
            <p className="text-gray-600">
              Receive detailed scoring and improvement suggestions.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-10 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-14">Powerful Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "AI Mock Interviews",
              desc: "Simulate real interviews with intelligent AI.",
            },
            {
              title: "Detailed Performance Reports",
              desc: "Understand your strengths & weaknesses instantly.",
            },
            {
              title: "Practice 500+ Questions",
              desc: "DSA, DBMS, OOP, System Design & more.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 bg-white shadow-lg rounded-xl border hover:scale-[1.02] transition"
            >
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Start Your AI-Powered Interview Journey?
        </h2>
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Get Started Now →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>© {new Date().getFullYear()} AI Interview Prep. All rights reserved.</p>
      </footer>
    </div>
  );
}
