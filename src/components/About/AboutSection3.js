"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./aboutSection3.module.css";

const AboutSection3 = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll(`.${styles.card}`));
    if (!cards.length) return;

    // real total width calc (including gap)
    const totalWidth =
      cards[cards.length - 1].offsetLeft +
      cards[cards.length - 1].offsetWidth;

    const tl = gsap.to(cards, {
      x: `-=${totalWidth}`,
      ease: "none",
      duration: 40,
      repeat: -1,
      modifiers: {
        x: (x) => {
          const v = parseFloat(x);
          const wrapped = gsap.utils.wrap(-totalWidth, 0, v);
          return `${wrapped}px`;
        },
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  const cards = [
    {
      title: "Mentored evaluations",
      text: "Work through funding challenges with review sessions so mistakes turn into rules, not repeated losses.",
    },
    {
      title: "Live market focus",
      text: "Strategies are tested in real volatility, spreads, and news spikes — not just historical charts.",
    },
    {
      title: "Scaling paths",
      text: "Consistent results unlock larger accounts and higher payout splits while keeping risk capped.",
    },
    {
      title: "Data‑driven feedback",
      text: "Session stats highlight what actually makes you money so you can double‑down on your edge.",
    },
  ];

  const loopCards = [...cards, ...cards];

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.gridOverlay} />

      <div className={styles.inner}>
        <div className={styles.textCol}>
          <p className={styles.kicker}>Infinite edge building</p>
          <h2 className={styles.heading}>
            A carousel of
            <span className={styles.headingAccent}> real advantages.</span>
          </h2>
          <p className={styles.body}>
            Always‑moving highlights of what NIFASE adds around your trading —
            from first lesson to funded growth.
          </p>
        </div>

        <div className={styles.viewport}>
          <div ref={trackRef} className={styles.track}>
            {loopCards.map((card, i) => (
              <article key={`${card.title}-${i}`} className={styles.card}>
                <div className={styles.cardGlow} />
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection3;
