"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { projects } from "@/data/profile";
import Icon from "./Icon";
import styles from "./Projects.module.scss";

const GRADIENTS = [
  "linear-gradient(135deg, #1b2a4a 0%, #3776A1 100%)",
  "linear-gradient(135deg, #2a1b4a 0%, #7B4FA6 100%)",
  "linear-gradient(135deg, #1a3a2a 0%, #3A9B6F 100%)",
  "linear-gradient(135deg, #4a1b1b 0%, #9B3737 100%)",
];

function Flowchart({ pipeline }) {
  return (
    <div className={styles.flowchart}>
      {pipeline.map((step, i) => (
        <motion.div
          key={step.label}
          className={styles.flowStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.flowNode}>
            <span className={styles.flowIndex}>{String(i + 1).padStart(2, "0")}</span>
            <div className={styles.flowLabel}>{step.label}</div>
            <div className={styles.flowDetail}>{step.detail}</div>
          </div>
          {i < pipeline.length - 1 && (
            <motion.div
              className={styles.flowArrow}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.35 + i * 0.12 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeSlug, setActiveSlug] = useState(null);
  const activeProject = projects.items.find((p) => p.slug === activeSlug);
  const activeIndex = projects.items.findIndex((p) => p.slug === activeSlug);

  useEffect(() => {
    document.body.style.overflow = activeSlug ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeSlug]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setActiveSlug(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="projects" className={styles.projects} ref={ref}>
      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          04 - Projects
        </motion.p>

        <div className={styles.grid}>
          {projects.items.map((project, i) => (
            <motion.div
              key={project.slug}
              className={styles.card}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveSlug(project.slug)}
            >
              <div className={styles.cardImage} style={{ background: project.image ? `url(${project.image}) center/cover` : GRADIENTS[i % GRADIENTS.length] }}>
                <span className={styles.status}>{project.status}</span>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.github} onClick={(e) => e.stopPropagation()}>GitHub &#8599;</a>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTop}>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <span className={styles.expandHint}>&#8599;</span>
                </div>
                <p className={styles.cardDesc}>{project.description}</p>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <Icon key={tag.name} name={tag.name} slug={tag.slug} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSlug(null)}
          >
            <motion.div
              className={styles.panel}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setActiveSlug(null)}>&#10005;</button>

              <div className={styles.panelImage} style={{ background: activeProject.image ? `url(${activeProject.image}) center/cover` : GRADIENTS[activeIndex % GRADIENTS.length] }}>
                <div className={styles.panelImageOverlay}>
                  <span className={styles.panelStatus}>{activeProject.status}</span>
                  <h3 className={styles.panelTitle}>{activeProject.title}</h3>
                </div>
              </div>

              <div className={styles.panelBody}>
                <div className={styles.panelLeft}>
                  <p className={styles.panelSectionLabel}>Technical Pipeline</p>
                  {activeProject.pipeline && <Flowchart pipeline={activeProject.pipeline} />}
                </div>

                <div className={styles.panelRight}>
                  <p className={styles.panelSectionLabel}>Case Study</p>
                  <div className={styles.tags} style={{ marginBottom: "1.25rem" }}>
                    {activeProject.tags.map((tag) => (
                      <Icon key={tag.name} name={tag.name} slug={tag.slug} />
                    ))}
                  </div>
                  <div className={styles.caseStudy}>
                    <div className={styles.caseBlock}>
                      <h4 className={styles.caseLabel}>Problem</h4>
                      <p className={styles.caseText}>{activeProject.caseStudy.problem}</p>
                    </div>
                    <div className={styles.caseBlock}>
                      <h4 className={styles.caseLabel}>Approach</h4>
                      <p className={styles.caseText}>{activeProject.caseStudy.approach}</p>
                    </div>
                    <div className={styles.caseBlock}>
                      <h4 className={styles.caseLabel}>Result</h4>
                      <p className={styles.caseText}>{activeProject.caseStudy.result}</p>
                    </div>
                  </div>
                  {activeProject.github && (
                    <a href={activeProject.github} target="_blank" rel="noopener noreferrer" className={styles.panelGithub}>View on GitHub &#8599;</a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}