"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { about } from "@/data/profile";
import styles from "./About.module.scss";

function Waveform({ type = "ai" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frameId;
    let t = 0;

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      t += 0.01;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#3776A1";
      ctx.lineWidth = 1.6;

      if (type === "ai") {
        ctx.beginPath();
        ctx.globalAlpha = 0.6;
        for (let x = 0; x <= W; x++) {
          const p = x / W;
          const growth = H * 0.75 - (H * 0.55) * (1 / (1 + Math.exp(-8 * (p - 0.45))));
          const freq = 2 + p * 12;
          const amp = H * 0.04 + p * H * 0.08;
          const wave = Math.sin(p * Math.PI * freq + t * (1 + p * 2)) * amp;
          x === 0 ? ctx.moveTo(x, growth + wave) : ctx.lineTo(x, growth + wave);
        }
        ctx.stroke();
      } else if (type === "biz") {
        ctx.beginPath();
        ctx.globalAlpha = 0.58;
        for (let x = 0; x <= W; x++) {
          const p = x / W;
          const trend = H * 0.85 - p * H * 0.68;
          const roughness = (1 - p * 0.85) * H * 0.12;
          const noise = Math.sin(p * Math.PI * 18 + t * 2) * roughness + Math.sin(p * Math.PI * 31 + t * 3.1) * roughness * 0.5 + Math.cos(p * Math.PI * 7 + t) * roughness * 0.3;
          x === 0 ? ctx.moveTo(x, trend + noise) : ctx.lineTo(x, trend + noise);
        }
        ctx.stroke();
      } else if (type === "quantum") {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        for (let x = 0; x <= W; x++) {
          const p = x / W;
          const heavy = H / 2 + Math.sin(p * Math.PI * 3 + t * 0.4) * H * 0.3 * (1 - p * 0.5);
          x === 0 ? ctx.moveTo(x, heavy) : ctx.lineTo(x, heavy);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.globalAlpha = 0.35; ctx.strokeStyle = "#9B111E";
        for (let x = 0; x <= W; x++) {
          const p = x / W;
          const light = H / 2 + Math.sin(p * Math.PI * 11 + t * 1.8) * H * 0.12 * (0.3 + p * 0.9);
          x === 0 ? ctx.moveTo(x, light) : ctx.lineTo(x, light);
        }
        ctx.stroke();
      } else if (type === "patent") {
        ctx.beginPath();
        ctx.globalAlpha = 0.58;
        for (let x = 0; x <= W; x++) {
          const p = x / W;
          const trend = H * 0.78 - p * H * 0.52;
          const grind = Math.sin(p * Math.PI * 22 + t * 1.5) * H * 0.05;
          const b1 = Math.exp(-Math.pow((p - 0.28) * 14, 2)) * H * 0.28;
          const b2 = Math.exp(-Math.pow((p - 0.62) * 14, 2)) * H * 0.22;
          const b3 = Math.exp(-Math.pow((p - 0.88) * 14, 2)) * H * 0.3;
          x === 0 ? ctx.moveTo(x, trend + grind - b1 - b2 - b3) : ctx.lineTo(x, trend + grind - b1 - b2 - b3);
        }
        ctx.stroke();
      }
    };
    draw();
    return () => cancelAnimationFrame(frameId);
  }, [type]);

  return <canvas ref={canvasRef} className={styles.waveCanvas} />;
}

const tooltips = {
  ai: "Represents L0\u2192L3 growth. The wave starts flat and low, rises as skill compounds, and oscillates faster over time \u2014 reflecting increasing frequency of use across projects.",
  biz: "A steep learning curve. Jagged and rough at the start (learning on the job at LatentHQ), smoothing out as outreach, pipelines, and partnerships became second nature.",
  quantum: "Two competing signals: the slow heavy wave is the grind of learning quantum mechanics. The fast growing wave is the scale of opportunity emerging in the field.",
  patent: "Dense grind periods compressed into tight oscillations, punctuated by three breakthrough spikes \u2014 each representing a key research insight that led to the filed patent.",
};

const cards = [
  {
    id: "ai",
    eyebrow: "01 / AI Systems",
    title: "Machine Learning & Computer Vision",
    body: "L0 to L3 \u2014 from first models to funding-backed computer vision. Frequency of use keeps climbing.",
    stat: "90.6%",
    statLabel: "Classification accuracy",
    wave: "ai",
  },
  {
    id: "biz",
    eyebrow: "02 / Business Dev",
    title: "Learned By Doing",
    body: "Steep curve, learned through practice at LatentHQ. Rough early, sharp by the end.",
    stat: "100+",
    statLabel: "Prospects engaged",
    wave: "biz",
  },
  {
    id: "research",
    eyebrow: "03 / Quantum Computing",
    title: "Tedium vs Opportunity",
    body: "Two forces \u2014 the grind of understanding, and the scale of what becomes possible.",
    stat: "3",
    statLabel: "Research orgs",
    wave: "quantum",
  },
  {
    id: "patent",
    eyebrow: "04 / Innovation",
    title: "Grind, Research, Breakthrough",
    body: "Dense study and iteration, punctuated by moments where it clicks. Patent 202421044528.",
    stat: "202421044528",
    statLabel: "Patent No.",
    wave: "patent",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleWaveEnter = (e, type) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 12 });
    setActiveTooltip(type);
  };

  return (
    <section id="about" className={styles.about} ref={ref}>
      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          01 - {about.heading}
        </motion.p>

        <div className={styles.bento}>
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              className={`${styles.card} ${styles[card.id]}`}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardEyebrow}>{card.eyebrow}</span>
              </div>
              <div
                className={styles.waveWrap}
                onMouseEnter={(e) => handleWaveEnter(e, card.wave)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <Waveform type={card.wave} />
                <span className={styles.waveHint}>hover to decode</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.body}</p>
              </div>
              <div className={styles.cardStat}>
                <span className={styles.statNum}>{card.stat}</span>
                <span className={styles.statLabel}>{card.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeTooltip && (
          <motion.div
            className={styles.tooltip}
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {tooltips[activeTooltip]}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}