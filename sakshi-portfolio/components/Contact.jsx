"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { contact, profile } from "@/data/profile";
import styles from "./Contact.module.scss";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const links = [
    { label: "Email", href: "mailto:" + profile.email, value: profile.email, external: false },
    { label: "LinkedIn", href: profile.linkedin, value: "sakshi-gangopadhya", external: true },
    { label: "GitHub", href: profile.github, value: "sakshigangopadhya", external: true },
    { label: "Resume", href: profile.resume, value: "Download PDF", external: true },
  ];

  return (
    <section id="connect" className={styles.contact} ref={ref}>
      <div className={styles.inner}>
        <motion.p className={styles.eyebrow} initial={{ opacity: 0, y: 12 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          05 - {contact.heading}
        </motion.p>

        <motion.h2 className={styles.message} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
          {contact.message}
        </motion.h2>

        <motion.div className={styles.links} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          {links.map((link, i) => (
            <motion.a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className={styles.linkCard} initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -3 }}>
              <span className={styles.linkLabel}>{link.label}</span>
              <span className={styles.linkValue}>{link.value}</span>
              <span className={styles.linkArrow}>&#8599;</span>
            </motion.a>
          ))}
        </motion.div>


      </div>
    </section>
  );
}