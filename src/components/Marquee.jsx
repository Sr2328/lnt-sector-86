import { MARQUEE } from "../data";

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden border-b border-line py-5" aria-hidden="true">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium tracking-tight text-navy">
            {t}
            <span className="h-2 w-2 rotate-45 bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
