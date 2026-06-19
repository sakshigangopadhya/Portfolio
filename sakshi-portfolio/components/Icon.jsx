"use client";

import styles from "./Icon.module.scss";

const SIMPLE_ICONS_VERSION = "v13";

// Renders a simple-icons SVG from a slug via jsDelivr CDN.
// Falls back to a plain text pill if no slug is available.
export default function Icon({ name, slug }) {
  if (!slug) {
    return <span className={styles.textPill}>{name}</span>;
  }

  const src = `https://cdn.jsdelivr.net/npm/simple-icons@${SIMPLE_ICONS_VERSION}/icons/${slug}.svg`;

  return (
    <span className={styles.iconPill}>
      <img
        src={src}
        alt=""
        className={styles.icon}
        loading="lazy"
        onError={(e) => {
          // If the CDN icon 404s, hide the broken image and just show text
          e.currentTarget.style.display = "none";
        }}
      />
      {name}
    </span>
  );
}
