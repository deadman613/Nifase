"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./homeSection5.module.css";

gsap.registerPlugin(ScrollTrigger);

const HomeSection5 = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const stepsRef = useRef([]);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const programCardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const mainCard = cardRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    const ctx = gsap.context(() => {
      // Heading: subtle fade + slide from top
      gsap.from([title, subtitle], {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        },
        y: -40,
        opacity: 0,
        stagger: 0.15,
      });

      // Main glass frame: depth + blur to sharp
      gsap.from(mainCard, {
        scrollTrigger: {
          trigger: mainCard,
          start: "top 80%",
          end: "center center",
          scrub: 1.2,
        },
        y: 100,
        opacity: 0,
        scale: 0.9,
        filter: "blur(12px)",
        transformOrigin: "50% 60%",
      });

      // Individual stacked program cards: wave‑style stagger
      gsap.from(programCardsRef.current, {
        scrollTrigger: {
          trigger: mainCard,
          start: "top 80%",
          end: "center center",
          scrub: 1,
        },
        y: 60,
        rotateY: 18,
        opacity: 0,
        stagger: 0.12,
        transformOrigin: "50% 50%",
      });

      // Steps: alternate slide directions
      stepsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top 55%",
            scrub: 1,
          },
          y: 60,
          x: i === 0 ? -40 : i === 2 ? 40 : 0,
          opacity: 0,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      label: "STEP 1",
      title: "Choose A Program",
      text: "Pick a program that fits your trading style, complete a short signup, and get instant access to your dashboard.",
    },
    {
      label: "STEP 2",
      title: "Pass The Evaluation",
      text: "Trade according to the rules, hit the target, and unlock virtual capital without risking your own funds.",
    },
    {
      label: "STEP 3",
      title: "Scale & Withdraw",
      text: "Receive payouts, grow your account limits automatically, and focus on trading while we handle the rest.",
    },
  ];

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Top heading */}
      <div className={styles.header}>
        <h2 ref={titleRef} className={styles.title}>
          How does it <span className={styles.highlight}>works?</span>
        </h2>
        <p ref={subtitleRef} className={styles.subtitle}>
          Your pathway to professional trading
        </p>
      </div>

      {/* Main visual card */}
      <div className={styles.visualWrapper}>
        <div className={styles.gridOverlay} />
        <div ref={cardRef} className={styles.glassFrame}>
          <div className={styles.waveLayer} />
          <div className={styles.waveLayerBack} />

          {/* Stacked program cards */}
          <div className={styles.cardsRow}>
            <div
              ref={(el) => (programCardsRef.current[0] = el)}
              className={`${styles.programCard} ${styles.cardBack}`}
            >
              <div className={styles.cardLabel}>Silver</div>
              <div className={styles.cardLine} />
            </div>

            <div
              ref={(el) => (programCardsRef.current[1] = el)}
              className={`${styles.programCard} ${styles.cardMid}`}
            >
              <div className={styles.cardLabel}>Bronze</div>
              <div className={styles.cardLine} />
            </div>

            <div
              ref={(el) => (programCardsRef.current[2] = el)}
              className={`${styles.programCard} ${styles.cardFront}`}
            >
              <div className={styles.cardTopRow}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.badge}>TOP</span>
              </div>
              <div className={styles.cardMain}>
                <span className={styles.cardTier}>Gold</span>
                <span className={styles.cardValue}>$20,000</span>
                <span className={styles.cardCaption}>Virtual capital size</span>
              </div>
              <button className={styles.cardButton}>Start program</button>
            </div>
          </div>
        </div>
      </div>

      {/* Steps row */}
      <div className={styles.stepsRow}>
        {steps.map((step, i) => (
          <div
            key={step.label}
            ref={(el) => (stepsRef.current[i] = el)}
            className={styles.stepCol}
          >
            <span className={styles.stepLabel}>[ {step.label} ]</span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeSection5;
