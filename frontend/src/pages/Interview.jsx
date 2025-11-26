import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const SAMPLE_QUESTIONS = [
  { id: 1, title: "Two Sum", prompt: "Explain how you would solve the Two Sum problem and write complexity." },
  { id: 2, title: "Linked List Cycle", prompt: "How would you detect a cycle in a linked list? Explain approach." },
  { id: 3, title: "System Design: URL Shortener", prompt: "Design a simplified URL shortening system and describe components." },
];

export default function Interview() {
  const navigate = useNavigate();

  const [questions] = useState(SAMPLE_QUESTIONS);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question default (in seconds)
  const timerRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const [manualAnswer, setManualAnswer] = useState("");
  const [submissions, setSubmissions] = useState([]); // {questionId, answer, score, feedback}
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");

  // Check for Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  useEffect(() => {
    // cleanup on unmount
    return () => stopTimer();
  }, []);

  // TIMER LOGIC
  const startTimer = (seconds = 300) => {
    stopTimer();
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit(); // auto submit on timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Convert seconds to mm:ss
  const fmt = (s) => {
    const mm = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // RECORDING / SPEECH-TO-TEXT LOGIC
  const startRecording = () => {
    if (!SpeechRecognition) {
      setError("Voice recognition not supported in this browser. Please type your answer.");
      return;
    }
    setError("");
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let interim = "";
      let final = transcript;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) {
          final += r[0].transcript + " ";
        } else {
          interim += r[0].transcript;
        }
      }
      setTranscript((prev) => (prev ? prev + " " + interim : interim) || final);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
      setError("Speech recognition error: " + e.error);
      stopRecording();
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch (e) {
      console.warn("stopRecording error:", e);
    }
    setIsRecording(false);
  };

  // Start interview: resets states and starts timer and recording if desired
  const handleStart = () => {
    setStarted(true);
    setIndex(0);
    setSubmissions([]);
    setTranscript("");
    setManualAnswer("");
    startTimer(300); // 5 minutes each question
  };

  // Move to next question (without submitting)
  const handleSkip = () => {
    stopTimer();
    stopRecording();
    setTranscript("");
    setManualAnswer("");
    setError("");
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      startTimer(300);
    } else {
      // finished all
      navigate("/dashboard");
    }
  };

  // Auto-submit when timer runs out: submit current transcript/manualAnswer
  const handleAutoSubmit = async () => {
    // if nothing, just move on
    const answer = transcript.trim() || manualAnswer.trim();
    if (!answer) {
      // push empty attempt
      setSubmissions((s) => [...s, { questionId: questions[index].id, answer: "", score: 0, feedback: "No answer provided" }]);
      // move to next
      if (index < questions.length - 1) {
        setIndex((i) => i + 1);
        setTranscript("");
        setManualAnswer("");
        startTimer(300);
      } else {
        navigate("/dashboard");
      }
      return;
    }
    await submitAnswer(answer, true);
  };

  // Submit answer to backend (expected endpoint: POST /interview/answer)
  const submitAnswer = async (answerText, isAuto = false) => {
    setLoadingSubmit(true);
    setError("");
    const q = questions[index];
    try {
      // Example payload structure — adapt to your backend contract
      const payload = {
        questionId: q.id,
        questionTitle: q.title,
        questionPrompt: q.prompt,
        answer: answerText,
        duration: 300 - timeLeft, // seconds used
      };

      // Send to backend for AI evaluation
      // Backend should return something like { score: 80, feedback: "Good explanation", suggested_improvements: [...] }
      const res = await API.post("/interview/answer", payload).catch((e) => {
        // If backend not implemented yet, we mock a response
        console.warn("API error or not implemented — using mock feedback", e);
        return { data: { score: Math.floor(Math.random() * 30) + 70, feedback: "Mock feedback: Good job. Add more edge cases." } };
      });

      const { score, feedback } = res.data;
      const submission = { questionId: q.id, answer: answerText, score: score ?? 0, feedback: feedback ?? "No feedback" };

      setSubmissions((s) => [...s, submission]);

      // Reset inputs and move to next question or finish
      stopRecording();
      setTranscript("");
      setManualAnswer("");
      stopTimer();

      if (index < questions.length - 1) {
        setIndex((i) => i + 1);
        startTimer(300);
      } else {
        // finished all questions
        // Optionally navigate to results / summary page
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("submitAnswer error", err);
      setError("Failed to submit answer. Try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const answerText = transcript.trim() || manualAnswer.trim();
    if (!answerText) {
      setError("Please record or type your answer before submitting.");
      return;
    }
    await submitAnswer(answerText, false);
  };

  // UI helpers
  const q = questions[index];
  const progress = Math.round(((index) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Question card + controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{q.title}</h3>
                <p className="text-gray-500 mt-1">{q.prompt}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Question</p>
                <p className="text-lg font-semibold">{index + 1} / {questions.length}</p>
              </div>
            </div>

            {/* Timer & progress */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="px-3 py-2 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">Time Left</p>
                  <p className="text-lg font-mono">{fmt(timeLeft)}</p>
                </div>

                <div className="w-56 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!started ? (
                  <button
                    onClick={handleStart}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
                  >
                    Start Interview
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (isRecording) stopRecording();
                        else startRecording();
                      }}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg shadow ${
                        isRecording ? "bg-red-500 text-white" : "bg-white border"
                      }`}
                    >
                      <svg className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3z" />
                        <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V21a1 1 0 102 0v-3.08A7 7 0 0019 11z" />
                      </svg>
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </button>

                    <button
                      onClick={handleSkip}
                      className="px-4 py-2 bg-gray-100 rounded-lg"
                    >
                      Skip
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Transcript & manual input */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live Transcript</label>
                <div className="min-h-[140px] p-4 bg-gray-50 rounded-lg border text-gray-700 whitespace-pre-wrap">
                  {transcript || <span className="text-gray-400">No speech captured yet. Click "Start Recording" and speak, or type your answer on the right.</span>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manual Answer (editable)</label>
                <form onSubmit={handleManualSubmit} className="flex flex-col h-full">
                  <textarea
                    value={manualAnswer}
                    onChange={(e) => setManualAnswer(e.target.value)}
                    placeholder="Or type your answer here (you can edit the transcript above)"
                    className="flex-1 p-4 bg-white rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Tip: Press submit to send to AI for evaluation.
                    </div>
                    <button
                      type="submit"
                      disabled={loadingSubmit}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-60"
                    >
                      {loadingSubmit ? "Submitting..." : "Submit Answer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Past submissions / timeline */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold mb-3">Your Recent Attempts</h4>
            {submissions.length === 0 ? (
              <p className="text-gray-500">No submissions yet. Submit your answer to see feedback.</p>
            ) : (
              <ul className="space-y-4">
                {submissions.map((s, i) => (
                  <li key={i} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Q{questions.findIndex(qt => qt.id === s.questionId) + 1} Answer</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{s.answer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Score</p>
                        <p className="text-lg font-bold">{s.score}%</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-700">
                      <strong>Feedback:</strong> {s.feedback}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: AI Feedback / Controls */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold mb-2">AI Feedback (Last)</h4>
            {submissions.length === 0 ? (
              <p className="text-gray-500">Your feedback will show up here after you submit an answer.</p>
            ) : (
              <div>
                <p className="text-sm text-gray-600">Score: <span className="font-bold">{submissions[submissions.length - 1].score}%</span></p>
                <p className="mt-3 text-gray-700">{submissions[submissions.length - 1].feedback}</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold mb-2">Session Summary</h4>
            <p className="text-sm text-gray-600">Questions attempted: <span className="font-medium">{submissions.length}</span></p>
            <p className="text-sm text-gray-600">Remaining: <span className="font-medium">{questions.length - (index + (started ? 1 : 0))}</span></p>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => {
                  // quick finish session: navigate away
                  stopTimer();
                  stopRecording();
                  navigate("/dashboard");
                }}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg"
              >
                End Session
              </button>

              <button
                onClick={() => {
                  // quick re-run last feedback (re-evaluate last submission)
                  if (submissions.length === 0) {
                    setError("No submission to re-evaluate");
                    return;
                  }
                  // call backend re-eval endpoint if you have it
                  (async () => {
                    setLoadingSubmit(true);
                    try {
                      const last = submissions[submissions.length - 1];
                      const res = await API.post("/interview/reevaluate", { ...last }).catch((e) => {
                        console.warn("reevaluate not implemented, using same feedback", e);
                        return { data: { score: last.score, feedback: last.feedback } };
                      });
                      const updated = { ...last, score: res.data.score, feedback: res.data.feedback };
                      setSubmissions((s) => [...s.slice(0, -1), updated]);
                    } catch (e) {
                      setError("Failed to re-evaluate");
                    } finally {
                      setLoadingSubmit(false);
                    }
                  })();
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Re-evaluate Last Answer
              </button>
            </div>
          </div>

          {/* Small help / tips */}
          <div className="bg-white p-6 rounded-2xl shadow text-sm text-gray-600">
            <h4 className="font-semibold mb-2">Tips</h4>
            <ul className="list-disc ml-5 space-y-2">
              <li>Explain your thought process clearly.</li>
              <li>Mention complexity and edge cases for algorithm questions.</li>
              <li>For system design, break the problem into components.</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded">{error}</div>
          )}
        </aside>

      </div>
    </div>
  );
}