import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, Volume2, Send, RotateCcw, Sparkles, CircleHelp, ArrowLeft, CheckCircle, AlertCircle, Wifi } from "lucide-react";
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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showExitPopup, setShowExitPopup] = useState(false);

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const ttsAudioRef = useRef(null);

  useEffect(() => {
    return () => {
      cleanupRecording();
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current.currentTime = 0;
        ttsAudioRef.current = null;
      }
    };
  }, []);

  // ----------------------------
  // Load first question AFTER user clicks Start Interview
  useEffect(() => {
    if (!started) return;

    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/ interview / ${interviewId}/question`);

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

      const url = `${DG_TTS_URL}?model=aura-2-odysseus-en`;

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
      ttsAudioRef.current = audio

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
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current.currentTime = 0;
        ttsAudioRef.current = null;
        setIsPlayingTTS(false);
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // AUTH IS VIA SUBPROTOCOL: ["token", API_KEY]
      const ws = new WebSocket(
        "wss://api.deepgram.com/v1/listen?model=nova-3&language=en-US&punctuate=true&interim_results=true",
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
      setIsSaving(true)

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
      setTotal(next.total)

      await playTTS(next.text);
    }
    catch (err) {
      console.error("Submit error:", err);
      setError("Failed to save.");
    }
    finally {
      setIsSaving(false);
    }
  }

  // Start Screen
  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">

          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mic className="text-white" size={32} strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  AI Voice Interview Session
                </h1>
                <p className="text-slate-600">
                  Please review the requirements below before starting
                </p>
              </div>
            </div>
          </div>

          {/* Pre-Interview Checklist */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Pre-Interview Checklist</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Microphone Access</p>
                  <p className="text-sm text-slate-600">Ensure your microphone is connected and browser permissions are granted</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Volume2 className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Use Headphones (Recommended)</p>
                  <p className="text-sm text-slate-600">Headphones prevent audio feedback and provide better sound quality</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Quiet Environment</p>
                  <p className="text-sm text-slate-600">Find a quiet space to minimize background noise and distractions</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Wifi className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Stable Internet Connection</p>
                  <p className="text-sm text-slate-600">Required for real-time voice transcription and processing</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">How It Works</h2>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">1.</span>
                <span>Listen to each question read aloud by our AI interviewer</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">2.</span>
                <span>Click "Start Recording" and speak your answer clearly</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">3.</span>
                <span>Review the transcribed answer and submit to continue</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">4.</span>
                <span>Receive detailed feedback and analysis after completing all questions</span>
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={() => setStarted(true)}
              className="px-12 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Mic size={20} />
              Begin Interview Session
            </button>
            <p className="mt-4 text-sm text-slate-500">
              Click the button above when you're ready to start
            </p>
          </div>

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 relative">
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
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 transform transition-transform duration-300 hover:scale-110">
                  <CircleHelp className="text-white" size={28} strokeWidth={2.5} />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                  Question {question.index}
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
                disabled={isSaving}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 ${isSaving
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover:scale-105 active:scale-95"
                  }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Save & Next Question
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button - Top Left */}
      <button
        onClick={() => setShowExitPopup(true)}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl font-semibold shadow-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105"
      >
        <ArrowLeft size={20} />
        Exit Interview
      </button>

      {/* Exit Confirmation Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowExitPopup(false)}
          />

          {/* Modal */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-50 animate-scaleUp">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="text-red-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 text-center">Exit Interview?</h2>
              <p className="text-slate-600 mt-3 text-center">
                Are you sure you want to exit? Your current progress may not be saved.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExitPopup(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all duration-300"
              >
                Cancel
              </button>

              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}