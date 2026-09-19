import { useLayoutEffect, useRef } from "react";
import { gsap, NO_MOTION_PREF } from "../lib/gsap";

export default function Counter({ to, decimals = 0, suffix = "" }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION_PREF, () => {
      const o = { v: 0 };
      el.textContent = (0).toFixed(decimals);
      gsap.to(o, {
        v: to,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => (el.textContent = o.v.toFixed(decimals)),
      });
    });
    return () => mm.revert();
  }, [to, decimals]);

  return (
    <>
      <span ref={ref}>{to.toFixed(decimals)}</span>
      {suffix && <span className="ml-1 text-[0.36em] font-medium tracking-normal text-ink/60">{suffix}</span>}
    </>
  );
}
