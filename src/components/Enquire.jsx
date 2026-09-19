import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { ENQUIRY_ENDPOINT, NAV } from "../data";
import { scrollToId } from "../lib/smooth";
import MaskText from "./MaskText";

const CONFIGS = ["3 BHK", "4 BHK", "Not sure yet"];
const EMPTY = { name: "", phone: "", email: "", config: "3 BHK", message: "", consent: false };

const field =
  "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-ink placeholder:text-ink/40 transition-colors focus:border-navy focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

export default function Enquire() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  useEffect(() => {
    const onPrefill = (e) => setForm((f) => ({ ...f, config: e.detail }));
    window.addEventListener("lnt:prefill", onPrefill);
    return () => window.removeEventListener("lnt:prefill", onPrefill);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      if (ENQUIRY_ENDPOINT) {
        const res = await fetch(ENQUIRY_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, source: "lnt-sector-86" }),
        });
        if (!res.ok) throw new Error("bad response");
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="inquire" className="relative rounded-t-[clamp(1.5rem,4vw,3.5rem)] bg-navy-deep text-white">
      <div className="section-y gutter">
        <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-2.5 text-[15px] font-medium text-white/80">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              Enquire
            </p>
            <MaskText
              text="Register your interest before the official launch"
              className="mt-5 font-display text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[1] tracking-[-0.03em]"
            />
            <p className="mt-6 max-w-[40ch] leading-relaxed text-white/70">
              Share your details and we'll get in touch when official pricing, floor plans and the RERA registration
              number are published.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[clamp(1.25rem,2.4vw,2rem)] bg-paper p-[clamp(1.25rem,3vw,2.5rem)] text-ink">
              <AnimatePresence mode="wait" initial={false}>
                {status === "done" ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-h-[420px] flex-col items-center justify-center text-center"
                    role="status"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                      className="grid h-16 w-16 place-items-center rounded-full bg-gold text-navy-deep"
                    >
                      <Check size={30} strokeWidth={2.5} />
                    </motion.span>
                    <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">Thanks, {form.name.split(" ")[0] || "you're registered"}.</h3>
                    <p className="mt-2 max-w-[36ch] text-ink/65">We'll contact you when official project details are released.</p>
                    <button
                      onClick={() => { setForm(EMPTY); setStatus("idle"); }}
                      className="mt-8 rounded-full border border-line px-6 py-3 text-[15px] font-medium hover:bg-mist"
                    >
                      Send another enquiry
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid gap-5"
                  >
                    <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
                      <label className="grid gap-2 text-[15px] font-medium">
                        Full name
                        <input required autoComplete="name" value={form.name} onChange={set("name")} placeholder="Your name" className={field} />
                      </label>
                      <label className="grid gap-2 text-[15px] font-medium">
                        Phone
                        <input required type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+\s\-]{10,15}" title="Enter a 10-digit phone number" value={form.phone} onChange={set("phone")} placeholder="+91 98XXX XXXXX" className={field} />
                      </label>
                    </div>
                    <label className="grid gap-2 text-[15px] font-medium">
                      Email
                      <input required type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={field} />
                    </label>

                    <fieldset className="grid gap-2">
                      <legend className="mb-2 text-[15px] font-medium">Configuration</legend>
                      <div className="flex flex-wrap gap-2">
                        {CONFIGS.map((c) => (
                          <label key={c} className="cursor-pointer">
                            <input
                              type="radio"
                              name="config"
                              value={c}
                              checked={form.config === c}
                              onChange={set("config")}
                              className="peer sr-only"
                            />
                            <span className="block rounded-full border border-line bg-white px-5 py-2.5 text-[15px] font-medium transition-colors peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-gold">
                              {c}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <label className="grid gap-2 text-[15px] font-medium">
                      Message <span className="-mt-1 text-sm font-normal text-ink/50">Optional</span>
                      <textarea rows={3} value={form.message} onChange={set("message")} placeholder="Budget, timeline, or anything you'd like to know" className={`${field} resize-none`} />
                    </label>

                    <label className="flex items-start gap-3 text-sm text-ink/70">
                      <input required type="checkbox" checked={form.consent} onChange={set("consent")} className="mt-0.5 h-4 w-4 accent-[#0b2a5b]" />
                      I agree to be contacted about this project by phone, email or WhatsApp.
                    </label>

                    {status === "error" && (
                      <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                        We couldn't send your enquiry. Check your connection and try again.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="mt-1 rounded-full bg-navy px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-navy-deep disabled:opacity-60"
                    >
                      {status === "sending" ? "Sending…" : "Register interest"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <footer className="gutter border-t border-white/10 pb-10 pt-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="max-w-[52ch]">
              <p className="font-display text-2xl font-semibold tracking-tight">L&amp;T Realty · Sector 86</p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Pre-launch information. Project name, configurations, pricing, amenities and RERA registration are
                indicative and subject to official release by L&amp;T Realty. Images are illustrative. RERA no. to be updated.
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 md:max-w-[320px] md:justify-end">
              {NAV.map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }} className="text-white/75 transition-colors hover:text-gold">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p aria-hidden="true" className="mt-14 select-none font-display text-[clamp(4.5rem,21vw,19rem)] font-semibold leading-[0.8] tracking-[-0.05em] text-white/[0.06]">
            Sector 86
          </p>
        </div>
      </footer>
    </section>
  );
}
