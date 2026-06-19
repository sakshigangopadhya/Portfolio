"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { leadership } from "@/data/profile";
import styles from "./Leadership.module.scss";

export default function Leadership() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="leadership" className={styles.leadership} ref={ref}>
      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          05 — {leadership.heading}
        </motion.p>

        <div className={styles.list}>
          {leadership.items.map((item, i) => (
            <motion.div
              key={item.title}
              className={styles.item}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
