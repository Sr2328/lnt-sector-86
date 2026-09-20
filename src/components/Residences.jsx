import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HOMES } from "../data";
import { scrollToId } from "../lib/smooth";
import Img from "./Img";
import MaskText from "./MaskText";
import FeatureLayoutsImg from "../assets/SpaciousLayout.png";
import FeatureBalconiesImg from "../assets/Balcony.png";
import FeatureCeilingsImg from "../assets/HighCeleing.png";
import FeatureWindowsImg from "../assets/WideWindows.png";

const FEATURE_PANELS = [
  {
    title: "Spacious layouts",
    img: FeatureLayoutsImg,
    desc: "Open, well-planned interiors with flowing living and dining spaces that make every square foot count.",
  },
  {
    title: "Large balconies",
    img: FeatureBalconiesImg,
    desc: "Generous balconies that extend your living space outdoors, with open views across Sector 86.",
  },
  {
    title: "High ceilings",
    img: FeatureCeilingsImg,
    desc: "Added ceiling height for an airy, premium feel with better natural light and ventilation.",
  },
  {
    title: "Wide windows",
    img: FeatureWindowsImg,
    desc: "Expansive glazing that floods rooms with daylight and frames the skyline and greenery outside.",
  },
];

export default function Residences() {
  const [id, setId] = useState(HOMES[0].id);
  const [hot, setHot] = useState(null);
  const home = HOMES.find((h) => h.id === id);

  const request = () => {
    window.dispatchEvent(new CustomEvent("lnt:prefill", { detail: home.label }));
    scrollToId("inquire");
  };

  return (
    <section id="residences" className="section-y gutter">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2.5 text-[15px] font-medium text-navy">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              Residences
            </p>
            <MaskText
              text="Two ways to live at Sector 86"
              className="mt-5 max-w-[16ch] font-display text-[clamp(2.4rem,5.4vw,5rem)] font-semibold leading-[1] tracking-[-0.03em]"
            />
          </div>

          <div role="tablist" aria-label="Home configuration" className="relative flex w-fit rounded-full bg-mist p-1.5">
            {HOMES.map((h) => (
              <button
                key={h.id}
                role="tab"
                aria-selected={h.id === id}
                onClick={() => setId(h.id)}
                className={`relative z-10 rounded-full px-8 py-3 text-[15px] font-semibold transition-colors ${h.id === id ? "text-white" : "text-ink/70 hover:text-ink"
                  }`}
              >
                {h.id === id && (
                  <motion.span
                    layoutId="home-tab"
                    className="absolute inset-0 -z-10 rounded-full bg-navy"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {h.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[clamp(1.25rem,2.4vw,2rem)] lg:col-span-7">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={home.id}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0 0 0 100%)", scale: 1.08 }}
                animate={{ clipPath: "inset(0 0 0 0%)", scale: 1 }}
                exit={{ opacity: 0.4 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              >
                <Img src={home.img} alt={`Illustrative ${home.label} interior`} className="absolute inset-0" />
              </motion.div>
            </AnimatePresence>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3.5 py-1.5 text-[13px] font-medium text-ink backdrop-blur-md">
              Illustrative image
            </span>
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={home.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.025em]">
                  {home.title}
                </h3>
                <p className="mt-4 max-w-[46ch] leading-relaxed text-ink/70">{home.desc}</p>
                <dl className="mt-8 divide-y divide-line border-y border-line">
                  {home.specs.map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-6 py-4">
                      <dt className="text-ink/60">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={request}
                className="rounded-full bg-navy px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-navy-deep"
              >
                Request {home.label} floor plans
              </button>
            </div>
          </div>
        </div>

        <div
          className="mt-16 flex flex-col gap-3 lg:h-[clamp(420px,46vw,640px)] lg:flex-row lg:gap-0 lg:overflow-hidden lg:rounded-[clamp(1.25rem,2.4vw,2rem)]"
          onMouseLeave={() => setHot(null)}
        >
          {FEATURE_PANELS.map((f, i) => {
            const on = hot === i;
            return (
              <div
                key={f.title}
                tabIndex={0}
                role="button"
                aria-pressed={on}
                onMouseEnter={() => setHot(i)}
                onFocus={() => setHot(i)}
                onBlur={() => setHot(null)}
                onClick={() => setHot(on ? null : i)}
                style={{ flexGrow: on ? 2.4 : 1 }}
                className="relative h-[320px] cursor-pointer overflow-hidden rounded-3xl outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-auto lg:basis-0 lg:rounded-none lg:border-l lg:border-white/40 lg:first:border-l-0"
              >
                <div
                  className={`absolute inset-0 transition-[filter,transform] duration-700 ${on ? "lg:scale-105 lg:grayscale-0" : "lg:grayscale"
                    }`}
                >
                  <img
                    src={f.img}
                    alt={f.title}
                    loading="eager"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/40 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-70"
                    }`}
                />

                <h4 className="absolute left-6 top-6 font-display text-[13px] font-semibold uppercase tracking-[0.28em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                  {f.title}
                </h4>

                <p
                  className={`absolute inset-x-6 bottom-6 max-w-[34ch] text-[15px] leading-relaxed text-white transition-all duration-500 ${on
                    ? "opacity-100 translate-y-0 lg:delay-150"
                    : "opacity-100 translate-y-0 lg:translate-y-4 lg:opacity-0"
                    }`}
                >
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-ink/55">
          Home features are indicative and drawn from marketing material. Final specifications will be confirmed by L&amp;T Realty.
        </p>
      </div>
    </section>
  );
}