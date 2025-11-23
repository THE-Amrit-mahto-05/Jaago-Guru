import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/\+\+/g, "cplusplus")
    .replace(/[+]/g, "plus")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const deepFreeze = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object") deepFreeze(obj[key]);
  });
  return Object.freeze(obj);
};

export default function Subjects() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/profile")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const categories = useMemo(
    () =>
      deepFreeze({
        "Programming Languages": [
          "C++",
          "C#",
          "Java",
          "Python",
          "Go",
          "Rust",
          "Swift",
          "JavaScript",
          "TypeScript",
        ],

        "Frontend Development": [
          "HTML",
          "CSS",
          "JavaScript",
          "React",
          "Next.js",
          "AngularJS",
          "Vue.js",
          "Redux",
          "Zustand",
          "Storybook",
          "Tailwind CSS",
          "Bootstrap",
          "Framer Motion",
          "Responsive Design",
          "Accessibility",
          "SPA vs MPA",
          "Web APIs",
          "DOM Manipulation",
        ],

        "Backend Development": [
          "Node.js",
          "Express.js",
          "Python Django",
          "Python Flask",
          "FastAPI",
          "Java Spring Boot",
          "PHP",
          "Laravel",
          "Ruby on Rails",
          "Microservices",
          "REST APIs",
          "GraphQL",
          "Authentication",
          "Authorization",
          "JWT",
          "Caching",
          "Rate Limiting",
          "API Gateways",
        ],

        Databases: [
          "MySQL",
          "PostgreSQL",
          "MongoDB",
          "Redis",
          "SQLite",
          "Database Indexing",
          "Joins",
          "Transactions",
          "ORM",
          "Normalization",
          "NoSQL",
          "Elasticsearch",
        ],

        Cybersecurity: [
          "Network Security",
          "Encryption",
          "Authentication",
          "Authorization",
          "Vulnerability Testing",
          "Penetration Testing",
          "OWASP Top 10",
          "XSS",
          "SQL Injection",
          "TLS/SSL",
        ],

        "Mobile Development": [
          "React Native",
          "Flutter",
          "Swift",
          "Kotlin",
          "Mobile UI/UX",
          "API Integration",
          "App Deployment",
        ],

        "Data & Analytics": [
          "NumPy",
          "Pandas",
          "Excel",
          "Power BI",
          "Tableau",
          "Data Visualization",
          "ETL Pipeline",
          "Data Cleaning",
          "Hadoop HDFS",
          "Spark Basics",
        ],

        "AI / Machine Learning": [
          "ML Algorithms",
          "Deep Learning",
          "TensorFlow",
          "PyTorch",
          "LLMs",
          "LangChain",
          "Vector Databases",
          "Hugging Face",
          "Prompt Engineering",
          "Data Preprocessing",
          "Model Evaluation",
        ],

        "System Design": [
          "Load Balancing",
          "Caching",
          "Message Queues",
          "Distributed Systems",
          "Kafka",
          "RabbitMQ",
          "Scalability",
          "Sharding",
          "CDN",
          "High Availability",
          "CAP Theorem",
        ],
      }),
    []
  );
  const subjects = useMemo(() => {
  if (!activeCategory) return [];
  return categories[activeCategory].map((name) => ({
  name,
  slug: slugify(name),
  }));
  }, [activeCategory, categories]);
  const filtered = subjects.filter((s) =>
  s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
  <div className="min-h-screen bg-gray-100 flex">
   <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
   <div className="p-6 border-b">
   <h2 className="text-2xl font-bold text-blue-600">AI Prep</h2>
  </div>

  <nav className="flex-1 p-6 space-y-2">
  <button
  onClick={() => navigate("/dashboard")}
  className="w-full text-left px-4 py-2 rounded-lg bg-gray-300">
  ◀ Back
  </button>

  {Object.keys(categories).map((cat) => (
  <button key={cat} onClick={() => {
  setQuery("");
  setActiveCategory(cat);
  }}
  className={`w-full text-left px-4 py-2 rounded-lg transition ${
  activeCategory === cat? "bg-blue-600 text-white": "hover:bg-gray-200"}`} >
  {cat}
  </button>))}
  </nav>

  <div className="p-6 border-t">
  <button onClick={logout} className="w-full py-2 bg-red-500 text-white rounded-lg" >
  Logout
  </button>
  </div>
  </aside>
    <main className="flex-1 p-6">
    <h1 className="text-3xl font-bold mb-4">
    {activeCategory || "Select a Category"}
  </h1>

  {activeCategory && (
  <input type="text" placeholder="Search topic..." value={query} onChange={(e) => setQuery(e.target.value)}
    className="w-full p-3 rounded-lg border mb-6"/>
)}

  {activeCategory && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {filtered.map((s) => (
    <div key={s.slug}onClick={() =>
    navigate(`/interview/quiz-mode?subject=${s.slug}&topic=${s.slug}`)} 
    className="cursor-pointer p-6 rounded-xl shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-white hover:scale-[1.05] transition">
    <h2 className="text-xl font-semibold">{s.name}</h2>
    <p className="text-sm opacity-80 mt-1"> Tap to view generated topics
    </p>
  </div>
  ))}
    </div>
    )}
      </main>
    </div>
  );
}
