import CosmicSphere from "@/components/CosmicSphere";
import ScrollTheme from "@/components/ScrollTheme";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";

import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <CosmicSphere />
      <ScrollTheme />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        
        <Contact />
      </main>
    </>
  );
}