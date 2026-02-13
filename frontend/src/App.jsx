import { BrowserRouter, Routes, Route } from "react-router-dom"
import React, { Suspense, lazy } from "react"

const Landing = lazy(() => import("./pages/Landing"))
const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/SignUp"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Subjects = lazy(() => import("./pages/Subjects"))
const QuizMode = lazy(() => import("./pages/QuizMode"))
const QuizResults = lazy(() => import("./pages/QuizResults"))
const MyAttempts = lazy(() => import("./pages/MyAttempts"))
const StartInterview = lazy(() => import("./pages/Interview"))
const InterviewSession = lazy(() => import("./pages/InterviewSession"))
const InterviewSummary = lazy(() => import("./pages/InterviewSummary"))
const AIAttempts = lazy(() => import("./pages/AIAttempts"))
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-neutral-900 rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-neutral-900">
                Preparing your workspace
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                This won’t take long
              </p>
            </div>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Subjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/quiz"
            element={
              <ProtectedRoute>
                <QuizMode />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/quiz/results"
            element={
              <ProtectedRoute>
                <QuizResults />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-attempts"
            element={
              <ProtectedRoute>
                <MyAttempts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-attempts/:id"
            element={
              <ProtectedRoute>
                <MyAttempts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/start"
            element={
              <ProtectedRoute>
                <StartInterview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/:id"
            element={
              <ProtectedRoute>
                <InterviewSession />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/:id/summary"
            element={
              <ProtectedRoute>
                <InterviewSummary />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ai-attempts"
            element={
              <ProtectedRoute>
                <AIAttempts />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App