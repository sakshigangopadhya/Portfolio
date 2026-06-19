"use client";

import { useEffect, useRef } from "react";

export default function DarkOverlay() {
  const ref = useRef(null);

  useEffect(() => {
    let frameId;
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const progress = parseFloat(
        document.documentElement.getAttribute("data-scroll-progress") || "0"
      );
      if (ref.current) {
        ref.current.style.opacity = Math.min(1, progress * 1.8).toFixed(3);
      }
    };
    tick();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "#0e0e12",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}