"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./homeSection4.module.css";

gsap.registerPlugin(ScrollTrigger);

const HomeSection4 = () => {
  const sectionRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightCardRef = useRef(null);
  const textLinesRef = useRef([]);
useEffect(() => {
  const section = sectionRef.current;
  const leftContent = leftContentRef.current;
  const rightCard = rightCardRef.current;

  const ctx = gsap.context(() => {
    // Left content: smoother parallax slide
    gsap.fromTo(
      leftContent,
      { x: -120, opacity: 0 },
      {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "center center",
          scrub: 1.2,
        },
        x: 0,
        opacity: 1,
        ease: "power2.out",
      }
    );

    // Right card: depth + slight scale
    gsap.fromTo(
      rightCard,
      { x: 140, y: 40, scale: 0.88, opacity: 0 },
      {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "center center",
          scrub: 1.2,
        },
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        ease: "power2.out",
      }
    );

    // Text lines: cascade from right
    gsap.fromTo(
      textLinesRef.current,
      { x: 220, opacity: 0 },
      {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "center center",
          scrub: 1.2,
        },
        x: 0,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.08,
      }
    );
  }, section);

  return () => ctx.revert();
}, []);

  return (
    <div ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* Left Section */}
        <div ref={leftContentRef} className={styles.leftSection}>
          <h2 className={styles.heading}>
            Stop losing your own money, join us and start earning!
          </h2>

          <div className={styles.buttonGroup}>
            <button className={styles.joinButton}>
              Join Us
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m0 0l-6-6m6 6l-6 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className={styles.trialButton}>Free trial</button>
          </div>
        </div>

        {/* Right Section (no sphere, just design) */}
        <div className={styles.rightSection}>
          <div ref={rightCardRef} className={styles.glassCard}>
            <div className={styles.cardGlow} />
            <div className={styles.cardHeader}>
              <span className={styles.pill}>Live Payouts</span>
              <span className={styles.badgeDot} />
            </div>
            <p className={styles.cardTitle}>
              Traders paid out every week with{" "}
              <span className={styles.cardAccent}>zero risk capital.</span>
            </p>
            <p className={styles.cardMeta}>
              Built for active traders who want consistent growth without
              blowing their own accounts.
            </p>
          </div>

          {/* Text Stack */}
          <div className={styles.textStack}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                ref={(el) => (textLinesRef.current[index] = el)}
                className={styles.textLine}
                style={{
                  opacity: 1 - index * 0.12,
                  transform: `translateY(${index * 8}px)`,
                }}
              >
                start earning
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection4;
