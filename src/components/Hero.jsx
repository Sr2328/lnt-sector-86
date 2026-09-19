import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, NO_MOTION_PREF } from "../lib/gsap";
import { scrollToId } from "../lib/smooth";
import { IMG } from "../data";
import Img from "./Img";

const CHIPS = [
  ["20 acres", "Land parcel"],
  ["3.6 mn sq ft", "Development potential"],
  ["3 & 4 BHK", "Configurations"],
  ["Pre-launch", "RERA to be updated"],
];

// The marquee needs enough copies to always overfill the screen.
// The track slides by exactly one copy (100 / COPIES %) and loops seamlessly.
const COPIES = 4;

// Swaps the hero photo on phones (portrait crop instead of a squeezed landscape).
function useIsMobile(query = "(max-width: 767px)") {
  const [match, setMatch] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

export default function Hero({ reveal }) {
  const root = useRef(null);
  const isMobile = useIsMobile();

  // initial hidden state (only when motion is allowed)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_PREF, () => {
      gsap.set(".h-line", { yPercent: 130 }); // > 100% so the extra descender padding never shows the text early
      gsap.set(".h-fade", { opacity: 0, y: 28 });
      gsap.set(".h-img", { scale: 1.22 });
      gsap.set(".h-frame", { clipPath: "inset(6% 6% 6% 6% round 40px)" });
    }, root);
    return () => mm.revert();
  }, []);

  // entrance, fired as the loader curtain lifts
  useEffect(() => {
    if (!reveal) return;
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_PREF, () => {
      const tl = gsap.timeline({ delay: 0.25, defaults: { ease: "power4.out" } });
      tl.to(".h-frame", { clipPath: "inset(0% 0% 0% 0% round 40px)", duration: 1.5 }, 0)
        .to(".h-img", { scale: 1, duration: 2, ease: "power3.out" }, 0)
        .to(".h-line", { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0.35)
        .to(".h-fade", { opacity: 1, y: 0, duration: 1, stagger: 0.09 }, 0.85);
    }, root);
    return () => mm.revert();
  }, [reveal]);

  // scroll-linked parallax
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_PREF, () => {
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".h-photo", { yPercent: 14, ease: "none", scrollTrigger: st });
      gsap.to(".h-content", { yPercent: -10, opacity: 0.2, ease: "none", scrollTrigger: st });
    }, root);
    return () => mm.revert();
  }, []);

  // infinite stats marquee (eases down on hover, skipped for reduced motion)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_PREF, () => {
      const track = root.current.querySelector(".h-track");
      const wrap = root.current.querySelector(".h-marquee");
      if (!track || !wrap) return;

      const tween = gsap.to(track, {
        xPercent: -100 / COPIES,
        ease: "none",
        duration: 26,
        repeat: -1,
      });

      const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.6, overwrite: true });
      const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true });
      wrap.addEventListener("mouseenter", slow);
      wrap.addEventListener("mouseleave", fast);

      return () => {
        wrap.removeEventListener("mouseenter", slow);
        wrap.removeEventListener("mouseleave", fast);
      };
    }, root);
    return () => mm.revert();
  }, []);

  const fade = "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)";

  return (
    <section ref={root} id="top" className="relative p-3">
      <div className="h-frame relative flex min-h-[calc(100svh-1.5rem)] overflow-hidden rounded-[clamp(1.25rem,2.6vw,2.5rem)] bg-navy-deep text-white">
        <div className="h-photo absolute inset-0">
          {/*
            Desktop: IMG.hero (landscape).
            Phones:  IMG.heroMobile (portrait crop) — add it in ../data.
            Falls back to IMG.hero if heroMobile isn't defined yet.
          */}
          <Img
            key={isMobile ? "m" : "d"}
            src={isMobile ? IMG.heroMobile || IMG.hero : IMG.hero}
            alt="Residential towers in New Gurugram"
            className="absolute inset-0"
            imgClass="h-img object-cover object-[55%_40%] md:object-center"
            overscan
            eager
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/35 to-navy-deep/45" />
        {/* extra depth on phones so the headline + marquee stay readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/40 via-transparent to-navy-deep/70 md:hidden" />

        <div className="h-content relative z-10 flex w-full flex-col pb-[clamp(1.25rem,3vw,2.5rem)] pt-28">
          <div className="gutter flex flex-1 flex-col items-center justify-center gap-8 text-center md:gap-10">
            <div className="h-fade w-fit rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
              Sector 86, New Gurugram, Haryana
            </div>

            <div className="flex w-full max-w-4xl flex-col items-center gap-6">
              {/*
                Descender fix: each line sits in an overflow-hidden mask for the reveal.
                The old mask only had 0.08em bottom padding, so the tails of g / y were
                sliced off. Now: 0.2em padding-bottom keeps the descenders inside the
                mask, and -0.12em margin-bottom pulls the lines back together so the
                headline doesn't get looser.
              */}
              <h1 className="font-display text-[clamp(2.25rem,7.6vw,7.75rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
                <span className="-mb-[0.12em] block overflow-hidden pb-[0.2em]">
                  <span className="h-line block">Engineered for</span>
                </span>
                <span className="-mb-[0.12em] block overflow-hidden pb-[0.2em]">
                  <span className="h-line block">everyday living.</span>
                </span>
              </h1>

              <div className="h-fade max-w-[34ch]">
                <p className="text-[clamp(1rem,1.25vw,1.15rem)] leading-relaxed text-white/80">
                  L&amp;T Realty's first NCR address: 3 &amp; 4 BHK homes across 20 acres of New Gurugram.
                </p>
              </div>

              <div className="h-fade flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => scrollToId("inquire")}
                  className="rounded-full bg-gold px-6 py-3.5 text-[15px] font-semibold text-navy-deep transition-transform hover:scale-[1.03]"
                >
                  Register interest
                </button>
                <button
                  onClick={() => scrollToId("residences")}
                  className="rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-[15px] font-medium backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  Explore residences
                </button>
              </div>
            </div>
          </div>

          {/* stats — infinite marquee, edge-faded, plain text (static + centered under reduced motion) */}
          <div
            className="h-fade h-marquee mt-10 w-full overflow-hidden md:mt-14"
            style={{ maskImage: fade, WebkitMaskImage: fade }}
          >
            <div className="h-track flex w-max will-change-transform motion-reduce:w-full motion-reduce:justify-center">
              {Array.from({ length: COPIES }).map((_, copy) => (
                <div
                  key={copy}
                  aria-hidden={copy > 0 || undefined}
                  className={`flex shrink-0 items-center ${copy > 0 ? "motion-reduce:hidden" : "motion-reduce:flex-wrap motion-reduce:justify-center"}`}
                >
                  {CHIPS.map(([v, l]) => (
                    <div
                      key={l}
                      className="flex flex-col items-center whitespace-nowrap border-l border-white/15 px-9 text-center md:px-16"
                    >
                      <div className="font-display text-[clamp(1.2rem,2.1vw,1.9rem)] font-semibold tracking-tight">{v}</div>
                      <div className="mt-1 text-[13px] text-white/65">{l}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}