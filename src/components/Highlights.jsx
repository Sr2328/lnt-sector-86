import { useLayoutEffect, useRef } from "react";
import { gsap, NO_MOTION_PREF } from "../lib/gsap";
import { HIGHLIGHTS } from "../data";
import Img from "./Img";
import MaskText from "./MaskText";

const TONES = {
  gold: "bg-gold text-navy-deep",
  navy: "bg-navy text-white",
};

function Card({ h }) {
  const solid = !h.img;
  return (
    <article
      className={`hz-card relative flex min-h-[420px] w-full shrink-0 flex-col justify-between overflow-hidden rounded-[clamp(1.25rem,2.2vw,2rem)] p-[clamp(1.25rem,2vw,2rem)] ${
        solid ? TONES[h.tone] : "bg-navy-deep text-white"
      }`}
    >
      {!solid && (
        <>
          <Img src={h.img} alt="" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-navy-deep/20" />
        </>
      )}
      <span
        className={`relative w-fit rounded-full px-3.5 py-1.5 text-[13px] font-medium ${
          solid ? "bg-black/10" : "border border-white/30 bg-white/10 backdrop-blur-md"
        }`}
      >
        {h.tag}
      </span>
      <div className="relative">
        <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.025em]">
          {h.title}
        </h3>
        <p className={`mt-4 max-w-[38ch] leading-relaxed ${solid ? "opacity-80" : "text-white/80"}`}>{h.body}</p>
      </div>
    </article>
  );
}

export default function Highlights() {
  const pin = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(`(min-width: 768px) and ${NO_MOTION_PREF}`, () => {
      pin.current.setAttribute("data-hz", "on");
      const dist = () => Math.max(0, track.current.scrollWidth - window.innerWidth);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(track.current, { x: () => -dist(), ease: "none" }, 0).to(bar.current, { scaleX: 1, ease: "none" }, 0);
      return () => pin.current?.removeAttribute("data-hz");
    });
    return () => mm.revert();
  }, []);

  return (
    <div id="highlights">
      <section ref={pin} className="relative overflow-hidden bg-mist py-[clamp(4rem,8vw,6rem)]">
        <div ref={track} className="hz-track grid gap-4 gutter [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <div className="hz-intro col-span-full flex shrink-0 flex-col justify-center pb-6">
            <p className="flex items-center gap-2.5 text-[15px] font-medium text-navy">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              Highlights
            </p>
            <MaskText
              text="Why Sector 86 is worth watching"
              className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <p className="mt-6 max-w-[34ch] text-ink/65">Six things to know before the official launch.</p>
          </div>

          {HIGHLIGHTS.map((h) => (
            <Card key={h.title} h={h} />
          ))}
          <div className="hz-end hidden w-[8vw] shrink-0" />
        </div>

        <div className="hz-bar pointer-events-none absolute inset-x-0 bottom-8 hidden gutter">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-navy/10">
            <div ref={bar} className="h-full origin-left scale-x-0 rounded-full bg-navy" />
          </div>
        </div>
      </section>
    </div>
  );
}
