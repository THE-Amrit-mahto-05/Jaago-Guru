import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './sign.css';

export default function Signin() {
  return (
    <div className="signin-container">
      <header className="navbar">
        <h1 className="logo">Jaago<span> GURU</span></h1>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="login-btn">Login / Sign Up</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <main className="signin-content">
        <div className="text-section">
          <div className="ai-badge">AI Powered</div>
          <h2>
            Ace Interviews with <span className="highlight">AI-Powered Learning</span>
          </h2>
          <p>
            Get role-specific questions, expand answers when you need them, dive deeper into
            concepts, and organize your preparation your way. Your ultimate interview toolkit is here.
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="signin-btn">Get Started</button>
            </SignInButton>
          </SignedOut>
        </div>

        <div className="image-section">
          <div className="mockup-card">
            <img src="https://4kwallpapers.com/images/wallpapers/dream-girl-neon-art--20276.jpg" alt="image" />
          </div>
        </div>
      </main>
      <section className="features-section">
        <h2>Features That Make You Shine</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Tailored Just for You</h3>
            <p>Get interview questions and model answers based on your role, experience, and focus areas — no generic practice here.</p>
          </div>
          <div className="feature-card">
            <h3>Learn at Your Own Pace</h3>
            <p>Expand answers only when you’re ready. Dive deeper into any concept instantly with AI-powered explanations.</p>
          </div>
          <div className="feature-card">
            <h3>Capture Your Insights</h3>
            <p>Add personal notes or pin key questions to make your learning more organized and impactful.</p>
          </div>
          <div className="feature-card">
            <h3>Understand the “Why” Behind Answers</h3>
            <p>Go beyond memorization — master concepts with AI-generated deep explanations.</p>
          </div>
          <div className="feature-card">
            <h3>Save, Organize, and Revisit</h3>
            <p>Save your interview sets, organize them neatly, and pick up your preparation right where you left off.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
