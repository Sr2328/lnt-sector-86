import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, NO_MOTION_PREF } from "../lib/gsap";
import { GALLERY } from "../data";
import Img from "./Img";
import MaskText from "./MaskText";

export default function Gallery() {
  const root = useRef(null);
  const [open, setOpen] = useState(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_PREF, () => {
      gsap.utils.toArray(".g-item").forEach((item) => {
        gsap.fromTo(
          item,
          { clipPath: "inset(0% 0% 100% 0% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1.3,
            ease: "power4.out",
            scrollTrigger: { trigger: item, start: "top 90%", once: true },
          }
        );
        gsap.fromTo(
          item.querySelector("img"),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, root);
    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (open === null) return;
    window.__lenis?.stop();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <section id="gallery" ref={root} className="section-y gutter">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2.5 text-[15px] font-medium text-navy">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              Gallery
            </p>
            <MaskText
              text="A first look at the lifestyle"
              className="mt-5 font-display text-[clamp(2.4rem,5.4vw,5rem)] font-semibold leading-[1] tracking-[-0.03em]"
            />
          </div>
          <p className="max-w-[40ch] text-ink/65">Illustrative imagery. Official renders will replace these after launch.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-12 md:auto-rows-[minmax(0,1fr)]">
          {GALLERY.map((g, i) => (
            <button
              key={g.caption}
              onClick={() => setOpen(i)}
              aria-label={`Open image: ${g.caption}`}
              className={`g-item group relative overflow-hidden rounded-[28px] text-left ${g.span} ${g.ratio}`}
            >
              <Img src={g.src} alt={g.caption} className="absolute inset-0" overscan />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute bottom-4 left-4 translate-y-2 rounded-full bg-white/90 px-3.5 py-1.5 text-[13px] font-medium opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                {g.caption}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Gallery viewer"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-deep/95 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(null)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={open}
                className="relative w-full max-w-[1200px]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <Img src={GALLERY[open].src} alt={GALLERY[open].caption} className="aspect-[16/10] w-full rounded-3xl" />
                <figcaption className="mt-3 text-center text-white/80">{GALLERY[open].caption}</figcaption>
              </motion.figure>
            </AnimatePresence>

            <button aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X size={22} />
            </button>
            <button aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + GALLERY.length) % GALLERY.length); }} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-6">
              <ChevronLeft size={24} />
            </button>
            <button aria-label="Next image" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % GALLERY.length); }} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-6">
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
