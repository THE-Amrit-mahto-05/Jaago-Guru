import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, Volume2, Send, RotateCcw, ArrowLeft, CheckCircle, AlertTriangle, Wifi, Radio, Globe, Activity, AudioLines } from "lucide-react";
import api from "../api";

const DG_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;
const DG_TTS_URL = "https://api.deepgram.com/v1/speak";

export default function InterviewSession() {
  const { id } = useParams();
  const interviewId = Number(id);
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [total, setTotal] = useState(null);
  const [role, setRole] = useState("");
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
        
        setRole(res.data.role);
        setTotal(res.data.total);
        console.log(res.data)

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

  async function playTTS(text) {
    if (!text || !DG_KEY) return;

    try {
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
      setRole(next.role);
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

  // Pre-Check Screen (Start Interview)
  if (!started) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6 font-sans text-neutral-900">
        <div className="absolute inset-0 pointer-events-none opacity-[0.2]"
             style={{
                backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
             }}>
        </div>

        <div className="max-w-2xl w-full relative z-10">
          
          {/* Header */}
          <div className="bg-white border border-neutral-200 p-8 shadow-sm mb-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                <AudioLines size={100} />
             </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center shadow-sm">
                <Mic className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  Interview Setup
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                   Please review these requirements before we begin.
                </p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white border border-neutral-200 p-8 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Instructions</h2>
                <div className="text-[10px] font-mono text-neutral-400">STEP 1 OF 1</div>
            </div>

            <div className="space-y-4">
              {[
                  { icon: CheckCircle, title: "Microphone", desc: "Please ensure you allow microphone access." },
                  { icon: Volume2, title: "Audio", desc: "Headphones are recommended for clear audio." },
                  { icon: AlertTriangle, title: "Environment", desc: "Find a quiet place with minimal background noise." },
                  { icon: Wifi, title: "Internet", desc: "A stable connection is required for real-time feedback." }
              ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100">
                    <item.icon className="text-neutral-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-bold text-neutral-900 uppercase tracking-wide">{item.title}</p>
                      <p className="text-xs text-neutral-500 font-mono mt-1">{item.desc}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="text-center">
            <button
              onClick={() => setStarted(true)}
              className="w-full py-4 bg-neutral-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-3 group cursor-pointer"
            >
              <Radio size={18} className="text-red-500 animate-pulse" />
              Start Interview
            </button>
            <p className="mt-4 text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
              Your session is private & secure
            </p>
          </div>

        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-neutral-900 rounded-full animate-spin"></div>
            </div>
          <div className="text-center">
             <p className="text-sm font-bold uppercase tracking-widest text-neutral-900">Loading Session</p>
             <p className="text-xs text-neutral-400 font-mono mt-2">Preparing your interview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const progress = ((question.index) / total) * 100;

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-6 relative font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <div className="absolute inset-0 pointer-events-none opacity-[0.2]"
             style={{
                backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
             }}>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-3rem)]">

        {/* Left Panel: Question & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
            
            {/* Header Status */}
          <div className="bg-white border border-neutral-200 p-6 shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <Activity size={16} className="text-green-500" />
                Live Interview
              </h1>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1 font-mono">
                <span>Q{question.index} of {total}</span>

                {role && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm">
                      {role}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="w-32">
              <div className="flex justify-between text-[10px] font-bold text-neutral-400 mb-1">
                <span>PROGRESS</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-neutral-100 w-full overflow-hidden">
                <div className="h-full bg-neutral-900 transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>

          {/* Question Card - Prominent */}
          <div className="bg-white border border-neutral-200 p-8 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-900 via-neutral-400 to-neutral-200"></div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 block">
                  Question {question.index}
              </span>
              
              <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 leading-tight mb-8">
                {question.text}
              </h2>

              <div className="flex flex-wrap gap-4 mt-auto">
                  <button
                      onClick={() => playTTS(question.text)}
                      disabled={isPlayingTTS}
                      className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider border transition-colors
                      ${isPlayingTTS ? "bg-neutral-100 text-neutral-400 border-neutral-200 hover: cursor-not-allowed" : "bg-white text-neutral-900 border-neutral-300 hover:border-neutral-900 cursor-pointer"}`}
                  >
                      <Volume2 size={16} />
                      {isPlayingTTS ? "Speaking..." : "Repeat Question"}
                  </button>
                  
                  <button
                      onClick={() => {
                      cleanupRecording();
                      startRecording();
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-neutral-600 border border-neutral-300 text-sm font-bold uppercase tracking-wider hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
                  >
                      <RotateCcw size={16} />
                      Record Again
                  </button>
              </div>
          </div>

          {/* Recording Controls */}
          <div className="bg-neutral-900 text-white p-6 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                  {isRecording && (
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 animate-pulse">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Recording Live
                      </span>
                  )}
              </div>
              
              {!isRecording ? (
                  <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-8 py-3 bg-white text-neutral-900 text-sm font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                      <Mic size={16} />
                      Start Recording
                  </button>
              ) : (
                  <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-colors cursor-pointer"
                  >
                      <MicOff size={16} />
                      Stop Recording
                  </button>
              )}
          </div>
        </div>

        {/* Right Panel: Transcription & Submit */}
        <div className="lg:col-span-5 flex flex-col h-full bg-white border border-neutral-200 shadow-sm">
            <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
               <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">Your Answer (Live Transcript)</h3>
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="System Ready"></span>
            </div>

            <textarea
              className="flex-1 w-full p-6 text-sm font-mono text-neutral-700 focus:outline-none resize-none bg-white leading-relaxed"
              placeholder="Your answer will appear here as you speak..."
              value={(finalText + " " + partial).trim()}
              onChange={(e) => setFinalText(e.target.value)}
            />

            {error && (
               <div className="px-6 py-3 bg-red-50 border-t border-red-100 text-red-600 text-xs font-bold uppercase">
                  Error: {error}
               </div>
            )}

            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
               <button
                  onClick={submitAnswer}
                  disabled={isSaving}
                  className={`w-full py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                  ${isSaving 
                     ? "bg-neutral-200 text-neutral-400 cursor-not-allowed" 
                     : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-md cursor-pointer"}`}
               >
                  {isSaving ? (
                     <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                     </>
                  ) : (
                     <>
                        <Send size={16} />
                        Submit Answer
                     </>
                  )}
               </button>
            </div>
        </div>
      </div>

      {/* Exit Button - Absolute Top Right */}
      <button
        onClick={() => setShowExitPopup(true)}
        className="fixed top-6 left-6 z-50 p-3 bg-white border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm cursor-pointer"
        title="Exit Interview"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Exit Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setShowExitPopup(false)} />
          
          <div className="bg-white border border-neutral-200 shadow-2xl p-0 w-96 z-50 relative">
             <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500"/>
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Exit Interview?</h2>
             </div>
             
             <div className="p-6">
                <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
                  Are you sure you want to leave? Your progress for this question may be lost.
                </p>

                <div className="flex gap-3">
                   <button
                      onClick={() => setShowExitPopup(false)}
                      className="flex-1 py-3 border border-neutral-200 text-sm font-bold uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                   >
                      Cancel
                   </button>
                   <button
                      onClick={() => navigate(-1)}
                      className="flex-1 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-red-700 cursor-pointer"
                   >
                      Exit
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}