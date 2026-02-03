import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Code2,
  Palette,
  Settings,
  Database,
  Shield,
  Smartphone,
  BarChart3,
  Brain,
  Network,
  ChevronDown,
  BookOpen,
  FolderOpen
} from "lucide-react";
import Sidebar from "../components/sidebar";

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
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();

  const categories = useMemo(
    () =>
      deepFreeze({
        "Programming Languages": [
          "C++", "C#", "Java", "Python", "Go", "Rust", "Swift", "JavaScript", "TypeScript",
        ],
        "Frontend Development": [
          "HTML", "CSS", "JavaScript", "React", "Next.js", "AngularJS", "Vue.js", "Redux",
          "Zustand", "Storybook", "Tailwind CSS", "Bootstrap", "Framer Motion",
          "Responsive Design", "Accessibility", "SPA vs MPA", "Web APIs", "DOM Manipulation",
        ],
        "Backend Development": [
          "Node.js", "Express.js", "Python Django", "Python Flask", "FastAPI",
          "Java Spring Boot", "PHP", "Laravel", "Ruby on Rails", "Microservices",
          "REST APIs", "GraphQL", "Authentication", "Authorization", "JWT",
          "Caching", "Rate Limiting", "API Gateways",
        ],
        "Databases": [
          "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Database Indexing",
          "Joins", "Transactions", "ORM", "Normalization", "NoSQL", "Elasticsearch",
        ],
        "Cybersecurity": [
          "Network Security", "Encryption", "Authentication", "Authorization",
          "Vulnerability Testing", "Penetration Testing", "OWASP Top 10",
          "XSS", "SQL Injection", "TLS/SSL",
        ],
        "Mobile Development": [
          "React Native", "Flutter", "Swift", "Kotlin", "Mobile UI/UX",
          "API Integration", "App Deployment",
        ],
        "Data & Analytics": [
          "NumPy", "Pandas", "Excel", "Power BI", "Tableau", "Data Visualization",
          "ETL Pipeline", "Data Cleaning", "Hadoop HDFS", "Spark Basics",
        ],
        "AI / Machine Learning": [
          "ML Algorithms", "Deep Learning", "TensorFlow", "PyTorch", "LLMs",
          "LangChain", "Vector Databases", "Hugging Face", "Prompt Engineering",
          "Data Preprocessing", "Model Evaluation",
        ],
        "System Design": [
          "Load Balancing", "Caching", "Message Queues", "Distributed Systems",
          "Kafka", "RabbitMQ", "Scalability", "Sharding", "CDN",
          "High Availability", "CAP Theorem",
        ],
      }),
    []
  );

  const allCategories = useMemo(() => {
    return Object.keys(categories).map((name) => ({
      name,
      slug: slugify(name),
      topics: categories[name],
    }));
  }, [categories]);

  const getCategoryIcon = (cat) => {
    const iconProps = { size: 18, strokeWidth: 1.5 };
    const icons = {
      "Programming Languages": <Code2 {...iconProps} />,
      "Frontend Development": <Palette {...iconProps} />,
      "Backend Development": <Settings {...iconProps} />,
      "Databases": <Database {...iconProps} />,
      "Cybersecurity": <Shield {...iconProps} />,
      "Mobile Development": <Smartphone {...iconProps} />,
      "Data & Analytics": <BarChart3 {...iconProps} />,
      "AI / Machine Learning": <Brain {...iconProps} />,
      "System Design": <Network {...iconProps} />,
    };
    return icons[cat] || <Code2 {...iconProps} />;
  };

  const handleTopicClick = (categoryName, topic) => {
    const subjectSlug = slugify(categoryName);
    navigate(`/interview/quiz?subject=${subjectSlug}&topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto relative h-screen">
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
             style={{
                backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
             }}>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="mb-10 border-b border-neutral-200 pb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center rounded-sm shadow-sm">
                  <BookOpen className="text-white" size={20} strokeWidth={1.5} />
               </div>
               <div>
                  <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-neutral-900 rounded-full animate-pulse"></span>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Knowledge Base</p>
                  </div>
                  <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Technical Subjects</h1>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            {allCategories.map((category) => (
              <div
                key={category.slug}
                className={`bg-white border transition-all duration-200 shadow-sm
                ${expandedCategory === category.slug ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-400'}`}
              >
                <button
                  onClick={() =>
                    setExpandedCategory(expandedCategory === category.slug ? null : category.slug)
                  }
                  className="w-full p-6 flex items-center justify-between group hover: cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-10 h-10 border flex items-center justify-center rounded-sm transition-colors
                       ${expandedCategory === category.slug ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-500 group-hover:text-neutral-900 group-hover:border-neutral-900'}`}>
                      {getCategoryIcon(category.name)}
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wide">
                        {category.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <FolderOpen size={12} className="text-neutral-400"/>
                        <p className="text-xs font-mono text-neutral-500">
                          {category.topics.length} TOPICS
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border rounded-sm transition-colors
                        ${expandedCategory === category.slug ? 'bg-neutral-100 border-neutral-200 text-neutral-900' : 'bg-white border-transparent text-neutral-400'}`}>
                        {expandedCategory === category.slug ? "Open" : "Closed"}
                     </span>
                     <ChevronDown 
                        className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${expandedCategory === category.slug ? "rotate-180 text-neutral-900" : ""}`} 
                     />
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    expandedCategory === category.slug ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 pt-0 border-t border-neutral-100 bg-neutral-50/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
                      {category.topics.map((topic, topicIdx) => (
                        <button
                          key={topicIdx}
                          onClick={() => handleTopicClick(category.name, topic)}
                          className="text-left px-4 py-3 rounded-sm bg-white border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all text-sm font-medium text-neutral-600 group flex items-center justify-between cursor-pointer"
                        >
                          {topic}
                          <span className="opacity-0 group-hover:opacity-100 text-[10px] font-mono">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}