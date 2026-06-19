"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import styles from "./Experience.module.scss";

const TYPE_COLORS = {
  founding: "#1b2a4a",
  internship: "#3776A1",
  research: "#9B111E",
  current: "#2a2a2e",
};

const entries = [
  {
    type: "founding",
    period: "Year 1 - 2023",
    title: "Founder & Tech Lead",
    org: "ASTECH",
    description: "Founded a student science club focused on bridging the school-to-college gap in scientific thinking and exposure.",
    stats: [],
  },
  {
    type: "founding",
    period: "Year 2 - 2024",
    title: "Founder & Tech Lead",
    org: "QQuest",
    description: "Built a quantum computing and mechanics club that successfully converted into a minor specialisation at the university. Invited and collaborated with scientists from CDAC, IISER, and TCG Crest.",
    stats: [
      { value: 3, suffix: "", label: "Research orgs" },
      { value: 1, suffix: "", label: "University specialisation" },
    ],
  },
  {
    type: "internship",
    period: "11 Months - 2025",
    title: "Technical Intern",
    org: "LatentHQ",
    description: "Executed targeted outreach campaigns, built automated pipelines, and managed strategic partnerships in the AI/tech domain.",
    stats: [
      { value: 100, suffix: "+", label: "Prospects engaged" },
      { value: 30, suffix: "%+", label: "Efficiency gained" },
    ],
  },
  {
    type: "research",
    period: "2024 - Present",
    title: "Core Researcher",
    org: "CRiEYA Project",
    description: "Metal identification and classification system for aluminium alloys using computer vision and edge-deployed CNNs. Secured funding and achieved high accuracy on structured test data.",
    stats: [
      { value: 4, suffix: "L", label: "Funding secured" },
      { value: 90.6, suffix: "%", label: "Classification accuracy" },
    ],
  },
  {
    type: "research",
    period: "2024",
    title: "Researcher",
    org: "Satellite Data - Crop Health",
    description: "Worked on satellite remote sensing data for crop health monitoring using NDVI, SAR analysis, and geospatial processing pipelines.",
    stats: [],
  },
  {
    type: "current",
    period: "2025 - Present",
    title: "Final Year Student",
    org: "MIT-ADT University",
    description: "B.Tech Computer Engineering. Thesis, research publications, and industry projects in progress. Building toward a career at the intersection of AI systems and quantitative analysis.",
    stats: [],
  },
];

function CountUp({ target, suffix, isActive }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isActive) { setVal(0); return; }
    const isDecimal = target % 1 !== 0;
    const duration = 1000;
    const steps = 35;
    const step = target / steps;
    let current = 0;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      current = Math.min(target, step * count);
      setVal(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));
      if (count >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isActive, target]);

  return <>{val}{suffix}</>;
}

function TimelineEntry({ entry, index, isInView }) {
  const [open, setOpen] = useState(false);
  const isLeft = index % 2 === 0;
  const color = TYPE_COLORS[entry.type];

  return (
    <div className={`${styles.entry} ${isLeft ? styles.left : styles.right}`}>
      <motion.div
        className={styles.node}
        style={{ background: color, boxShadow: `0 0 0 4px ${color}22` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      />

      <motion.div
        className={`${styles.card} ${open ? styles.cardOpen : ""}`}
        initial={{ opacity: 0, scale: 0.93 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.18 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setOpen(!open)}
      >
        <div className={styles.cardHeader}>
          <div className={styles.cardMeta}>
            <span className={styles.period} style={{ color }}>{entry.period}</span>
            <span className={styles.typeBadge} style={{ background: `${color}18`, color }}>
              {entry.type}
            </span>
          </div>
          <div className={styles.titleRow}>
            <div>
              <h3 className={styles.title}>{entry.title}</h3>
              <p className={styles.org}>{entry.org}</p>
            </div>
            <motion.span
              className={styles.chevron}
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ color }}
            >
              &#8964;
            </motion.span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className={styles.cardBody}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className={styles.desc}>{entry.description}</p>
              {entry.stats.length > 0 && (
                <div className={styles.stats}>
                  {entry.stats.map((stat) => (
                    <div key={stat.label} className={styles.stat}>
                      <span className={styles.statNum} style={{ color }}>
                        <CountUp target={stat.value} suffix={stat.suffix} isActive={open} />
                      </span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className={styles.experience} ref={ref}>
      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          03 - Experience
        </motion.p>
        <p className={styles.hint}>Click any entry to expand</p>

        <div className={styles.timeline}>
          <div className={styles.line} />
          {entries.map((entry, i) => (
            <TimelineEntry key={i} entry={entry} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}