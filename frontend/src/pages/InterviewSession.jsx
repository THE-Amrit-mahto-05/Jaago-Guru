import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, Volume2, Send, RotateCcw, Sparkles, CircleHelp } from "lucide-react";
import api from "../api";

const DG_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;
const DG_TTS_URL = "https://api.deepgram.com/v1/speak";

export default function InterviewSession() {
  const { id } = useParams();
  const interviewId = Number(id);
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  const [partial, setPartial] = useState("");
  const [finalText, setFinalText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [error, setError] = useState("");

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Load first question AFTER user clicks Start Interview
  useEffect(() => {
    if (!started) return;

    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/interview/${interviewId}/question`);

        if (res.data.finished) {
          navigate(`/interview/${interviewId}/summary`);
          return;
        }

        setQuestion({
          questionId: res.data.questionId,
          text: res.data.text,
          index: res.data.index,
        });

        setTotal(res.data.total);
        console.log(res.data);

        // Now autoplay is allowed because user interacted
        await playTTS(res.data.text);
      } catch (err) {
        setError("Failed to load question.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();

    return () => cleanupRecording();
  }, [started, interviewId, navigate]);

  // Deepgram TTS
  async function playTTS(text) {
    if (!text || !DG_KEY) return;

    try {
      // Stop mic to avoid echo
      if (isRecording) {
        stopRecording();
        await new Promise((r) => setTimeout(r, 200));
      }

      setIsPlayingTTS(true);

      const url = `${DG_TTS_URL}?model=aura-asteria-en`;

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Token ${DG_KEY}`,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({ text }),
      });

      if (!resp.ok) {
        console.error(await resp.text());
        setIsPlayingTTS(false);
        return;
      }

      const blob = await resp.blob();
      const audioURL = URL.createObjectURL(blob);
      const audio = new Audio(audioURL);

      audio.onended = () => {
        URL.revokeObjectURL(audioURL);
        setIsPlayingTTS(false);
      };

      await audio.play();
    } catch (err) {
      console.error("TTS error:", err);
      setIsPlayingTTS(false);
    }
  }

  // Start Recording using browser Deepgram WS pattern
  async function startRecording() {
    setError("");
    setPartial("");
    setFinalText("");

    if (!DG_KEY) {
      setError("Missing Deepgram API Key.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // AUTH IS VIA SUBPROTOCOL: ["token", API_KEY]
      const ws = new WebSocket(
        "wss://api.deepgram.com/v1/listen?model=nova-2&language=en-US&punctuate=true&interim_results=true",
        ["token", DG_KEY]
      );

      wsRef.current = ws;

      ws.onopen = () => {
        const recorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });

        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = async (evt) => {
          if (ws.readyState === WebSocket.OPEN && evt.data.size > 0) {
            const buf = await evt.data.arrayBuffer();
            ws.send(buf);
          }
        };

        recorder.onstart = () => setIsRecording(true);
        recorder.start(250);
      };

      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          const alt = data.channel?.alternatives?.[0];

          if (!alt) return;

          if (data.is_final) {
            setFinalText((p) => p + " " + alt.transcript);
            setPartial("");
          } else {
            setPartial(alt.transcript || "");
          }
        } catch { }
      };

      ws.onerror = (e) => {
        console.error("WS error:", e);
        setError("Audio connection failed.");
      };

      ws.onclose = () => {
        setIsRecording(false);
      };
    } catch (err) {
      console.error("startRecording error:", err);
      setError("Could not access microphone.");
    }
  }

  // Stop Recording
  function stopRecording() {
    try {
      mediaRecorderRef.current?.stop();
    } catch { }

    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch { }

    try {
      wsRef.current?.close();
    } catch { }

    setIsRecording(false);
  }

  function cleanupRecording() {
    stopRecording();
  }

  // Submit
  async function submitAnswer() {
    const answer = (finalText + " " + partial).trim();

    if (!answer) {
      setError("Please answer before continuing.");
      return;
    }

    try {
      const res = await api.post(`/interview/${interviewId}/answer`, {
        questionId: question.questionId,
        answerText: answer,
      });

      if (res.data.finished) {
        navigate(`/interview/${interviewId}/summary`);
        return;
      }

      const next = res.data.nextQuestion;
      setQuestion(next);
      setFinalText("");
      setPartial("");

      await playTTS(next.text);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to save.");
    }
  }

  // Start Screen
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
        <style>{`
          @keyframes pulse-glow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3),
                          0 0 40px rgba(59, 130, 246, 0.2);
            }
            50% { 
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.5),
                          0 0 60px rgba(59, 130, 246, 0.3);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}</style>

        <div className="text-center max-w-2xl animate-fade-in">
          <div className="mb-8 inline-block animate-float">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200">
              <Sparkles className="text-white" size={48} />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Ready to Ace Your Interview?
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Take a deep breath. We'll guide you through this step by step.
            Click below when you're ready to begin.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="group px-10 py-5 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow"
          >
            <span className="flex items-center gap-3">
              Start Interview
              <Sparkles className="group-hover:rotate-12 transition-transform" size={24} />
            </span>
          </button>

          <p className="mt-6 text-sm text-slate-500">
            Make sure your microphone is connected and working
          </p>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>

        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-blue-700 animate-pulse">
            Loading your interview...
          </p>
        </div>
      </div>
    );
  }

  // Main Interview Screen
  const progress = ((question.index) / total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <style>{`
        @keyframes recording-pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-recording {
          animation: recording-pulse 1.5s ease-in-out infinite;
        }
        .wave-bar {
          animation: wave 1s ease-in-out infinite;
        }
        .wave-bar:nth-child(2) { animation-delay: 0.1s; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .wave-bar:nth-child(4) { animation-delay: 0.3s; }
        .wave-bar:nth-child(5) { animation-delay: 0.4s; }
        .slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">

        {/* Header with Progress */}
        <div className="mb-8 slide-up">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Interview Session</h1>
                <p className="text-sm text-blue-600 font-medium mt-1">
                  Question {question.index}
                </p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-6 slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 transform transition-transform duration-300 hover:scale-110">
                  <CircleHelp className="text-white" size={28} strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                  Current Question
                </h2>
                <p className="text-2xl font-semibold text-slate-900 leading-relaxed">
                  {question.text}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => playTTS(question.text)}
                disabled={isPlayingTTS}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${isPlayingTTS
                  ? "bg-blue-100 text-blue-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95"
                  }`}
              >
                <Volume2 size={20} className={isPlayingTTS ? "animate-pulse" : ""} />
                {isPlayingTTS ? "Playing..." : "Play Question"}
              </button>

              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Mic size={20} />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold shadow-md hover:bg-slate-800 hover:shadow-lg transition-all duration-300"
                >
                  <MicOff size={20} className="animate-recording" />
                  Stop Recording
                </button>
              )}

              <button
                onClick={() => {
                  cleanupRecording();
                  startRecording();
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:border-blue-300"
              >
                <RotateCcw size={20} />
                Record Again
              </button>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="mt-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-8 bg-red-500 rounded-full wave-bar"
                    ></div>
                  ))}
                </div>
                <span className="text-red-600 font-semibold">Recording in progress...</span>
              </div>
            )}
          </div>
        </div>

        {/* Answer Card */}
        <div className="slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <h3 className="text-sm font-semibold text-blue-600 mb-4 uppercase tracking-wide">
              Your Answer
            </h3>

            <textarea
              className="w-full h-48 border-2 border-blue-100 rounded-xl p-4 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
              placeholder="Your answer will appear here as you speak..."
              value={(finalText + " " + partial).trim()}
              onChange={(e) => setFinalText(e.target.value)}
            />

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-transcription enabled</span>
              </div>

              <button
                onClick={submitAnswer}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Send size={20} />
                Save & Next Question
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}