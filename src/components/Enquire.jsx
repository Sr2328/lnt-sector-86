import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Loader2,
  Mail,
  Phone,
  User,
  ShieldCheck,
  MessageCircle,
  Clock,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
import { ENQUIRY_ENDPOINT, NAV, CONTACT } from "../data";
import { scrollToId } from "../lib/smooth";
import MaskText from "./MaskText";

const CONFIGS = ["3 BHK", "4 BHK", "Not sure yet"];
const EMPTY = { name: "", phone: "", email: "", config: "3 BHK", message: "", consent: false };

const STEP_MS = 3200;
const STEPS = [
  ["Register", "Share your contact details and preferred configuration."],
  ["Get notified", "We reach out when official pricing and floor plans are published."],
  ["Confirm details", "You receive the RERA registration number with the launch information."],
];

const field =
  "w-full rounded-2xl border border-line bg-white py-2.5 pr-4 text-[15px] text-ink shadow-[0_1px_2px_rgba(11,42,91,0.06)] placeholder:text-ink/40 transition-[border-color,box-shadow,transform] duration-300 hover:border-navy/40 hover:shadow-[0_6px_18px_-8px_rgba(11,42,91,0.28)] focus:border-navy focus:outline-none focus:shadow-[0_12px_28px_-12px_rgba(11,42,91,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/35";

