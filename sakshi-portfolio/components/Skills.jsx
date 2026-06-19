"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { skills } from "@/data/profile";
import styles from "./Skills.module.scss";

const proficiency = [88, 92, 65, 78, 82, 75];

function ProficiencyBar({ value, isInView, delay }) {
  return (
    <div className={styles.barTrack}>
      <motion.div
        className={styles.barFill}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className={styles.barValue}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.8 }}
      >
        {value}%
      </motion.span>
    </div>
  );
}

function SkillTag({ item }) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    setHovered(true);
  };

  return (
    <>
      <motion.span
        className={styles.skillTag}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovered(false)}
        animate={hovered ? { opacity: 1 } : {}}
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          className={styles.skillDot}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {item.name}
      </motion.span>

      <AnimatePresence>
        {hovered && (
          <motion.div
            className={styles.tooltip}
            style={{ left: pos.x, top: pos.y }}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <span className={styles.tooltipName}>{item.name}</span>
            <div className={styles.tooltipBar}>
              <div className={styles.tooltipFill} style={{ width: `${item.level}%` }} />
            </div>
            <span className={styles.tooltipValue}>{item.level}%</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className={styles.skills} ref={ref}>
      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          02 - Skills
        </motion.p>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span className={styles.colGroup}>Domain</span>
            <span className={styles.colSkills}>Skills</span>
            <span className={styles.colBar}>Proficiency</span>
          </div>

          {skills.groups.map((group, i) => (
            <motion.div
              key={group.label}
              className={styles.tableRow}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.colGroup}>
                <span className={styles.groupLabel}>{group.label}</span>
              </div>
              <div className={styles.colSkills}>
                <div className={styles.tags}>
                  {group.items.map((item) => (
                    <SkillTag key={item.name} item={item} />
                  ))}
                </div>
              </div>
              <div className={styles.colBar}>
                <ProficiencyBar
                  value={proficiency[i]}
                  isInView={isInView}
                  delay={0.2 + i * 0.07}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}