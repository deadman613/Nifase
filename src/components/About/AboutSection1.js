"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./aboutSection1.module.css";

gsap.registerPlugin(ScrollTrigger);

const AboutSection1 = () => {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      // Left block animation
      gsap.from(leftRef.current, {
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        x: -80,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      // Right circular ring animation
      gsap.from(rightRef.current, {
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        y: 80,
        scale: 0.8,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      // Idle float
      gsap.to(rightRef.current, {
        y: "+=12",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.gridOverlay} />

      <div className={styles.inner}>
        {/* LEFT */}
        <div ref={leftRef} className={styles.left}>
          <div className={styles.tagRow}>
            <span className={styles.pill}>Why NIFASE</span>
            <span className={styles.tagDot} />
          </div>

          <h2 className={styles.heading}>
            <span className={styles.headingTop}>We turn traders</span>
            <span className={styles.headingBottom}>
              into <span className={styles.headingAccent}>funded pros.</span>
            </span>
          </h2>

          <div className={styles.glowBar} />

          <p className={styles.body}>
            NIFASE blends institutional‑grade risk management with practical
            education. Instead of chasing signals, traders master repeatable
            setups, strict rules, and payout‑ready discipline.
          </p>

          <p className={styles.subBody}>
            From your first evaluation to consistent withdrawals, every step is
            structured, tracked, and backed by real capital.
          </p>
        </div>

        {/* RIGHT – circular stats ring */}
        <div ref={rightRef} className={styles.right}>
          <div className={styles.ringWrap}>
            {/* inner center text */}
            <div className={styles.ringCenter}>
              <span className={styles.centerSince}>since</span>
              <span className={styles.centerYear}>2018</span>
              <span className={styles.centerLine}>Education</span>
              <span className={styles.centerLine}>&amp; Funding</span>
            </div>

            {/* outer badges (sketch style) */}
            <div className={`${styles.ringBadge} ${styles.badgeTop}`}>
              <span className={styles.badgeValue}>1,200+</span>
              <span className={styles.badgeLabel}>funded traders</span>
            </div>

            <div className={`${styles.ringBadge} ${styles.badgeRight}`}>
              <span className={styles.badgeValue}>3.4x</span>
              <span className={styles.badgeLabel}>passing‑rate boost</span>
            </div>

            <div className={`${styles.ringBadge} ${styles.badgeBottom}`}>
              <span className={styles.badgeValue}>$540k</span>
              <span className={styles.badgeLabel}>avg. monthly payouts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection1;
