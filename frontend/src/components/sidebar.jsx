import React from 'react'
import { LayoutDashboard, Play, FileText, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ logout }) => { // Accept logout as a prop
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <aside className="h-full w-64 bg-white/80 backdrop-blur-lg shadow-xl hidden md:flex flex-col border-r border-gray-200/50">
        
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Prep
            </h2>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          
          <button
            onClick={() => navigate("/dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium shadow-lg transition-all duration-300
              ${isActive("/dashboard")
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/interview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium shadow-lg transition-all duration-300
              ${isActive("/interview")
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <Play size={20} />
            Start Interview
          </button>

          <button
            onClick={() => navigate("/my-attempts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium shadow-lg transition-all duration-300
              ${isActive("/my-attempts")
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <FileText size={20} />
            My Attempts
          </button>

          <button
            onClick={() => navigate("/settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium shadow-lg transition-all duration-300
              ${isActive("/settings")
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <Settings size={20} />
            Settings
          </button>
        </nav>

        <div className="p-6 border-t border-gray-200/50">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </aside>
    </div>
  )
}

export default Sidebar;
