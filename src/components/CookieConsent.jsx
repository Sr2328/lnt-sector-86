import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "lnt-cookie-consent-v1";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

const write = (v) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch { }
  window.dispatchEvent(new CustomEvent("lnt:consent", { detail: v }));
};

const CATEGORIES = [
  { id: "necessary", title: "Essential", body: "Keeps the site and enquiry form working. Always on.", locked: true },
  { id: "analytics", title: "Analytics", body: "Helps us see which sections visitors use." },
  { id: "marketing", title: "Marketing", body: "Lets us measure and improve our ads." },
];

function Switch({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-gold" : "bg-white/20"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full transition-all duration-300 ${checked ? "left-6 bg-navy-deep" : "left-1 bg-white"
          }`}
      />
    </button>
  );
}

export default function CookieConsent({ ready }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    if (!ready) return;
    const saved = read();
    if (saved) {
      setPrefs({ analytics: !!saved.analytics, marketing: !!saved.marketing });
      return;
    }
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    const reopen = () => {
      const saved = read();
      if (saved) setPrefs({ analytics: !!saved.analytics, marketing: !!saved.marketing });
      setCustom(true);
      setOpen(true);
    };
    window.addEventListener("lnt:cookie-settings", reopen);
    return () => window.removeEventListener("lnt:cookie-settings", reopen);
  }, []);

  const save = (p) => {
    setPrefs(p);
    write({ necessary: true, ...p, ts: Date.now() });
    setOpen(false);
    setCustom(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="dialog"
          aria-label="Cookie preferences"
          initial={{ y: 40, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-3 left-3 right-3 z-[80] sm:right-auto sm:max-w-[460px]"
        >
          <motion.div
            layout
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[clamp(1.25rem,2vw,1.75rem)] bg-navy-deep p-[clamp(1.1rem,2vw,1.5rem)] text-white shadow-[0_24px_60px_-20px_rgba(7,26,58,.7)] ring-1 ring-white/10"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!custom ? (
                <motion.div
                  key="main"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-semibold tracking-tight">
                    We use cookies
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                    Essential cookies keep this site running. With your permission, we'd also use analytics and
                    marketing cookies to understand visits and improve our enquiry experience.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => save({ analytics: true, marketing: true })}
                      className="rounded-full bg-gold px-5 py-3 text-[15px] font-semibold text-navy-deep transition-transform hover:scale-[1.03]"
                    >
                      Accept all
                    </button>
                    <button
                      onClick={() => save({ analytics: false, marketing: false })}
                      className="rounded-full border border-white/30 px-5 py-3 text-[15px] font-medium transition-colors hover:bg-white/10"
                    >
                      Reject non-essential
                    </button>
                    <button
                      onClick={() => setCustom(true)}
                      className="px-2 py-3 text-[15px] font-medium text-white/80 underline underline-offset-4 transition-colors hover:text-white"
                    >
                      Customise
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="custom"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-semibold tracking-tight">
                    Cookie preferences
                  </h2>
                  <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                    {CATEGORIES.map((c) => (
                      <li key={c.id} className="flex items-center justify-between gap-5 py-4">
                        <div>
                          <p className="font-medium">{c.title}</p>
                          <p className="mt-0.5 text-sm leading-snug text-white/60">{c.body}</p>
                        </div>
                        <Switch
                          label={c.title}
                          disabled={c.locked}
                          checked={c.locked ? true : prefs[c.id]}
                          onChange={() => setPrefs((p) => ({ ...p, [c.id]: !p[c.id] }))}
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => save(prefs)}
                      className="rounded-full bg-gold px-5 py-3 text-[15px] font-semibold text-navy-deep transition-transform hover:scale-[1.03]"
                    >
                      Save choices
                    </button>
                    <button
                      onClick={() => save({ analytics: true, marketing: true })}
                      className="rounded-full border border-white/30 px-5 py-3 text-[15px] font-medium transition-colors hover:bg-white/10"
                    >
                      Accept all
                    </button>
                    <button
                      onClick={() => setCustom(false)}
                      className="px-2 py-3 text-[15px] font-medium text-white/80 underline underline-offset-4 hover:text-white"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}