"use client";

import { useEffect } from "react";

export default function ScrollTheme() {
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const t = maxScroll > 0
        ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
        : 0;

      doc.setAttribute("data-scroll-progress", t.toFixed(3));
      doc.setAttribute("data-theme", t > 0.5 ? "dark" : "light");

      const inkR = Math.round(42 + (232 - 42) * t);
      const inkG = Math.round(42 + (233 - 42) * t);
      const inkB = Math.round(46 + (237 - 46) * t);
      doc.style.setProperty("--ink-live", `rgb(${inkR},${inkG},${inkB})`);

      const sR = Math.round(85 + (154 - 85) * t);
      const sG = Math.round(86 + (155 - 86) * t);
      const sB = Math.round(92 + (163 - 92) * t);
      doc.style.setProperty("--ink-soft-live", `rgb(${sR},${sG},${sB})`);

      const bR = Math.round(216 + (51 - 216) * t);
      const bG = Math.round(217 + (52 - 217) * t);
      const bB = Math.round(221 + (58 - 221) * t);
      doc.style.setProperty("--border-live", `rgb(${bR},${bG},${bB})`);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return null;
}