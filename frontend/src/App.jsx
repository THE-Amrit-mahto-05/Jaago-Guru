import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Subjects from "./pages/Subjects"
import QuizMode from "./pages/QuizMode"
import ProtectedRoute from "./components/ProtectedRoute"
import StartInterview from "./pages/Interview"
import InterviewSession from "./pages/InterviewSession"
import InterviewSummary from "./pages/InterviewSummary"


function App() {
 return (
   <BrowserRouter>
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
             <InterviewSession/>
           </ProtectedRoute>
         }
       />

       <Route
         path="/interview/:id/summary"
         element={
           <ProtectedRoute>
             <InterviewSummary/>
           </ProtectedRoute>
         }
       />

     </Routes>
   </BrowserRouter>
 );
}

export default App;