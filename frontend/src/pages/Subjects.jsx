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
    const iconProps = { size: 32, strokeWidth: 1.5 };
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
    <Sidebar />
    <main className="flex-1 p-8 overflow-y-auto">
    <div className="max-w-7xl mx-auto">
    <div className="mb-8">
    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
      Interview Topics
    </h1>
      <p className="text-xl text-gray-600 mt-4">
           Select a category to explore topics and start your preparation
        </p>
        </div>

        <div className="space-y-4">
          {allCategories.map((category, idx) => (
            <div
                key={category.slug}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden transition-all duration-300"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                  opacity: 0,
                }}
              >

                <button
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === category.slug ? null : category.slug
                    )
                  }
                  className="w-full p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-blue-600 group-hover:scale-110 group-hover:text-indigo-600 transition-all">
                      {getCategoryIcon(category.name)}
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.topics.length} topics available
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {expandedCategory === category.slug ? "Collapse" : "Expand"}
                    </span>
                    <ChevronDown 
                      className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                        expandedCategory === category.slug ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    expandedCategory === category.slug
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 pt-0 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                      {category.topics.map((topic, topicIdx) => (
                        <div
                          key={topicIdx}
                          onClick={() => handleTopicClick(category.name, topic)}
                          className="group cursor-pointer p-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="font-medium text-gray-700 group-hover:text-white transition-colors">
                              {topic}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