const SOCIAL_ICONS = { Instagram, Facebook, Linkedin, Youtube };
const waHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappText)}`;

const CONTACT_ROWS = [
  { icon: Phone, label: "Call us", value: CONTACT.phone, href: `tel:${CONTACT.phoneHref}` },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: waHref, external: true },
  { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
];

const ease = [0.22, 1, 0.36, 1];

function Field({ label, icon: Icon, children }) {
  return (
    <label className="group/field grid gap-1 text-sm font-medium">
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

/* Looping walkthrough: one step is highlighted at a time, a gold line fills toward the next, then it restarts.
   Pauses on hover/focus. With reduced motion it shows all steps statically. */
function Steps() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS);
    return () => clearInterval(t);
  }, [reduce, paused, active]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h3 className="text-[15px] font-medium text-white/80">What happens next</h3>
      <ol className="mt-5">
        {STEPS.map(([title, body], i) => {
          const on = reduce || i === active;
          const last = i === STEPS.length - 1;
          return (
            <li key={title} aria-current={!reduce && i === active ? "step" : undefined} className={`relative flex gap-4 ${last ? "" : "pb-7"}`}>
              {!last && (
                <span aria-hidden="true" className="absolute bottom-[6px] left-[17px] top-[42px] w-px overflow-hidden bg-white/15">
                  {!reduce && i < active && <span className="block h-full w-full bg-gold" />}
                  {!reduce && i === active && (
                    <motion.span
                      key={`fill-${active}`}
                      className="block h-full w-full origin-top bg-gold"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: paused ? undefined : 1 }}
                      transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    />
                  )}
                </span>
              )}

              <span
                className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-all duration-500 ${on ? "scale-110 border-gold bg-gold text-navy-deep" : "border-white/25 text-gold"
                  }`}
              >
                {i + 1}
                {!reduce && i === active && (
                  <motion.span
                    key={`ring-${active}`}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-gold"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.9, opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                )}
              </span>

              <motion.div
                animate={{ opacity: on ? 1 : 0.4, x: on && !reduce ? 6 : 0 }}
                transition={{ duration: 0.5, ease }}
              >
                <p className="font-medium leading-tight">{title}</p>
                <p className="mt-1 max-w-[40ch] text-sm leading-snug text-white/65">{body}</p>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function Enquire() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [sent, setSent] = useState(null);
  const doneRef = useRef(null);
  const reduce = useReducedMotion();
  const busy = status === "sending";

  useEffect(() => {
    const onPrefill = (e) => setForm((f) => ({ ...f, config: e.detail }));
    window.addEventListener("lnt:prefill", onPrefill);
    return () => window.removeEventListener("lnt:prefill", onPrefill);
  }, []);

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
        <div className="mx-auto grid max-w-[1400px] gap-x-16 gap-y-12 lg:grid-cols-12 lg:gap-y-16">
          {/* ---------- Row 1, left: heading, description, looping steps (no container) ---------- */}
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <div>
              <p className="flex items-center gap-2.5 text-[15px] font-medium text-white/80">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                Enquire
              </p>
              <MaskText
                text="Register your interest before the official launch"
                className="mt-5 font-display text-[clamp(2.1rem,4.4vw,4rem)] font-semibold leading-[1] tracking-[-0.03em]"
              />
              <p className="mt-6 max-w-[42ch] leading-relaxed text-white/70">
                Share your details and we'll get in touch when official pricing, floor plans and the RERA registration
                number are published.
              </p>
            </div>
            <Steps />
          </div>

          {/* ---------- Row 1, right: form ---------- */}
          <div className="flex lg:col-span-7">
            <div className="flex w-full flex-col rounded-[clamp(1.5rem,3vw,2.5rem)] bg-paper p-[clamp(1.1rem,2.4vw,2rem)] text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65),0_12px_28px_-12px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
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
                    className="flex min-h-[340px] flex-1 flex-col items-center justify-center text-center outline-none"
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

                    <h3 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.2rem)] font-semibold tracking-tight">
                      Thank you, {firstName || "you're registered"}
                    </h3>
                    <p className="mt-2 max-w-[44ch] leading-relaxed text-ink/70">
                      Your interest in a {sent?.config === "Not sure yet" ? "home" : sent?.config} at L&amp;T Realty
                      Sector-86 is registered. We'll contact you when official project details are released.
                    </p>

                    <dl className="mt-5 grid w-full max-w-[420px] gap-2 rounded-2xl border border-line bg-white p-4 text-left text-sm shadow-[0_10px_30px_-16px_rgba(11,42,91,0.35)]">
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

                    <p className="mt-3 max-w-[44ch] text-xs leading-relaxed text-ink/50">
                      This is an expression of interest, not a booking. Pricing and RERA details will follow after
                      the official launch.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-[15px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
                      >
                        <MessageCircle size={17} aria-hidden="true" />
                        Continue on WhatsApp
                      </a>
                      <button
                        onClick={reset}
                        className="rounded-full border border-navy/20 bg-white px-7 py-3 text-[15px] font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-navy hover:bg-navy hover:text-white hover:shadow-[0_14px_28px_-12px_rgba(11,42,91,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
                      >
                        Register another person
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-1 flex-col gap-3.5"
                  >
                    <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr))]">
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
                      <legend className="mb-1.5 flex w-full items-baseline justify-between gap-3 text-sm font-medium">
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
                            <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium shadow-[0_1px_2px_rgba(11,42,91,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-navy/50 hover:shadow-[0_10px_20px_-10px_rgba(11,42,91,0.4)] active:translate-y-0 active:scale-95 peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-checked:shadow-[0_12px_24px_-10px_rgba(11,42,91,0.7)] peer-focus-visible:ring-4 peer-focus-visible:ring-gold/40">
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

                    {/* Message absorbs any extra height so the card always matches the left column */}
                    <label className="flex flex-1 flex-col gap-1 text-sm font-medium">
                      <span>
                        Message <span className="font-normal text-ink/50">(optional)</span>
                      </span>
                      <textarea
                        rows={2}
                        value={form.message}
                        onChange={set("message")}
                        placeholder="Budget, timeline, or anything you'd like to know"
                        className={`${field} min-h-[64px] flex-1 resize-none pl-4`}
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
                      className="group/cta relative isolate flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-navy px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(11,42,91,0.75)] transition-[box-shadow,color] duration-500 hover:text-navy-deep hover:shadow-[0_22px_44px_-14px_rgba(212,168,67,0.75)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none disabled:hover:text-white"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:scale-x-100 group-disabled/cta:hidden"
                      />
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

          {/* ---------- Row 2, full width: contact details, each in its own card ---------- */}
          <div className="lg:col-span-12">
            <h3 className="text-[15px] font-medium text-white/80">Contact us directly</h3>

            <ul className="mt-5 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
              {CONTACT_ROWS.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group/card flex h-full items-center gap-4 rounded-[clamp(1rem,2vw,1.5rem)] border border-white/15 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:bg-white/[0.08] hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 text-gold transition-colors duration-300 group-hover/card:border-gold group-hover/card:bg-gold group-hover/card:text-navy-deep">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-white/55">{label}</span>
                      <span className="block break-words text-[17px] font-medium leading-tight">{value}</span>
                    </span>
                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 -translate-x-1 text-white/40 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:text-gold"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2 text-sm text-white/55 sm:flex-row sm:flex-wrap sm:gap-x-10">
              <p className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                Your details are used only to contact you about this project. No booking or payment is taken here.
              </p>
              {CONTACT.hours && (
                <p className="flex items-start gap-2.5">
                  <Clock size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  {CONTACT.hours}
                </p>
              )}
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

              <ul className="mt-5 flex flex-wrap gap-2">
                {CONTACT.socials
                  .filter((s) => s.href)
                  .map((s) => {
                    const Icon = SOCIAL_ICONS[s.icon];
                    return (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-navy-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
                        >
                          {Icon && <Icon size={18} aria-hidden="true" />}
                        </a>
                      </li>
                    );
                  })}
              </ul>
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
              <li>
                <button
                  onClick={() => window.dispatchEvent(new Event("lnt:cookie-settings"))}
                  className="text-white/75 transition-colors hover:text-gold"
                >
                  Cookie settings
                </button>
              </li>
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