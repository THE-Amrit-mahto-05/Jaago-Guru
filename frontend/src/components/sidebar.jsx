import React from 'react'
import { LayoutDashboard, Play, FileText, Settings, LogOut, BrainCircuit } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ logout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="h-screen w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 z-50">

      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <BrainCircuit className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            AI Prep
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
          icon={<Play size={20} />}
          label="Start Interview"
          active={isActive("/interview")}
          onClick={() => navigate("/interview")}
        />

        <SidebarItem
          icon={<FileText size={20} />}
          label="My Attempts"
          active={isActive("/my-attempts")}
          onClick={() => navigate("/my-attempts")}
        />

        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          active={isActive("/settings")}
          onClick={() => navigate("/settings")}
        />
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>

    </aside>
  )
}

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
    <div className={`${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}>
      {icon}
    </div>
    {label}
  </button>
);

export default Sidebar;
