"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "@/components/Home/homeSection3.module.css";

gsap.registerPlugin(ScrollTrigger);

const HeroSection3 = () => {
  const sectionRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  const fxSectionRef = useRef(null);
  const fxLeftRef = useRef(null);
  const fxRightRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const fxSection = fxSectionRef.current;
    const fxLeft = fxLeftRef.current;
    const fxRight = fxRightRef.current;

    const ctx = gsap.context(() => {
      // First marquee line
      gsap.from(text1, {
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
        x: "100%",
        opacity: 0,
      });

      // Second marquee line
      gsap.from(text2, {
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
        x: "80%",
        opacity: 0,
      });

      // NIFASE left heading
      gsap.from(fxLeft, {
        scrollTrigger: {
          trigger: fxSection,
          start: "top 80%",
          end: "center center",
          scrub: 1,
        },
        x: -120,
        opacity: 0,
      });

      // NIFASE right card
      gsap.from(fxRight, {
        scrollTrigger: {
          trigger: fxSection,
          start: "top 80%",
          end: "center center",
          scrub: 1,
        },
        x: 120,
        scale: 0.95,
        opacity: 0,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.content}>
        {/* First Scrolling Line */}
        <div ref={text1Ref} className={styles.scrollingContainer}>
          <div className={styles.scrollingText}>
            <span className={styles.textItem}>
              Trade <span className={styles.highlight}>Smarter</span> • Build{" "}
              <span className={styles.highlight}>Wealth</span> • Live{" "}
              <span className={styles.highlight}>Better</span> •
            </span>
            <span className={styles.textItem}>
              Trade <span className={styles.highlight}>Smarter</span> • Build{" "}
              <span className={styles.highlight}>Wealth</span> • Live{" "}
              <span className={styles.highlight}>Better</span> •
            </span>
            <span className={styles.textItem}>
              Trade <span className={styles.highlight}>Smarter</span> • Build{" "}
              <span className={styles.highlight}>Wealth</span> • Live{" "}
              <span className={styles.highlight}>Better</span> •
            </span>
          </div>
        </div>

        {/* Second Scrolling Line (Reverse) */}
        <div ref={text2Ref} className={styles.scrollingContainer}>
          <div className={`${styles.scrollingText} ${styles.reverse}`}>
            <span className={styles.textItem}>
              <span className={styles.highlight}>Master</span> NSE •{" "}
              <span className={styles.highlight}>Real</span> Skills •{" "}
              <span className={styles.highlight}>Proven</span> Results •
            </span>
            <span className={styles.textItem}>
              <span className={styles.highlight}>Master</span> NSE •{" "}
              <span className={styles.highlight}>Real</span> Skills •{" "}
              <span className={styles.highlight}>Proven</span> Results •
            </span>
            <span className={styles.textItem}>
              <span className={styles.highlight}>Master</span> NSE •{" "}
              <span className={styles.highlight}>Real</span> Skills •{" "}
              <span className={styles.highlight}>Proven</span> Results •
            </span>
          </div>
        </div>

        {/* Center Content over marquees */}
        <div className={styles.centerContent}>
          <h2 className={styles.mainTitle}>
            Transform Your
            <br />
            <span className={styles.gradientText}>Trading Journey</span>
          </h2>
          <p className={styles.subtitle}>
            Join thousands of successful NSE traders at NIFASE
          </p>
        </div>
      </div>

      {/* ✅ NIFASE NSE Institute Block */}
      <section ref={fxSectionRef} className={styles.fxologySection}>
        <div className={styles.fxGlowBg} />

        <div className={styles.fxInner}>
          <div ref={fxLeftRef} className={styles.fxLeft}>
            <h2 className={styles.fxMainTitle}>
              NIFASE
              <br />
              <span className={styles.fxEmphasis}>Expert Guidance</span>
            </h2>
          </div>

          <div ref={fxRightRef} className={styles.fxRight}>
            <button className={styles.fxPillBtn}>What is NIFASE?</button>

            <h3 className={styles.fxRightTitle}>
              Master NSE Trading
              <br />
              with Professional
              <br />
              <span className={styles.fxAccent}>Training Programs</span>
            </h3>

            <p className={styles.fxRightText}>
              NIFASE provides structured NSE trading education with hands-on practice, live market analysis, and expert mentorship for aspiring traders.
            </p>
            <p className={styles.fxRightTextMuted}>
              "Practice trading with demo accounts to build skills without financial risk."
            </p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default HeroSection3;
