import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Loader2, Mail, Phone, User, ShieldCheck } from "lucide-react";
import { ENQUIRY_ENDPOINT, NAV } from "../data";
import { scrollToId } from "../lib/smooth";
import MaskText from "./MaskText";

const CONFIGS = ["3 BHK", "4 BHK", "Not sure yet"];
const EMPTY = { name: "", phone: "", email: "", config: "3 BHK", message: "", consent: false };

const STEPS = [
  ["Register", "Share your contact details and preferred configuration."],
  ["Get notified", "We reach out when official pricing and floor plans are published."],
  ["Confirm details", "You receive the RERA registration number with the launch information."],
];

const field =
  "w-full rounded-2xl border border-line bg-white py-3 pr-4 text-[15px] text-ink shadow-[0_1px_2px_rgba(11,42,91,0.06)] placeholder:text-ink/40 transition-[border-color,box-shadow,transform] duration-300 hover:border-navy/40 hover:shadow-[0_6px_18px_-8px_rgba(11,42,91,0.28)] focus:border-navy focus:outline-none focus:shadow-[0_12px_28px_-12px_rgba(11,42,91,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/35";

const ease = [0.22, 1, 0.36, 1];

function Field({ label, icon: Icon, children }) {
  return (
    <label className="group/field grid gap-1.5 text-sm font-medium">
      {label}
      <span className="relative block">
        <Icon
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 transition-colors duration-300 group-focus-within/field:text-navy group-hover/field:text-navy/70"
        />
        {children}
      </span>
    </label>
  );
}

