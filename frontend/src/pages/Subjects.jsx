import { useNavigate } from "react-router-dom";

export default function Subjects() {
  const navigate = useNavigate();

  const subjects = [
    { name: "DSA", path: "/interview/dsa" },
    { name: "MERN Stack", path: "/interview/mern" },
    { name: "System Design", path: "/interview/system-design" },
    { name: "HR Interview", path: "/interview/hr" },
    { name: "Aptitude", path: "/interview/aptitude" }
  ];

  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {subjects.map((s) => (
        <button
          key={s.name}
          onClick={() => navigate(s.path)}
          className="bg-white shadow p-8 rounded-xl hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold">{s.name}</h2>
        </button>
      ))}
    </div>
  );
}
