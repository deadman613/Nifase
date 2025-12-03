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

      // Fxology left heading
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

      // Fxology right card
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
              <span className={styles.highlight}>Zero</span> Risk •{" "}
              <span className={styles.highlight}>Maximum</span> Profit •{" "}
              <span className={styles.highlight}>Unlimited</span> Potential •
            </span>
            <span className={styles.textItem}>
              <span className={styles.highlight}>Zero</span> Risk •{" "}
              <span className={styles.highlight}>Maximum</span> Profit •{" "}
              <span className={styles.highlight}>Unlimited</span> Potential •
            </span>
            <span className={styles.textItem}>
              <span className={styles.highlight}>Zero</span> Risk •{" "}
              <span className={styles.highlight}>Maximum</span> Profit •{" "}
              <span className={styles.highlight}>Unlimited</span> Potential •
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
            Join thousands of successful traders worldwide
          </p>
        </div>
      </div>

      {/* Fxology-style block BELOW scrolling text */}
      <section ref={fxSectionRef} className={styles.fxologySection}>
        <div className={styles.fxGlowBg} />

        <div className={styles.fxInner}>
          <div ref={fxLeftRef} className={styles.fxLeft}>
            <h2 className={styles.fxMainTitle}>
              Our Capital
              <br />
              <span className={styles.fxEmphasis}>Your Success</span>
            </h2>
          </div>

          <div ref={fxRightRef} className={styles.fxRight}>
            <button className={styles.fxPillBtn}>What is Fxology?</button>

            <h3 className={styles.fxRightTitle}>
              Trade on Forex and other
              <br />
              markets with capital
              <br />
              up to <span className={styles.fxAccent}>640,000 USD!</span>
            </h3>

            <p className={styles.fxRightText}>
              We provide unique trading programs for Forex traders, based upon
              which we search for the best options to work together with.
            </p>
            <p className={styles.fxRightTextMuted}>
              We provide you with training accounts that you can use to trade
              and earn commission without the risk of losing your own funds.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default HeroSection3;