export default function Enquire() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [sent, setSent] = useState(null); // snapshot shown on the confirmation
  const doneRef = useRef(null);
  const reduce = useReducedMotion();
  const busy = status === "sending";

  useEffect(() => {
    const onPrefill = (e) => setForm((f) => ({ ...f, config: e.detail }));
    window.addEventListener("lnt:prefill", onPrefill);
    return () => window.removeEventListener("lnt:prefill", onPrefill);
  }, []);

  // Move focus to the confirmation so screen readers announce it and small screens don't lose it.
  useEffect(() => {
    if (status === "done") doneRef.current?.focus({ preventScroll: false });
  }, [status]);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const payload = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    try {
      if (ENQUIRY_ENDPOINT) {
        const res = await fetch(ENQUIRY_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, source: "lnt-sector-86" }),
        });
        if (!res.ok) throw new Error("bad response");
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      setSent(payload);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setSent(null);
    setStatus("idle");
  };

  const firstName = sent?.name.split(" ")[0];

  return (
    <section id="inquire" className="relative rounded-t-[clamp(1.5rem,4vw,3.5rem)] bg-navy-deep text-white">
      <div className="section-y gutter">
        {/* items-stretch: both columns share one height; the form card fills whatever the text column needs */}
        <div className="mx-auto grid max-w-[1400px] gap-10 sm:gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-16">
          {/* ---------- Left: content ---------- */}
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <div>
              <p className="flex items-center gap-2.5 text-[15px] font-medium text-white/80">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                Enquire
              </p>
              <MaskText
                text="Register your interest before the official launch"
                className="mt-5 font-display text-[clamp(2.1rem,5vw,4.2rem)] font-semibold leading-[1] tracking-[-0.03em]"
              />
              <p className="mt-6 max-w-[42ch] leading-relaxed text-white/70">
                Share your details and we'll get in touch when official pricing, floor plans and the RERA registration
                number are published.
              </p>
            </div>

            <div>
              <h3 className="text-[15px] font-medium text-white/80">What happens next</h3>
              <ol className="mt-4 grid gap-4">
                {STEPS.map(([title, body], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-sm font-semibold text-gold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium leading-tight">{title}</p>
                      <p className="mt-1 max-w-[40ch] text-sm leading-relaxed text-white/60">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 flex items-start gap-2.5 border-t border-white/10 pt-5 text-sm text-white/55">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                Your details are used only to contact you about this project. No booking or payment is taken here.
              </p>
            </div>
          </div>

          {/* ---------- Right: form card ---------- */}
          <div className="flex lg:col-span-7">
            <div className="flex w-full flex-col rounded-[clamp(1.5rem,3vw,2.5rem)] bg-paper p-[clamp(1.1rem,2.8vw,2.5rem)] text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65),0_12px_28px_-12px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
              <AnimatePresence mode="wait" initial={false}>
                {status === "done" ? (
                  <motion.div
                    key="done"
                    ref={doneRef}
                    tabIndex={-1}
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="flex min-h-[380px] flex-1 flex-col items-center justify-center text-center outline-none"
                  >
                    <span className="relative grid h-16 w-16 place-items-center">
                      {!reduce && (
                        <motion.span
                          aria-hidden="true"
                          initial={{ scale: 1, opacity: 0.55 }}
                          animate={{ scale: 1.9, opacity: 0 }}
                          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3, repeat: 1 }}
                          className="absolute inset-0 rounded-full bg-gold"
                        />
                      )}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                        className="relative grid h-16 w-16 place-items-center rounded-full bg-gold text-navy-deep shadow-[0_14px_30px_-10px_rgba(212,168,67,0.8)]"
                      >
                        <Check size={30} strokeWidth={2.5} />
                      </motion.span>
                    </span>

                    <h3 className="mt-6 font-display text-[clamp(1.6rem,3.2vw,2.2rem)] font-semibold tracking-tight">
                      Thank you, {firstName || "you're registered"}
                    </h3>
                    <p className="mt-2 max-w-[44ch] leading-relaxed text-ink/70">
                      Your interest in a {sent?.config === "Not sure yet" ? "home" : sent?.config} at L&amp;T Realty
                      Sector-86 is registered. We'll contact you when official project details are released.
                    </p>

                    <dl className="mt-6 grid w-full max-w-[420px] gap-2.5 rounded-2xl border border-line bg-white p-4 text-left text-sm shadow-[0_10px_30px_-16px_rgba(11,42,91,0.35)]">
                      {[
                        ["Phone", sent?.phone],
                        ["Email", sent?.email],
                        ["Configuration", sent?.config],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4">
                          <dt className="text-ink/55">{k}</dt>
                          <dd className="min-w-0 break-words text-right font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-4 max-w-[44ch] text-xs leading-relaxed text-ink/50">
                      This is an expression of interest, not a booking. Pricing and RERA details will follow after
                      the official launch.
                    </p>

                    <button
                      onClick={reset}
                      className="mt-6 rounded-full border border-navy/20 bg-white px-7 py-3 text-[15px] font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-navy hover:bg-navy hover:text-white hover:shadow-[0_14px_28px_-12px_rgba(11,42,91,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
                    >
                      Register another person
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    noValidate={false}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-1 flex-col gap-4"
                  >
                    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))]">
                      <Field label="Full name" icon={User}>
                        <input
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={set("name")}
                          placeholder="Your name"
                          className={`${field} pl-11`}
                        />
                      </Field>
                      <Field label="Phone" icon={Phone}>
                        <input
                          required
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          pattern="[0-9+\s\-]{10,15}"
                          title="Enter a 10-digit phone number"
                          value={form.phone}
                          onChange={set("phone")}
                          placeholder="+91 98XXX XXXXX"
                          className={`${field} pl-11`}
                        />
                      </Field>
                    </div>

                    <Field label="Email" icon={Mail}>
                      <input
                        required
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="you@example.com"
                        className={`${field} pl-11`}
                      />
                    </Field>

                    <fieldset>
                      <legend className="mb-2 flex w-full items-baseline justify-between gap-3 text-sm font-medium">
                        Preferred configuration
                        <span className="text-xs font-normal text-ink/50">Choose one</span>
                      </legend>
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
                            <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium shadow-[0_1px_2px_rgba(11,42,91,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-navy/50 hover:shadow-[0_10px_20px_-10px_rgba(11,42,91,0.4)] active:translate-y-0 active:scale-95 peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-checked:shadow-[0_12px_24px_-10px_rgba(11,42,91,0.7)] peer-focus-visible:ring-4 peer-focus-visible:ring-gold/40">
                              {form.config === c && (
                                <motion.span
                                  initial={{ scale: 0, width: 0 }}
                                  animate={{ scale: 1, width: 14 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 26 }}
                                  className="grid place-items-center overflow-hidden"
                                >
                                  <Check size={14} strokeWidth={3} aria-hidden="true" />
                                </motion.span>
                              )}
                              {c}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {/* Message grows to absorb any extra height, so the card always matches the left column */}
                    <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium">
                      <span>
                        Message <span className="font-normal text-ink/50">(optional)</span>
                      </span>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={set("message")}
                        placeholder="Budget, timeline, or anything you'd like to know"
                        className={`${field} min-h-[84px] flex-1 resize-none pl-4`}
                      />
                    </label>

                    <label className="group/consent flex cursor-pointer items-start gap-3 text-sm leading-snug text-ink/70 transition-colors hover:text-ink">
                      <input
                        required
                        type="checkbox"
                        checked={form.consent}
                        onChange={set("consent")}
                        className="peer sr-only"
                      />
                      <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-md border border-ink/25 bg-white text-white shadow-sm transition-all duration-200 group-hover/consent:border-navy peer-checked:border-navy peer-checked:bg-navy peer-focus-visible:ring-4 peer-focus-visible:ring-gold/40 [&>svg]:scale-0 [&>svg]:transition-transform peer-checked:[&>svg]:scale-100">
                        <Check size={13} strokeWidth={3.5} aria-hidden="true" />
                      </span>
                      I agree to be contacted about this project by phone, email or WhatsApp.
                    </label>

                    {status === "error" && (
                      <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                        We couldn't send your enquiry. Check your connection and select Register interest again.
                      </p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={busy}
                      whileHover={busy || reduce ? undefined : { y: -3 }}
                      whileTap={busy || reduce ? undefined : { scale: 0.975, y: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 26 }}
                      className="group/cta relative isolate mt-1 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-navy px-8 py-4 text-[15px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(11,42,91,0.75)] transition-[box-shadow,color] duration-500 hover:text-navy-deep hover:shadow-[0_22px_44px_-14px_rgba(212,168,67,0.75)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none disabled:hover:text-white"
                    >
                      {/* gold fill sweeps in from the left on hover */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:scale-x-100 group-disabled/cta:hidden"
                      />
                      {/* light sheen passes across once on hover */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 -left-1/3 -z-10 w-1/4 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover/cta:left-[120%] group-hover/cta:opacity-100 group-disabled/cta:hidden"
                      />
                      {busy ? (
                        <>
                          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                          Sending your details…
                        </>
                      ) : (
                        <>
                          Register interest
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-all duration-500 group-hover/cta:translate-x-1 group-hover/cta:bg-navy-deep group-hover/cta:text-gold">
                            <ArrowRight size={16} aria-hidden="true" />
                          </span>
                        </>
                      )}
                    </motion.button>
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
              <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                L&amp;T REALTY - SECTOR-86, NEW GURUGRAM
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Pre-launch information. Project name, configurations, pricing, amenities and RERA registration are
                indicative and subject to official release by L&amp;T Realty. Images are illustrative. RERA no. to be
                updated.
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 md:max-w-[320px] md:justify-end">
              {NAV.map(([label, id]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(id);
                    }}
                    className="text-white/75 transition-colors hover:text-gold"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p
            aria-hidden="true"
            className="mt-14 select-none font-display text-[clamp(3.5rem,18vw,17rem)] font-semibold leading-[0.8] tracking-[-0.05em] text-white/[0.06]"
          >
            L&T REALTY
          </p>
        </div>
      </footer>
    </section>
  );
}