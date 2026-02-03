import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, RotateCcw, ArrowLeft, FileText, Check, X } from "lucide-react";

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const { subject, topic, questions = [], selectedOptions = {}, score = { correct: 0, wrong: 0 }, time = 0 } = location.state || {};

  if (!location.state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] p-6">
         <div className="text-center">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">No quiz data found</h2>
            <button
               onClick={() => navigate("/interview")}
               className="px-6 py-2 bg-neutral-900 text-white text-sm font-bold uppercase tracking-wider rounded-sm hover: cursor-pointer"
            >
               Go Back
            </button>
         </div>
      </div>
    );
  }

  const total = questions.length;
  const percentage = Math.round((score.correct / total) * 100);

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white p-6 md:p-12 relative">
       {/* Background */}
       <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
            style={{
            backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
            }}>
       </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="bg-white border border-neutral-200 p-8 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
               <FileText size={100} />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${percentage >= 70 ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Quiz Completed</p>
               </div>
               <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-1">Performance Report</h1>
               <p className="text-sm font-mono text-neutral-500 uppercase">{subject} • {topic}</p>
            </div>
        </div>

        {/* Score Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-neutral-200 p-6 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Correct Answers</p>
                <div className="text-4xl font-bold text-neutral-900 tracking-tight">{score.correct}<span className="text-lg text-neutral-400 font-medium">/{total}</span></div>
             </div>
             <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                <CheckCircle2 className="text-green-600" size={24} />
             </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Wrong Answers</p>
                <div className="text-4xl font-bold text-neutral-900 tracking-tight">{score.wrong}</div>
             </div>
             <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
                <XCircle className="text-red-600" size={24} />
             </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Duration</p>
                <div className="text-4xl font-bold text-neutral-900 tracking-tight font-mono">
                   {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
                </div>
             </div>
             <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-200">
                <Clock className="text-neutral-600" size={24} />
             </div>
          </div>
        </div>

        {/* Detailed Review */}
        <div className="space-y-6">
           <div className="flex items-center gap-2 mb-4 border-b border-neutral-200 pb-2">
              <FileText size={16} className="text-neutral-500"/>
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Question Review</h2>
           </div>

          {questions.map((q, idx) => {
            const selected = selectedOptions[idx];
            const correct = q.answer;
            const isCorrect = selected && selected === correct;
            const correctText = q.options.find((o) => o.label === correct)?.text || "";
            const selectedText = q.options.find((o) => o.label === selected)?.text || "";

            return (
              <div key={idx} className="bg-white border border-neutral-200 p-6 shadow-sm group">
                <div className="flex items-start gap-4 mb-6">
                  <span className="flex-shrink-0 w-8 h-8 bg-neutral-100 text-neutral-500 font-mono text-sm font-bold flex items-center justify-center rounded-sm border border-neutral-200">
                     {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                     <h3 className="text-lg font-medium text-neutral-900 leading-relaxed">{q.question}</h3>
                  </div>
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-sm flex items-center gap-1.5 h-fit
                     ${isCorrect ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                     {isCorrect ? <Check size={12} /> : <X size={12} />}
                     {selected ? (isCorrect ? "Passed" : "Failed") : "Skipped"}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Your Answer */}
                  <div className={`p-4 border rounded-sm relative ${isCorrect ? "bg-green-50/50 border-green-200" : "bg-red-50/50 border-red-200"}`}>
                     <span className={`absolute top-0 right-0 px-2 py-1 text-[9px] font-bold uppercase tracking-widest border-l border-b rounded-bl-sm
                        ${isCorrect ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}>
                        Your Answer
                     </span>
                     <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Selected Option</p>
                     <p className="text-sm font-medium text-neutral-900">
                        {selected ? (
                           <span className="flex items-start gap-2">
                              <span className="font-bold">{selected.toUpperCase()}.</span>
                              {selectedText}
                           </span>
                        ) : "Not attempted"}
                     </p>
                  </div>

                  {/* Correct Answer */}
                  <div className="p-4 border border-neutral-200 bg-white rounded-sm relative">
                     <span className="absolute top-0 right-0 px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-500 border-l border-b border-neutral-200 rounded-bl-sm">
                        Correct Answer
                     </span>
                     <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Correct Option</p>
                     <p className="text-sm font-medium text-neutral-900 flex items-start gap-2">
                        <span className="font-bold">{correct.toUpperCase()}.</span>
                        {correctText}
                     </p>
                  </div>
                </div>

                {q.explanation && (
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Explanation</p>
                    <p className="text-sm text-neutral-600 leading-relaxed font-mono text-xs">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-4 border-t border-neutral-200 pt-8">
          <button
            onClick={() => navigate("/interview")}
            className="px-6 py-3 bg-neutral-900 text-white rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Subjects
          </button>
        </div>
      </div>
    </div>
  );
}