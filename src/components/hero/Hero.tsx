"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { person } from "@/content/profile";
import { voiceBus } from "@/lib/voice-bus";
import BootOverlay from "./BootOverlay";
import Subtitles from "./Subtitles";

const AvatarCanvas = dynamic(() => import("./AvatarCanvas"), {
  ssr: false,
  loading: () => <CanvasFallback />,
});

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-24 w-24 animate-spin-slow rounded-full border-2 border-neon-blue/30 border-t-neon-blue" />
    </div>
  );
}

const SUBTITLE_CHUNKS = [
  "Hi, I'm Jatin.",
  "I'm a Software Engineer specializing in Identity Governance,",
  "Full Stack Development, Cloud Technologies,",
  "and AI-powered applications.",
  "Let me show you some of my work.",
];

function RotatingTitle() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = person.titles[i];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && shown.length < full.length) {
      timeout = setTimeout(() => setShown(full.slice(0, shown.length + 1)), 55);
    } else if (!deleting && shown.length === full.length) {
      timeout = setTimeout(() => setDeleting(true), 1900);
    } else if (deleting && shown.length > 0) {
      timeout = setTimeout(() => setShown(full.slice(0, shown.length - 1)), 28);
    } else {
      setDeleting(false);
      setI((p) => (p + 1) % person.titles.length);
    }
    return () => clearTimeout(timeout);
  }, [shown, deleting, i]);

  return (
    <span className="caret font-display text-neon-cyan neon-text">{shown}</span>
  );
}

export default function Hero() {
  const [booting, setBooting] = useState(true);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);
  const dataRef = useRef<Uint8Array | null>(null);

  const stopAnalysis = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    voiceBus.setTalking(false);
    voiceBus.setMouth(0);
  }, []);

  const runAnalysis = useCallback(() => {
    const analyser = analyserRef.current;
    const audio = audioRef.current;
    if (!analyser || !audio || !dataRef.current) return;
    const data = dataRef.current;
    const duration = audio.duration || 13;

    const tick = () => {
      analyser.getByteTimeDomainData(data as Uint8Array<ArrayBuffer>);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      voiceBus.setMouth(Math.min(1, rms * 3.2));

      // subtitle by time fraction
      const frac = audio.currentTime / duration;
      const idx = Math.min(SUBTITLE_CHUNKS.length - 1, Math.floor(frac * SUBTITLE_CHUNKS.length));
      setSubtitle(SUBTITLE_CHUNKS[idx]);

      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const fallbackSubtitles = useCallback(() => {
    voiceBus.setTalking(true);
    let idx = 0;
    setSubtitle(SUBTITLE_CHUNKS[0]);
    const id = setInterval(() => {
      idx++;
      if (idx >= SUBTITLE_CHUNKS.length) {
        clearInterval(id);
        setSubtitle(null);
        voiceBus.setTalking(false);
        return;
      }
      setSubtitle(SUBTITLE_CHUNKS[idx]);
    }, 2400);
  }, []);

  // Procedural mouth + timed subtitles when the analyser isn't available.
  const runProcedural = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const duration = audio.duration || 13;
    const tick = () => {
      if (audio.paused || audio.ended) return;
      voiceBus.setMouth(0.35 + (Math.sin(audio.currentTime * 12) * 0.5 + 0.5) * 0.55);
      const frac = audio.currentTime / duration;
      const idx = Math.min(SUBTITLE_CHUNKS.length - 1, Math.floor(frac * SUBTITLE_CHUNKS.length));
      setSubtitle(SUBTITLE_CHUNKS[idx]);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const playGreeting = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = muted;
    audio.volume = 1;
    try {
      audio.currentTime = 0;
    } catch {
      /* not yet seekable */
    }
    voiceBus.setTalking(true);

    // Best-effort Web Audio analyser for amplitude-driven lip-sync.
    let analyserReady = false;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        if (!ctxRef.current) {
          const ctx = new AC();
          const source = ctx.createMediaElementSource(audio);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          analyser.connect(ctx.destination);
          ctxRef.current = ctx;
          analyserRef.current = analyser;
          sourceRef.current = source;
          dataRef.current = new Uint8Array(analyser.fftSize);
        }
        ctxRef.current.resume();
        analyserReady = !!analyserRef.current && !!dataRef.current;
      }
    } catch {
      analyserReady = false;
    }

    audio
      .play()
      .then(() => {
        if (analyserReady) runAnalysis();
        else runProcedural();
      })
      .catch(() => {
        // Playback blocked entirely: still narrate via subtitles + mouth.
        fallbackSubtitles();
      });
  }, [muted, runAnalysis, runProcedural, fallbackSubtitles]);

  const initialize = useCallback(() => {
    setBooting(false);
    setTimeout(playGreeting, 700);
  }, [playGreeting]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => {
      stopAnalysis();
      setSubtitle(null);
    };
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("ended", onEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, [stopAnalysis]);

  const replay = () => {
    setSubtitle(null);
    playGreeting();
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  };

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden">
      {/* No crossOrigin: same-origin file. Setting it would taint the Web Audio
          source (dev server sends no CORS header) and play silence. */}
      <audio ref={audioRef} src={person.greetingAudio} preload="auto" />
      <BootOverlay visible={booting} onInitialize={initialize} />
      <Subtitles text={subtitle} />

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-6 px-6 pt-24 lg:grid-cols-2 lg:gap-4 lg:pt-0">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: booting ? 0 : 1, y: booting ? 30 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-neon-cyan">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-neon-green" />
            Available for senior & staff roles
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-foreground">Hi, I&apos;m </span>
            <span className="text-gradient">{person.firstName}</span>
          </h1>

          <div className="mt-4 min-h-[2.2rem] text-xl font-semibold sm:text-2xl">
            <RotatingTitle />
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {person.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#projects"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-6 py-3 text-sm font-semibold text-white shadow-glow-purple"
            >
              <span className="relative z-10">View My Work</span>
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            </a>
            <a
              href={person.resume}
              download
              className="rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10"
            >
              Download Resume
            </a>
          </div>

          {!booting && (
            <div className="mt-6 flex items-center gap-2 text-xs text-faint">
              <button onClick={replay} className="flex items-center gap-1.5 rounded-full px-3 py-2.5 transition hover:bg-white/5 hover:text-neon-cyan">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.4 2.6L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Replay intro
              </button>
              <button onClick={toggleMute} className="flex items-center gap-1.5 rounded-full px-3 py-2.5 transition hover:bg-white/5 hover:text-neon-cyan">
                {muted ? "🔇 Unmute" : "🔊 Sound on"}
              </button>
            </div>
          )}
        </motion.div>

        {/* Right: avatar */}
        <div className="relative order-1 h-[52vh] w-full lg:order-2 lg:h-screen">
          <div className="absolute inset-0">
            <AvatarCanvas />
          </div>
          {/* speaking indicator */}
          <SpeakingBadge />
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: booting ? 0 : 1 }}
        transition={{ delay: 1.2 }}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="flex h-9 w-5 justify-center rounded-full border border-white/20 pt-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-neon-cyan"
          />
        </div>
      </motion.div>
    </section>
  );
}

function SpeakingBadge() {
  const [talking, setTalking] = useState(false);
  useEffect(() => voiceBus.subscribe(() => setTalking(voiceBus.isTalking())), []);
  if (!talking) return null;
  return (
    <div className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full glass-strong px-3 py-1.5">
      <div className="flex items-end gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-0.5 rounded-full bg-neon-cyan"
            animate={{ height: [4, 12, 6, 14, 4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-wider text-neon-cyan">Speaking</span>
    </div>
  );
}
