"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./aboutSection2.module.css";

gsap.registerPlugin(ScrollTrigger);

const AboutSection2 = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      // Section title – fade up once
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Cards – alternate slide direction, no scrub
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          x: i % 2 === 0 ? -80 : 80,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const items = [
    {
      tag: "Step 01",
      title: "Learn rules that protect capital",
      text: "Structured modules show you how professional risk limits work, so every trade has a defined plan — not a guess.",
    },
    {
      tag: "Step 02",
      title: "Train on real market conditions",
      text: "Simulated evaluations mirror live volatility, spreads, and drawdown, so your edge survives outside backtests.",
    },
    {
      tag: "Step 03",
      title: "Scale into funded payouts",
      text: "Hit the targets, unlock bigger accounts, and withdraw consistently while NIFASE handles the capital side.",
    },
  ];

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.gridOverlay} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.kicker}>How it works</p>
          <h2 ref={titleRef} className={styles.title}>
            From first session<span className={styles.titleAccent}> to first payout.</span>
          </h2>
        </div>

        <div className={styles.cards}>
          {items.map((item, i) => (
            <article
              key={item.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className={styles.card}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardTopRow}>
                <span className={styles.cardTag}>{item.tag}</span>
                <span className={styles.cardLine} />
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection2;
