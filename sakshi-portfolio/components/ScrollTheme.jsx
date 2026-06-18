"use client";

import { useEffect, useRef } from "react";

function noise2D(x, y, seed) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

export default function ScrollTheme() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let targetProgress = 0;
    let progress = 0;
    let frameId = 0;
    let t = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const handleScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      targetProgress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    };

    const drawBlob = (cx, cy, radius, seedShift, alpha) => {
      ctx.beginPath();
      const segments = 220;

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;

        const n1 = noise2D(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, Math.floor(t * 2) + seedShift);
        const n2 = noise2D(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, Math.floor(t * 3) + seedShift + 19);
        const wobble =
          (n1 - 0.5) * radius * 0.16 +
          (n2 - 0.5) * radius * 0.08 +
          Math.sin(angle * 3.0 + t * 0.8 + seedShift) * radius * 0.035;

        const r = Math.max(0, radius + wobble);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = `rgba(15, 17, 28, ${alpha})`;
      ctx.fill();
    };

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      t += 0.01;
      progress += (targetProgress - progress) * 0.075;

      document.documentElement.style.setProperty("--theme-t", progress.toFixed(4));
      document.documentElement.setAttribute("data-scroll-progress", progress.toFixed(4));
      document.documentElement.setAttribute("data-theme", progress > 0.58 ? "dark" : "light");

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (progress <= 0.003) return;

      const cx = width * 0.5;
      const cy = height * 0.5;
      const maxRadius = Math.hypot(width, height) * 0.68;
      const baseRadius = progress * maxRadius;

      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.15);
      bloom.addColorStop(0, `rgba(10, 12, 22, ${0.48 + progress * 0.18})`);
      bloom.addColorStop(0.28, `rgba(12, 14, 24, ${0.34 + progress * 0.18})`);
      bloom.addColorStop(0.62, `rgba(14, 16, 26, ${0.18 + progress * 0.12})`);
      bloom.addColorStop(1, "rgba(14, 16, 26, 0)");

      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      drawBlob(cx, cy, baseRadius, 0, 0.92);
      drawBlob(cx, cy, baseRadius * 0.82, 31, 0.55);

      const tendrilCount = 5;
      for (let i = 0; i < tendrilCount; i++) {
        const angle = t * 0.18 + (i / tendrilCount) * Math.PI * 2;
        const tendrilRadius = baseRadius * (0.42 + i * 0.08);
        const x = cx + Math.cos(angle) * tendrilRadius * 0.36;
        const y = cy + Math.sin(angle) * tendrilRadius * 0.36;
        drawBlob(x, y, baseRadius * (0.18 + progress * 0.08), 100 + i * 17, 0.14);
      }
    };

    resize();
    handleScroll();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -9,
        pointerEvents: "none",
      }}
    />
  );
}

