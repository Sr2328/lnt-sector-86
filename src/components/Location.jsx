import { useLayoutEffect, useRef } from "react";
import { gsap, NO_MOTION_PREF } from "../lib/gsap";
import MaskText from "./MaskText";

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
        ".road",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          stagger: 0.25,
          scrollTrigger: { trigger: ".loc-map", start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        ".pin-in",
        { scale: 0, transformOrigin: "50% 50%" },
        {
          scale: 1,
          duration: 0.9,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".loc-map", start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        ".loc-label",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.8,
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
          <div className="sticky top-24 overflow-hidden rounded-[clamp(1.25rem,2.4vw,2rem)] bg-white p-3 ring-1 ring-line">
            <svg viewBox="0 0 640 520" className="h-auto w-full" role="img" aria-label="Schematic map of routes reaching Sector 86">
              <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0H0V32" fill="none" stroke="#d5deec" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="640" height="520" rx="20" fill="#f6f8fb" />
              <rect width="640" height="520" rx="20" fill="url(#grid)" opacity=".7" />

              <g fill="none" stroke="#0b2a5b" strokeWidth="5" strokeLinecap="round">
                <path className="road" pathLength="1" strokeDasharray="1" d="M30 130 C150 150 240 240 330 285" />
                <path className="road" pathLength="1" strokeDasharray="1" d="M615 90 C520 150 430 225 330 285" />
                <path className="road" pathLength="1" strokeDasharray="1" d="M600 450 C500 400 410 340 330 285" stroke="#f5b800" />
              </g>

              <g className="loc-label" fontFamily="DM Sans, sans-serif" fontSize="15" fontWeight="600" fill="#0c1a2e">
                <text x="30" y="112">Dwarka Expressway</text>
                <text x="612" y="68" textAnchor="end">NH-48</text>
                <text x="596" y="478" textAnchor="end">Southern Peripheral Road</text>
              </g>

              <g className="loc-label" fontFamily="DM Sans, sans-serif" fontSize="13" fill="#0c1a2e">
                <circle cx="248" cy="352" r="6" fill="#fff" stroke="#0b2a5b" strokeWidth="2.5" />
                <text x="148" y="384">St. Andrews School ~1.8 km</text>
                <circle cx="96" cy="300" r="6" fill="#fff" stroke="#0b2a5b" strokeWidth="2.5" />
                <text x="40" y="282">K.R. Mangalam Univ. ~8 km</text>
              </g>

              <g className="pin-in">
                <circle cx="330" cy="285" r="26" fill="#f5b800" opacity=".28" className="animate-ping-slow" style={{ transformOrigin: "330px 285px" }} />
                <circle cx="330" cy="285" r="15" fill="#0b2a5b" />
                <circle cx="330" cy="285" r="6" fill="#f5b800" />
                <text x="356" y="278" fontFamily="Bricolage Grotesque, sans-serif" fontSize="19" fontWeight="700" fill="#0b2a5b">Sector 86</text>
              </g>
            </svg>
            <p className="px-2 pb-1 pt-2 text-xs text-ink/50">Schematic, not to scale.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
