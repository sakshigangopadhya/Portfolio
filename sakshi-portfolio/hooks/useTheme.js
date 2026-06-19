"use client";

import { useEffect, useState } from "react";

// Reads scroll progress published by ScrollTheme and returns
// interpolated color values for text and borders.
// ink:     charcoal (#2a2a2e) at top  →  pale grey (#e8e9ed) at bottom
// inkSoft: mid-grey (#55565c)         →  muted grey (#9a9ba3) at bottom
// border:  light grey (#d8d9dd)       →  dark border (#33343a) at bottom

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function lerpColor(c1, c2, t) {
  return `rgb(${lerp(c1[0], c2[0], t)}, ${lerp(c1[1], c2[1], t)}, ${lerp(c1[2], c2[2], t)})`;
}

const INK_LIGHT = [42, 42, 46];
const INK_DARK = [232, 233, 237];
const INK_SOFT_LIGHT = [85, 86, 92];
const INK_SOFT_DARK = [154, 155, 163];
const BORDER_LIGHT = [216, 217, 221];
const BORDER_DARK = [51, 52, 58];

export function useTheme() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId;
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const t = parseFloat(
        document.documentElement.getAttribute("data-scroll-progress") || "0"
      );
      setProgress(t);
    };
    tick();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return {
    progress,
    ink: lerpColor(INK_LIGHT, INK_DARK, progress),
    inkSoft: lerpColor(INK_SOFT_LIGHT, INK_SOFT_DARK, progress),
    border: lerpColor(BORDER_LIGHT, BORDER_DARK, progress),
    isDark: progress > 0.5,
  };
}