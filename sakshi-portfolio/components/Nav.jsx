"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import styles from "./Nav.module.scss";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#connect", label: "Connect" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const islandRef = useRef(null);
  const logoRef = useRef(null);
  const linkRefs = useRef([]);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (!islandRef.current) return;

      // Background: white glass -> dark charcoal glass
      const bgR = Math.round(255 - (255 - 28) * t);
      const bgG = Math.round(255 - (255 - 28) * t);
      const bgB = Math.round(255 - (255 - 36) * t);
      const bgAlpha = 0.82 + t * 0.15;
      islandRef.current.style.background = `rgba(${bgR},${bgG},${bgB},${bgAlpha.toFixed(2)})`;
      islandRef.current.style.borderColor = t > 0.5 ? `rgba(255,255,255,0.1)` : `rgba(255,255,255,0.9)`;
      islandRef.current.style.boxShadow = `0 1px 1px rgba(0,0,0,${(0.03 + t*0.15).toFixed(2)}), 0 8px 24px rgba(0,0,0,${(0.08 + t*0.2).toFixed(2)}), inset 0 1px 0 rgba(255,255,255,${(0.6 - t*0.5).toFixed(2)})`;

      // Text: sharp switch at 0.5 threshold for maximum contrast at all times
      // Below 0.5: always dark charcoal (readable on white glass)
      // Above 0.5: always near-white (readable on dark glass)
      const textColor = t > 0.5 ? "rgb(240, 241, 245)" : "rgb(42, 42, 46)";
      const linkColor = t > 0.5 ? "rgb(200, 202, 210)" : "rgb(85, 86, 92)";

      if (logoRef.current) logoRef.current.style.color = textColor;
      linkRefs.current.forEach(el => { if (el) el.style.color = linkColor; });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <motion.header className={styles.navWrap} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      <motion.nav ref={islandRef} className={`${styles.island} ${scrolled ? styles.islandCompact : ""}`} layout transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
        <a href="#top" ref={logoRef} className={styles.logo}>Sakshi Gangopadhya</a>
        <ul className={styles.links}>
          {links.map((link, i) => (
            <li key={link.href}>
              <a href={link.href} ref={el => linkRefs.current[i] = el} className={styles.link}>{link.label}</a>
            </li>
          ))}
        </ul>
      </motion.nav>
    </motion.header>
  );
}