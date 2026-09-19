import { useEffect, useState } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { initSmooth } from "./lib/smooth";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Overview from "./components/Overview";
import Highlights from "./components/Highlights";
import Residences from "./components/Residences";
import Amenities from "./components/Amenities";
import Location from "./components/Location";
import Gallery from "./components/Gallery";
import Enquire from "./components/Enquire";

export default function App() {
  const [reveal, setReveal] = useState(false); // curtain starts lifting
  const [loaded, setLoaded] = useState(false); // curtain gone

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = loaded ? "" : "hidden";
    if (!loaded) return;
    const destroy = initSmooth();
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 100);
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
      destroy();
    };
  }, [loaded]);

  return (
    <>
      {!loaded && <Loader onLeave={() => setReveal(true)} onDone={() => setLoaded(true)} />}
      <Navbar show={reveal} />
      <main>
        <Hero reveal={reveal} />
        <Marquee />
        <Overview />
        <Highlights />
        <Residences />
        <Amenities />
        <Location />
        <Gallery />
      </main>
      <Enquire />
    </>
  );
}
