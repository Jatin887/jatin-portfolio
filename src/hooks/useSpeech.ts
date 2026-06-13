"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { voiceBus } from "@/lib/voice-bus";

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;
  const prefs = [
    /en[-_]IN/i, // Indian English (matches Jatin)
    /(Google).*(UK|English).*Male/i,
    /Daniel/i,
    /(Google).*English/i,
    /en[-_]GB/i,
    /en[-_]US/i,
  ];
  for (const p of prefs) {
    const v = voices.find((vo) => p.test(`${vo.lang} ${vo.name}`));
    if (v) return v;
  }
  return voices.find((v) => /^en/i.test(v.lang)) ?? voices[0];
}

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined);
  const decayRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    const load = () => {
      voiceRef.current = pickVoice(window.speechSynthesis.getVoices());
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    voiceBus.setTalking(false);
    if (decayRef.current) cancelAnimationFrame(decayRef.current);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (!enabled) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 1.02;
      u.pitch = 1;
      u.volume = 1;

      let target = 0;
      const tick = () => {
        // ease mouth toward target, then decay target
        const cur = voiceBus.getMouth();
        voiceBus.setMouth(cur + (target - cur) * 0.4);
        target *= 0.86;
        decayRef.current = requestAnimationFrame(tick);
      };

      u.onstart = () => {
        setSpeaking(true);
        voiceBus.setTalking(true);
        tick();
      };
      u.onboundary = () => {
        target = 0.55 + Math.random() * 0.45;
      };
      u.onend = () => {
        setSpeaking(false);
        voiceBus.setTalking(false);
        if (decayRef.current) cancelAnimationFrame(decayRef.current);
        voiceBus.setMouth(0);
      };
      u.onerror = u.onend;
      window.speechSynthesis.speak(u);
    },
    [enabled]
  );

  useEffect(() => cancel, [cancel]);

  return { supported, speaking, speak, cancel, enabled, setEnabled };
}
