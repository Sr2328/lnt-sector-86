import { useLayoutEffect, useRef } from "react";
import { gsap, NO_MOTION_PREF } from "../lib/gsap";
import MaskText from "./MaskText";
import Map from "../assets/Map.png"

const ROUTES = [
  ["Dwarka Expressway", "Access towards Delhi and IGI Airport"],
  ["NH-48", "Highway link to Gurugram's business districts"],
  ["Southern Peripheral Road", "Cross-city connector"],
];

const NEARBY = [
  ["St. Andrews School", "~1.8 km"],
  ["K.R. Mangalam University", "~8 km"],
];

export default function Location() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_PREF, () => {
      gsap.fromTo(
        ".loc-img",
        { scale: 1.12, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ".loc-map", start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        ".loc-chip",
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          delay: 0.9,
          scrollTrigger: { trigger: ".loc-map", start: "top 70%", once: true },
        }
      );
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section id="location" ref={root} className="section-y gutter bg-mist">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-2.5 text-[15px] font-medium text-navy">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            Location
          </p>
          <MaskText
            text="Sector 86, on New Gurugram's growth corridor"
            className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          />

          <h3 className="mt-12 font-display text-xl font-semibold tracking-tight">Arterial routes</h3>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {ROUTES.map(([n, d]) => (
              <li key={n} className="py-4">
                <p className="font-medium">{n}</p>
                <p className="text-[15px] text-ink/60">{d}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-display text-xl font-semibold tracking-tight">Nearby</h3>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {NEARBY.map(([n, d]) => (
              <li key={n} className="flex items-baseline justify-between py-4">
                <span className="font-medium">{n}</span>
                <span className="text-ink/60">{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink/55">Distances are approximate, taken from marketing sources. Verify before relying on them.</p>


          <a
            href="https://www.google.com/maps/search/?api=1&query=Sector+86+Gurugram"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-full bg-navy px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-navy-deep"
          >
            Open in Google Maps
          </a>
        </div>

        <div className="loc-map lg:col-span-7">
          <div className="sticky top-24 overflow-hidden rounded-[clamp(1.25rem,2.4vw,2rem)] bg-white ring-1 ring-line">
            <div className="relative aspect-[640/520] w-full overflow-hidden">
              <img
                src={Map}
                alt="Map showing routes reaching Sector 86, Gurugram"
                className="loc-img h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <span className="loc-chip absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm ring-1 ring-line">
                <span className="h-2 w-2 rounded-full bg-gold" />
                Sector 86, Gurugram
              </span>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}