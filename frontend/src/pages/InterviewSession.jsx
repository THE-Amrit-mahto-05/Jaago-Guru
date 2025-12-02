import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  // ----------------------------
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

  // ----------------------------
  // Deepgram TTS
  // ----------------------------
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

  // ----------------------------
  // Start Recording using browser Deepgram WS pattern
  // ----------------------------
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
        } catch {}
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

  // ----------------------------
  // Stop Recording
  // ----------------------------
  function stopRecording() {
    try {
      mediaRecorderRef.current?.stop();
    } catch {}

    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}

    try {
      wsRef.current?.close();
    } catch {}

    setIsRecording(false);
  }

  function cleanupRecording() {
    stopRecording();
  }

  // ----------------------------
  // Submit
  // ----------------------------
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

  // ----------------------------
  // UI
  // ----------------------------
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded"
          onClick={() => setStarted(true)}
        >
          Start Interview
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <main className="flex-1 p-8">Loading interview…</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold">Interview</h1>
          <p className="text-sm text-gray-500">
            Question {question.index} / {total}
          </p>

          <section className="bg-white p-6 mt-4 rounded shadow">
            <h2 className="font-semibold mb-2">Question</h2>
            <p>{question.text}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => playTTS(question.text)}
                disabled={isPlayingTTS}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {isPlayingTTS ? "Playing…" : "Play Question"}
              </button>

              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-gray-700 text-white rounded"
                >
                  Stop Recording
                </button>
              )}

              <button
                onClick={() => {
                  cleanupRecording();
                  startRecording();
                }}
                className="px-4 py-2 border rounded"
              >
                Record Again
              </button>
            </div>
          </section>

          <section className="bg-white p-6 mt-4 rounded shadow">
            <h3 className="font-semibold mb-2">Your Answer</h3>

            <textarea
              className="w-full h-40 border p-3 rounded"
              value={(finalText + " " + partial).trim()}
              onChange={(e) => setFinalText(e.target.value)}
            />

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="mt-4">
              <button
                onClick={submitAnswer}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {isSaving ? "Saving..." : "Save & Next"}
              </button>
            </div>
          </section>

          <div className="mt-4">
            <button
              onClick={() => {
                navigate(-1)
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Back
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}