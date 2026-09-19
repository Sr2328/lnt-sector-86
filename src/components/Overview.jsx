import { useLayoutEffect, useRef } from "react";
import { gsap, NO_MOTION_PREF } from "../lib/gsap";
import { scrollToId } from "../lib/smooth";
import { IMG, OVERVIEW_TEXT, STATS } from "../data";
import Img from "./Img";
import Counter from "./Counter";

export default function Overview() {
  const root = useRef(null);
  const words = OVERVIEW_TEXT.split(" ");

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_PREF, () => {
      gsap.fromTo(
        ".ov-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: ".ov-text", start: "top 82%", end: "bottom 52%", scrub: true },
        }
      );
      gsap.fromTo(
        ".ov-media",
        { clipPath: "inset(14% 12% 14% 12% round 36px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          ease: "none",
          scrollTrigger: { trigger: ".ov-media", start: "top 92%", end: "top 30%", scrub: true },
        }
      );
      gsap.fromTo(
        ".ov-img",
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: ".ov-media", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section id="overview" ref={root} className="section-y gutter">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="flex items-center gap-2.5 text-[15px] font-medium text-navy lg:col-span-3 lg:pt-3">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            Overview
          </p>
          <p className="ov-text font-display text-[clamp(1.75rem,3.9vw,3.6rem)] font-medium leading-[1.14] tracking-[-0.022em] lg:col-span-9">
            {words.map((w, i) => (
              <span key={i} className="ov-word mr-[0.24em] inline-block">
                {w}
              </span>
            ))}
          </p>
        </div>

        <div className="mt-[clamp(3.5rem,8vw,7rem)] grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="ov-media relative aspect-[4/3] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[560px]">
            <Img
              src={IMG.exterior2}
              alt="Illustrative residential architecture"
              className="absolute inset-0"
              imgClass="ov-img"
              overscan
            />
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <div className="grid gap-x-8 gap-y-9 [grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr))]">
              {STATS.map((s) => (
                <div key={s.label} className="border-t border-line pt-5">
                  <div className="font-display text-[clamp(2.4rem,4.6vw,4.2rem)] font-semibold leading-none tracking-[-0.03em] text-navy">
                    {s.text ? s.text : <Counter to={s.to} decimals={s.decimals} suffix={s.suffix} />}
                  </div>
                  <p className="mt-3 max-w-[26ch] text-[15px] leading-snug text-ink/65">{s.label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="max-w-[46ch] leading-relaxed text-ink/70">
                The project is in its pre-launch stage. Name, configurations, pricing and RERA registration will be
                confirmed when L&amp;T Realty releases official documentation.
              </p>
              <button
                onClick={() => scrollToId("inquire")}
                className="mt-6 rounded-full bg-navy px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-navy-deep"
              >
                Request the brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
