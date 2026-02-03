import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Timer, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Terminal, Cpu } from "lucide-react";
import api from "../api";

export default function QuizMode() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const subject = params.get("subject");
  const topic = params.get("topic");

  const [startMCQ, setStartMCQ] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  useEffect(() => {
    let interval;
    if (startMCQ) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [startMCQ]);

  const fetchMCQ = async () => {
   setLoading(true)

   try {
      const res = await api.post("/mcq/ask", { subject, topic, mode: "mcq" })
      if (!res.data.success) {
         throw new Error("AI request failed");
      }

      const rawText = res?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText || typeof rawText !== "string") {
         throw new Error("Invalid MCQ response from AI");
      }

      const qArr = rawText
         .split(/\n(?=\d+[\.\)])/)
         .map((qBlock) => {
         const lines = qBlock.split("\n").filter(Boolean);
         const questionText = (lines[0] || "").replace(/^\d+[\.\)]\s*/, "");

         const options = lines
            .filter((line) => /^[abcd][\.\)]\s/.test(line))
            .map((opt) => ({
               label: opt[0].toLowerCase(),
               text: opt.slice(2).trim(),
            }));

         const answerLine = lines.find((line) => /^Answer:/i.test(line));
         const answer = answerLine
            ? answerLine.replace(/Answer:/i, "").trim()[0]?.toLowerCase()
            : "";
         const explanationLine = lines.find((line) => /^Explanation:/i.test(line));
         const explanation = explanationLine
            ? explanationLine.replace(/Explanation:/i, "").trim()
            : "";

         return { question: questionText, options, answer, explanation };
         })
         .filter((q) => q.question && q.options.length === 4); 

      if (!qArr.length) {
         throw new Error("No valid questions generated");
      }

      setQuestions(qArr);
      setSeconds(0);
      setStartMCQ(true);
   } catch (err) {
      console.error("Error loading MCQ:", err);
      alert("Failed to generate quiz. Please try again.");
   }
   setLoading(false);
   }

  const handleOptionClick = (qIndex, selectedLabel) => {
    if (selectedOptions[qIndex]) return;
    setSelectedOptions({ ...selectedOptions, [qIndex]: selectedLabel });
  };

  const calculateScore = () => {
    let correct = 0;
    let wrong = 0;
    questions.forEach((q, idx) => {
      if (!selectedOptions[idx]) return;
      if (selectedOptions[idx] === q.answer) correct++;
      else wrong++;
    });
    return { correct, wrong };
  };

  const finalizeQuiz = async () => {
      if (!questions.length) {
         alert("Quiz failed to load. No attempt saved.");
         return;
      }
      const scoreData = calculateScore();

      const payloadQuestions = questions.map((q, idx) => {
         const selected = selectedOptions[idx] || "";
         const isCorrect = selected && selected === q.answer;
         const analysis = selected
         ? `Selected: ${selected.toUpperCase()} | Correct: ${q.answer.toUpperCase()} | Result: ${isCorrect ? "Correct" : "Incorrect"}`
         : "Not attempted";
         const explanation = [analysis, q.explanation].filter(Boolean).join(" | ");
         return { question: q.question, options: q.options, answer: q.answer, explanation };
      });

      try {
         await api.post("/mcq/attempt", {
            subject,
            topic,
            score: scoreData,
            time: seconds,
            selectedOptions,
            questions: payloadQuestions
         });
      } catch (err) {
         console.error("Save attempt error:", err);
      }

      navigate("/interview/quiz/results", {
         state: {
            subject,
            topic,
            questions: payloadQuestions,
            selectedOptions,
            score: scoreData,
            time: seconds
         }
      });

      setStartMCQ(false);
      setQuestions([]);
      setSelectedOptions({});
      setSeconds(0);
      setCurrentIndex(0);
      setShowConfirmPopup(false);
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const unansweredCount = questions.length - Object.keys(selectedOptions).length;

  return (
   <div className="min-h-screen bg-[#FDFCF8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col items-center py-12 px-4 relative">
    
    {/* Background */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
        backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
        }}>
    </div>

   <div className="max-w-4xl w-full relative z-10">
      
      {/* Header Card */}
      <div className="bg-white border border-neutral-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center rounded-sm text-white">
               <Terminal size={20} />
            </div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Quiz Topic</p>
               <h1 className="text-xl font-bold text-neutral-900 leading-none">{topic}</h1>
            </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {startMCQ && (
                <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-sm font-mono text-sm font-bold text-neutral-700">
                <Timer size={16} />
                <span>{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}</span>
                </div>
            )}
            
            <button 
               onClick={() => { if (startMCQ) setShowConfirmPopup(true); else fetchMCQ(); }}
               disabled={loading}
               className={`px-6 py-2.5 rounded-sm font-bold text-sm uppercase tracking-widest transition-all shadow-sm flex items-center gap-2
                  ${startMCQ  
                     ? "bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                     : "bg-neutral-900 text-white hover:bg-neutral-800"
                  } 
                  ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
               `}
               >
               {startMCQ ? "End Quiz" : loading ? "Loading questions..." : "Start Quiz"}
            </button>
        </div>
      </div>

      {startMCQ && (
          <>
            {loading ? (
              <div className="bg-white border border-neutral-200 p-16 text-center shadow-sm">
                <div className="relative w-16 h-16 mx-auto mb-6">
                   <div className="absolute inset-0 border-4 border-neutral-100 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-t-neutral-900 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 uppercase tracking-wide">Preparing your quiz</h3>
                <p className="text-xs text-neutral-500 font-mono mt-2">Generating questions...</p>
              </div>
            ) : (
              currentQuestion && (
                <div className="space-y-6">

                  {/* Progress Bar */}
                  <div className="bg-white border border-neutral-200 p-4 shadow-sm flex items-center gap-4">
                    <div className="text-xs font-mono font-bold text-neutral-500">
                       Q{currentIndex + 1}/{questions.length}
                    </div>
                    <div className="flex-1 bg-neutral-100 h-2 rounded-sm overflow-hidden">
                      <div
                        className="bg-neutral-900 h-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs font-mono font-bold text-neutral-900">{Math.round(progress)}%</div>
                  </div>

                  {/* Question Card */}
                  <div className="bg-white border border-neutral-200 shadow-lg relative overflow-hidden">
                     {/* Decorative background number */}
                     <div className="absolute -top-6 -right-6 text-[120px] font-bold text-neutral-50 opacity-50 select-none pointer-events-none">
                        {currentIndex + 1}
                     </div>

                     <div className="p-8 relative z-10">
                        <h2 className="text-xl md:text-2xl font-medium text-neutral-900 leading-relaxed mb-8">
                           {currentQuestion.question}
                        </h2>

                        <div className="space-y-3">
                           {currentQuestion.options?.map((opt) => {
                              const isSelected = selectedOptions[currentIndex] === opt.label;
                              const isCorrect = selectedOptions[currentIndex] && opt.label === currentQuestion.answer;
                              const isWrong = selectedOptions[currentIndex] && isSelected && opt.label !== currentQuestion.answer;
                              return (
                                 <div key={opt.label} className="space-y-1">
                                 {selectedOptions[currentIndex] && ( 
                                    <div className="text-xs font-mono text-neutral-500"> 
                                       {isSelected
                                       ? "Your answer"
                                       : isCorrect
                                       ? "Correct answer"
                                       : ""}
                                    </div>
                                 )}
                                 <button
                                    onClick={() => handleOptionClick(currentIndex, opt.label)}
                                    disabled={!!selectedOptions[currentIndex]}
                                    className={`w-full text-left px-6 py-4 rounded-sm border transition-all duration-200 flex items-center gap-4 group
                                       ${isCorrect
                                       ? "bg-green-50 border-green-500"
                                       : isWrong
                                       ? "bg-red-50 border-red-500"
                                       : isSelected
                                       ? "bg-neutral-900 border-neutral-900 text-white"
                                       : "bg-white border-neutral-200 hover:border-neutral-900 cursor-pointer disabled:cursor-not-allowed"
                                       }`}
                                 >
                                    <span className={`w-8 h-8 flex items-center justify-center border rounded-sm text-sm font-bold uppercase
                                       ${isCorrect
                                       ? "bg-green-500 border-green-500 text-white"
                                       : isWrong
                                       ? "bg-red-500 border-red-500 text-white"
                                       : isSelected
                                       ? "bg-white border-white text-neutral-900"
                                       : "bg-neutral-50 border-neutral-200 text-neutral-500 group-hover:border-neutral-900 group-hover:text-neutral-900"
                                       }`}
                                    >
                                       {opt.label}
                                    </span>
                                    <span className={`flex-1 font-medium ${
                                       isCorrect ? "text-green-600" : isWrong ? "text-red-600" : isSelected ? "text-neutral-900" : "text-neutral-700 group-hover:text-neutral-900"
                                    }`}>
                                       {opt.text}
                                    </span>
                                    {isCorrect && <CheckCircle2 size={20} className="text-green-600" />}
                                    {isWrong && <AlertTriangle size={20} className="text-red-600" />}
                                 </button>
                                 </div>
                              );
                           })}
                           </div>
                     </div>
                     
                     {/* Explanation Section */}
                     {selectedOptions[currentIndex] && (
                        <div className="border-t border-neutral-200 bg-neutral-50/50 p-6 animate-in slide-in-from-top-2">
                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-white border border-neutral-200 px-2 py-1">Explanation</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-white border border-neutral-200 px-2 py-1">
                                 Correct Answer: {currentQuestion.answer.toUpperCase()}
                              </span>
                           </div>
                           {currentQuestion.explanation && (
                              <p className="text-sm text-neutral-600 leading-relaxed border-l-2 border-neutral-300 pl-4">
                                 {currentQuestion.explanation}
                              </p>
                           )}
                        </div>
                     )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                     <button
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className={`px-6 py-3 rounded-sm border font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2
                        ${currentIndex === 0
                           ? "opacity-50 cursor-not-allowed border-transparent text-neutral-400"
                           : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 cursor-pointer"
                        }`}
                     >
                        <ArrowLeft size={16} />
                        Previous
                     </button>

                     {currentIndex === questions.length - 1 ? (
                        <button
                           onClick={() => setShowConfirmPopup(true)}
                           className="px-8 py-3 bg-neutral-900 text-white rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                           Submit Quiz
                           <CheckCircle2 size={16} />
                        </button>
                     ) : (
                        <button
                           onClick={() => setCurrentIndex(currentIndex + 1)}
                           disabled={currentIndex === questions.length - 1}
                           className={`px-8 py-3 rounded-sm border font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2
                           ${currentIndex === questions.length - 1
                              ? "opacity-50 cursor-not-allowed border-transparent text-neutral-400"
                              : "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800 cursor-pointer"
                           }`}
                        >
                           Next
                           <ArrowRight size={16} />
                        </button>
                     )}
                  </div>

                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmPopup && (
         <div className="fixed inset-0 backdrop-blur-sm bg-neutral-900/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-sm rounded-sm shadow-2xl border border-neutral-200 p-0">
               <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-neutral-500"/>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Confirm Submission</h2>
               </div>
               
               <div className="p-6">
                  <div className="mb-7 text-center space-y-4">
                     <p className="text-base md:text-lg font-medium text-neutral-700 leading-relaxed">
                        Are you sure you want to submit this quiz?
                     </p>
                     
                     {unansweredCount > 0 && (
                        <div className="mx-auto max-w-sm p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm md:text-base font-medium shadow-sm">
                           You have <strong>{unansweredCount}</strong> unanswered question{unansweredCount > 1 ? "s" : ""}. Submit anyway?
                        </div>
                     )}
                  </div>
                  <div className="flex gap-3">
                     <button 
                        onClick={() => setShowConfirmPopup(false)} 
                        className="flex-1 px-4 py-3 rounded-sm border border-neutral-200 text-neutral-600 font-bold text-xs uppercase tracking-wider hover:bg-neutral-50 transition cursor-pointer" 
                     >
                        Cancel
                     </button>

                     <button
                        onClick={finalizeQuiz}
                        className="flex-1 px-4 py-3 rounded-sm bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition shadow-sm cursor-pointer"
                     >
                        Submit
                     </button>
                  </div>
               </div>
            </div>
         </div> 
      )}
   </div>
  );
}