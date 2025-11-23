import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects"; 
import Topics from "./pages/Topics";
import QuizMode from "./pages/QuizMode";
import QuizPage from "./pages/QuizPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
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
          path="/interview/quiz-mode"
          element={
            <ProtectedRoute>
              <QuizMode />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview/quiz"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
