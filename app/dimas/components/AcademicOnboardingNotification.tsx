"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GraduationCap, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useLanguage } from "../i18n/LanguageProvider";

export default function AcademicOnboardingNotification({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const hasShown = useRef(false);
  const soundOnEntrance = useRef(false);
  const dismissTimer = useRef<number | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioAttempted = useRef(false);

  const playChimeOnce = useCallback(() => {
    if (audioAttempted.current) return;
    audioAttempted.current = true;
    try {
      const context = audioContext.current ?? (audioContext.current = new window.AudioContext());
      // Never queue audio in a suspended context; it could otherwise play much later.
      if (context.state !== "running") return;
      const now = context.currentTime;
      [880, 1174].forEach((frequency, index) => {
        const startAt = now + index * 0.1;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startAt);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.035, startAt + 0.014);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.24);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + 0.25);
      });
    } catch {
      // Audio is optional; keep the notification usable if Web Audio fails.
    }
  }, []);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      if (hasShown.current || !entries.some((entry) => entry.isIntersecting)) return;
      hasShown.current = true;
      soundOnEntrance.current = true;
      observer.disconnect();
      setVisible(true);
      dismissTimer.current = window.setTimeout(() => {
        dismissTimer.current = null;
        soundOnEntrance.current = false;
        setVisible(false);
      }, 6000);
    }, { threshold: 0.12 });

    observer.observe(target);
    return () => {
      observer.disconnect();
      if (dismissTimer.current !== null) window.clearTimeout(dismissTimer.current);
      if (audioContext.current) {
        void audioContext.current.close().catch(() => {
          // Ignore cleanup errors from a browser audio context.
        });
        audioContext.current = null;
      }
    };
  }, [targetRef]);

  const dismiss = () => {
    if (dismissTimer.current !== null) {
      window.clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
    soundOnEntrance.current = false;
    setVisible(false);
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 sm:px-6"
      style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
    >
      <AnimatePresence>
        {visible && (
          <motion.aside
            role="status"
            aria-live="polite"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.985 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.99 }}
            onAnimationStart={() => {
              if (visible && soundOnEntrance.current) {
                soundOnEntrance.current = false;
                playChimeOnce();
              }
            }}
            transition={{ duration: reduceMotion ? 0.12 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative w-full max-w-[410px] overflow-hidden rounded-[22px] border border-white/20 p-3.5 text-white shadow-[0_16px_48px_rgba(0,0,0,0.25)] sm:p-4"
            style={{
              backgroundColor: "rgba(27, 28, 26, 0.68)",
              backdropFilter: "blur(28px) saturate(1.4)",
              WebkitBackdropFilter: "blur(28px) saturate(1.4)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-px rounded-[21px] bg-[linear-gradient(135deg,rgba(255,255,255,0.09),transparent_46%,rgba(208,255,113,0.025))]" />
            <div className="relative">
              <div className="mb-2.5 flex items-center gap-2 pr-8">
                <span className="size-1.5 rounded-full bg-[#d0ff71] shadow-[0_0_10px_rgba(208,255,113,0.5)]" />
                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/55">{t.academic.section}</span>
              </div>
              <div className="flex items-start gap-3 pr-6">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-[#d0ff71]/20 bg-[#d0ff71]/10 text-[#d0ff71]">
                  <GraduationCap aria-hidden="true" size={18} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-5 tracking-[-0.025em] sm:text-[15px]">{t.academic.onboarding.title}</p>
                  <p className="mt-1.5 text-xs leading-[1.6] text-white/75 sm:text-[13px]">{t.academic.onboarding.description}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t.academic.onboarding.close}
              className="absolute right-2 top-2 grid size-7 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d0ff71]"
            >
              <X aria-hidden="true" size={15} />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
