import React, { useState } from 'react'
import { LayoutDashboard, Play, FileText, LogOut, BrainCircuit, Mic, Terminal, ShieldAlert } from "lucide-react";
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
      <aside className="h-screen w-64 bg-[#FDFCF8] border-r border-neutral-200 hidden md:flex flex-col sticky top-0 z-50 font-sans">
        
        {/* Header / Logo */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-sm flex items-center justify-center">
              <BrainCircuit className="text-white" size={18} />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
              InterviewMate
            </h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-4 py-2 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Menu</p>
          </div>
          
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          />

          <div className="px-4 py-2 mt-6 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Practice</p>
          </div>

          <SidebarItem
            icon={<Mic size={18} />}
            label="AI Voice Interview"
            active={isActive("/interview/start")}
            onClick={() => navigate("/interview/start")}
          />

          <SidebarItem
            icon={<Play size={18} />}
            label="Quiz Mode"
            active={isActive("/interview")}
            onClick={() => navigate("/interview")}
          />

          <div className="px-4 py-2 mt-6 mb-2">
             <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">History</p>
          </div>

          <SidebarItem
            icon={<FileText size={18} />}
            label="Interview Attempts"
            active={isActive("/ai-attempts")}
            onClick={() => navigate("/ai-attempts")}
          />

          <SidebarItem
            icon={<Terminal size={18} />}
            label="Quiz Attempts"
            active={isActive("/my-attempts")}
            onClick={() => navigate("/my-attempts")}
          />
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50">
          <button
            onClick={openLogoutModal}
            className="w-full flex items-center gap-3 px-4 py-3 text-neutral-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-all duration-200 font-medium group text-sm border border-transparent hover:border-red-100 cursor-pointer"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Log Out
          </button>
        </div>

      </aside>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm animate-fadeIn"
            onClick={closeLogoutModal}
          />

          {/* MODAL BOX - Sharp, Technical */}
          <div className="bg-white border border-neutral-200 shadow-2xl p-0 w-96 z-50 relative animate-scaleUp rounded-sm">
            {/* Modal Header */}
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex items-center gap-2">
               <ShieldAlert size={16} className="text-neutral-500"/>
               <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-700">Confirm Logout</h2>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-neutral-600 text-sm leading-relaxed">
                Are you sure you want to log out of your session? Unsaved progress may be lost.
              </p>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={closeLogoutModal}
                  className="px-6 py-2 rounded-sm border border-neutral-200 text-neutral-600 text-sm font-medium hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-sm bg-neutral-900 text-white text-sm font-bold hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Sidebar Item - High Contrast Active State
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-all duration-150 border
      ${active
        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
        : "text-neutral-600 border-transparent hover:bg-neutral-100 hover:text-neutral-900 hover:border-neutral-200 cursor-pointer"
      }
    `}
  >
    <div className={`${active ? "text-neutral-300" : "text-neutral-400 group-hover:text-neutral-900"}`}>
      {icon}
    </div>
    {label}
  </button>
);

export default Sidebar;