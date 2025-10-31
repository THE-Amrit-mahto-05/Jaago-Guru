import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './sign.css';

export default function Signin() {
  return (
    <div className="signin-container">
      <header className="navbar">
        <h1 className="logo">Jaago<span> GURU</span></h1>
      </header>

      <main className="signin-content">
        <div className="text-section">
          <h2>Level Up Your Interview Game</h2>
          <p>
            Practice real interviews with AI feedback.  
            Boost your confidence and ace your next opportunity.
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="signin-btn">Sign In to Get Started</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </main>
    </div>
  );
 }
