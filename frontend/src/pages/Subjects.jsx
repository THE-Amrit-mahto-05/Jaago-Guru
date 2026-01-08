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
    const iconProps = { size: 24, strokeWidth: 2 };
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
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
<div className="mb-8">
  <div className="flex items-center gap-3 mb-3">
  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
  <BookOpen className="text-white" size={24} strokeWidth={2} />
   </div>
    <h1 className="text-4xl font-bold text-slate-900">   Interview Topics    </h1>
  </div>
   <p className="text-lg text-slate-600">   Select a category to explore topics and start your preparation   </p>
 </div>
 <div className="space-y-4">
  {allCategories.map((category) => (
   <div
    key={category.slug}
    className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"   >
 <button
   onClick={() =>
 setExpandedCategory(  expandedCategory === category.slug ? null : category.slug   ) }
  className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors" >
  <div className="flex items-center gap-4">
   <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
   {getCategoryIcon(category.name)}
  </div>
   <div className="text-left">
 <h2 className="text-xl font-bold text-slate-900">
  {category.name} </h2>
  <p className="text-sm text-slate-500 mt-0.5">
     {category.topics.length} topics   </p>
  </div>
   </div>

  <div className="flex items-center gap-3">
 <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
 {expandedCategory === category.slug ? "Collapse" : "Expand"}
  </span>
  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedCategory === category.slug ? "rotate-180" : ""   }`}   />
 </div>
  </button>
 <div
  className={`transition-all duration-300 overflow-hidden ${expandedCategory === category.slug
  ? "max-h-[2000px] opacity-100"   : "max-h-0 opacity-0"   }`} >
<div className="p-5 pt-0 border-t border-slate-100 bg-slate-50">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
  {category.topics.map((topic, topicIdx) => (
                        <button
                          key={topicIdx}
                          onClick={() => handleTopicClick(category.name, topic)}
                          className="text-left p-3.5 rounded-lg bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-slate-700 hover:text-blue-700"
                        >
                          {topic}
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
