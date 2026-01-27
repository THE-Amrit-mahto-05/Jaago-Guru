import React, { useState } from 'react'
import { LayoutDashboard, Play, FileText, Settings, LogOut, BrainCircuit, Mic } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    closeLogoutModal();
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="h-screen w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 z-50">

        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 font-['Plus_Jakarta_Sans'] tracking-tight">
              InterviewMate
            </h2>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={<Mic size={20} />}
            label="AI Voice Interview"
            active={isActive("/interview/start")}
            onClick={() => navigate("/interview/start")}
          />

          <SidebarItem
            icon={<Play size={20} />}
            label="Interview (MCQ)"
            active={isActive("/interview")}
            onClick={() => navigate("/interview")}
          />

          <SidebarItem
            icon={<FileText size={20} />}
            label="AI Interviews"
            active={isActive("/ai-attempts")}
            onClick={() => navigate("/ai-attempts")}
          />

          <SidebarItem
            icon={<FileText size={20} />}
            label="MCQ Attempts"
            active={isActive("/my-attempts")}
            onClick={() => navigate("/my-attempts")}
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={openLogoutModal}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>

      </aside>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={closeLogoutModal}
          />

          {/* MODAL BOX */}
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 z-50 animate-scaleUp">
            <h2 className="text-lg font-semibold text-slate-800">Confirm Logout</h2>
            <p className="text-slate-600 mt-1">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeLogoutModal}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
      ${active
        ? "bg-indigo-50 text-indigo-600 shadow-sm"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }
    `}
  >
    <div className={`${active ? "text-indigo-600" : "text-slate-400"}`}>
      {icon}
    </div>
    {label}
  </button>
);

export default Sidebar;
