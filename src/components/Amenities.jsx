import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Trees, Waves, Landmark, Trophy, Dumbbell, ShieldCheck, Baby, Droplets,
  Bike, BookOpen, Circle,
} from "lucide-react";
import { gsap, NO_MOTION_PREF } from "../lib/gsap";
import { AMENITIES } from "../data";
import MaskText from "./MaskText";

const ICONS = { Trees, Waves, Landmark, Trophy, Dumbbell, ShieldCheck, Baby, Droplets, Bike, BookOpen };

const FIRST_DELAY = 600;  // pause before the first image appears
const STEP_DELAY = 850;   // gap between one card's image and the next
const HOLD_ALL = 4000;    // all images visible, then vanish

export default function Amenities() {
  const root = useRef(null);
  const grid = useRef(null);
  const total = AMENITIES.length;

  const [revealed, setRevealed] = useState(0); // how many cards auto-show their image
  const [manual, setManual] = useState({});    // per-card manual override { [index]: boolean }
  const [inView, setInView] = useState(false);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // entrance animation (unchanged, but clear clip-path afterwards so the flip isn't clipped)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_PREF, () => {
      gsap.fromTo(
        ".am-tile",
        { clipPath: "inset(0 0 100% 0 round 24px)" },
        {
          clipPath: "inset(0 0 0% 0 round 24px)",
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: ".am-grid", start: "top 82%", once: true },
          onComplete: () => gsap.set(".am-tile", { clearProps: "clipPath" }),
        }
      );
    }, root);
    return () => mm.revert();
  }, []);

  // run the auto sequence only while the grid is on screen
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the loop: reveal one by one -> hold 4s -> vanish all -> repeat
  useEffect(() => {
    if (!inView || reduced) return;
    let t;
    if (revealed < total) {
      t = setTimeout(() => setRevealed((r) => r + 1), revealed === 0 ? FIRST_DELAY : STEP_DELAY);
    } else {
      t = setTimeout(() => {
        setManual({});
        setRevealed(0);
      }, HOLD_ALL);
    }
    return () => clearTimeout(t);
  }, [inView, revealed, total, reduced]);

  const isFlipped = (i) => (i in manual ? manual[i] : i < revealed);

  const toggle = (i) => setManual((m) => ({ ...m, [i]: !isFlipped(i) }));

  return (
    <section id="amenities" ref={root} className="section-y gutter bg-paper">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-2.5 text-[15px] font-medium text-navy">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              Amenities
            </p>
            <MaskText
              text="Everything a 20-acre community can hold"
              className="mt-5 font-display text-[clamp(2.4rem,5.4vw,5rem)] font-semibold leading-[1] tracking-[-0.03em]"
            />
          </div>
          <p className="max-w-[44ch] leading-relaxed text-ink/65 lg:col-span-5 lg:justify-self-end">
            An indicative list based on L&amp;T Realty's project benchmarks. The final amenity plan will be confirmed at launch.
          </p>
        </div>

        <div
          ref={grid}
          className="am-grid mt-14 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,255px),1fr))]"
        >
          {AMENITIES.map((a, i) => {
            const Icon = ICONS[a.icon] || Circle;
            const flipped = isFlipped(i);

            return (
              <button
                type="button"
                key={a.title}
                onClick={() => toggle(i)}
                aria-pressed={flipped}
                aria-label={`${a.title} – ${flipped ? "show details" : "show photo"}`}
                className="am-tile group min-h-[230px] text-left [perspective:1200px]"
              >
                <div
                  className="relative h-full min-h-[230px] w-full transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d]"
                  style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                  {/* FRONT */}
                  <div
                    className="absolute inset-0 flex flex-col justify-between rounded-3xl bg-mist p-7 transition-colors duration-500 hover:bg-navy hover:text-white"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-navy transition-colors duration-500 group-hover:bg-gold group-hover:text-navy-deep">
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="font-display text-[1.35rem] font-semibold tracking-tight">{a.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-snug text-ink/60 transition-colors duration-500 group-hover:text-white/70">
                        {a.body}
                      </p>
                    </div>
                  </div>

                  {/* BACK (image) */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-3xl bg-navy"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    {a.img && (
                      <img
                        src={a.img}
                        alt={a.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-5 text-white">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-navy-deep">
                        <Icon size={18} strokeWidth={1.8} />
                      </span>
                      <h3 className="font-display text-lg font-semibold tracking-tight">{a.title}</h3>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}