import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const R = 54;
const C = 2 * Math.PI * R;
const EASE = [0.76, 0, 0.24, 1];

export default function Loader({ onLeave, onDone }) {
  const [p, setP] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let raf;
    let timer;
    const start = performance.now();
    const dur = 2400;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const k = Math.min((now - start) / dur, 1);
      setP(Math.round(ease(k) * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else {
        timer = setTimeout(() => {
          setLeaving(true);
          onLeave?.();
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      role="status"
      aria-label="Loading L&T Realty Sector 86"
      className="fixed inset-0 z-[100] bg-navy-deep text-white"
      initial={{ y: 0 }}
      animate={{ y: leaving ? "-100%" : 0 }}
      transition={{ duration: 1, ease: EASE, delay: leaving ? 0.45 : 0 }}
      onAnimationComplete={() => leaving && onDone()}
    >
      {/* curved trailing edge while the curtain lifts */}
      <div
        className="pointer-events-none absolute left-0 top-full h-[14vh] w-full bg-navy-deep"
        style={{ borderBottomLeftRadius: "50% 100%", borderBottomRightRadius: "50% 100%" }}
      />

      <motion.div
        className="flex h-full flex-col items-center justify-center"
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -24 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="relative grid h-36 w-36 place-items-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#f5b800"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - p / 100)}
            />
          </svg>
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="font-display text-4xl font-semibold tracking-tight"
          >
            L&amp;T
          </motion.span>
        </div>

        <div className="mt-8 overflow-hidden">
          <motion.p
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="font-display text-[clamp(1.1rem,2.2vw,1.6rem)] font-medium tracking-tight"
          >
            Realty Sector 86
          </motion.p>
        </div>
        <div className="mt-1 overflow-hidden">
          <motion.p
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="text-sm text-white/60"
          >
            New Gurugram
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between gutter pb-[clamp(1.25rem,3vw,2.5rem)]"
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="font-display text-[clamp(3.5rem,12vw,9rem)] font-semibold leading-none tabular-nums tracking-[-0.04em]">
          {p}
          <span className="text-gold">%</span>
        </span>
        <span className="pb-2 text-sm text-white/60">Loading preview</span>
      </motion.div>
    </motion.div>
  );
}
