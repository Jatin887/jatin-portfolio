import Hero from "@/components/hero/Hero";
import SkillsGalaxy from "@/components/sections/SkillsGalaxy";
import Timeline from "@/components/sections/Timeline";
import Projects from "@/components/sections/Projects";
import TechUniverse from "@/components/sections/TechUniverse";
import Stats from "@/components/sections/Stats";
import Experience from "@/components/sections/Experience";
import Approach from "@/components/sections/Approach";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import Assistant from "@/components/assistant/Assistant";

export default function Home() {
  return (
    <>
      <Hero />
      <SkillsGalaxy />
      <Timeline />
      <Projects />
      <TechUniverse />
      <Stats />
      <Experience />
      <Approach />
      <Contact />
      <Footer />
      <Assistant />
    </>
  );
}
