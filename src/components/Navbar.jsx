import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV } from "../data";
import { scrollToId } from "../lib/smooth";
import logo from "../assets/Logo.png";

export default function Navbar({ show }) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
  });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV.forEach(([, id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 350 : 0);
  };

  const toTop = (e) => {
    e.preventDefault();
    setOpen(false);
    window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden && !open ? -110 : 0, opacity: show ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3"
      >
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex w-full max-w-[1240px] items-center justify-between rounded-full bg-white/90 py-2 pl-5 pr-2 shadow-[0_10px_30px_-14px_rgba(7,26,58,.45)] ring-1 ring-ink/5 backdrop-blur-xl"
        >

          <a
            href="#top"
            onClick={toTop}
            aria-label="L&T Realty Sector 86, back to top"
            className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50"
          >
            <img
              src={logo}
              alt="L&T Realty"
              width="170"
              height="54"
              decoding="async"
              className="h-12 w-auto max-w-[170px] object-contain sm:h-10 sm:max-w-[180px]"
            />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map(([label, id], i) => {
              const last = i === NAV.length - 1;
              const isActive = active === id;
              return (
                <li key={id}>

                  <a
                    href={`#${id}`}
                    onClick={(e) => go(e, id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`block rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors ${last
                      ? "ml-1 bg-navy text-white hover:bg-navy-deep"
                      : isActive
                        ? "bg-mist text-navy"
                        : "text-ink/70 hover:text-ink"
                      }`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full bg-navy text-white lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-navy-deep gutter text-white"
          >
            <motion.a
              href="#top"
              onClick={toTop}
              aria-label="Back to top"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="mb-10 w-fit rounded-full bg-white px-5 py-3"
            >
              <img src={logo} alt="L&T Realty" className="h-9 w-auto max-w-[170px] object-contain" />
            </motion.a>

            <ul className="flex flex-col gap-1">
              {NAV.map(([label, id], i) => (
                <li key={id} className="overflow-hidden">
                  <motion.a
                    href={`#${id}`}
                    onClick={(e) => go(e, id)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.05 }}
                    className="block font-display text-[clamp(2.25rem,10vw,3.5rem)] font-semibold leading-[1.15] tracking-tight"
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}