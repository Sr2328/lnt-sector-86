import { useLayoutEffect, useRef } from "react";
import { Trees, Waves, Landmark, Trophy, Dumbbell, ShieldCheck, Baby, Droplets, Circle } from "lucide-react";
import { gsap, NO_MOTION_PREF } from "../lib/gsap";
import { AMENITIES } from "../data";
import MaskText from "./MaskText";

const ICONS = { Trees, Waves, Landmark, Trophy, Dumbbell, ShieldCheck, Baby, Droplets };

export default function Amenities() {
  const root = useRef(null);

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
        }
      );
    }, root);
    return () => mm.revert();
  }, []);

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

        <div className="am-grid mt-14 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,255px),1fr))]">
          {AMENITIES.map((a) => {
            const Icon = ICONS[a.icon] || Circle;
            return (
              <div
                key={a.title}
                className="am-tile group flex min-h-[230px] flex-col justify-between rounded-3xl bg-mist p-7 transition-colors duration-500 hover:bg-navy hover:text-white"
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
