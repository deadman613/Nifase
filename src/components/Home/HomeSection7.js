"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./homeSection7.module.css";

const faqItems = [
  {
    q: "What is NIFASE?",
    a: "NIFASE is a finance and trading education hub that combines funded evaluations with structured learning so traders can qualify for real payout accounts.",
  },
  {
    q: "Do I need prior trading experience?",
    a: "Basic market knowledge helps, but the programs start from risk and psychology foundations, then move into playbook building and evaluation rules.",
  },
  {
    q: "How do payouts work?",
    a: "Once funded criteria are met, you can request withdrawals on the dashboard. Approved payouts are processed to your chosen method and logged as certificates.",
  },
  {
    q: "Is there one‑time or monthly pricing?",
    a: "Most challenges are one‑time fees per account size, with optional re‑tries and scaling plans if you want to grow into larger capital tiers.",
  },
];

const HomeSection7 = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const bodiesRef = useRef([]);

  // Scroll entrance for items
  useEffect(() => {
    const section = sectionRef.current;
    const items = itemsRef.current;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Height animation for accordion
  useEffect(() => {
    bodiesRef.current.forEach((el, i) => {
      if (!el) return;
      const content = el.querySelector(`.${styles.bodyInner}`);
      const target = i === openIndex ? content.offsetHeight : 0;

      gsap.to(el, {
        height: target,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [openIndex]);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.gridOverlay} />

      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.kicker}>FAQ</p>
          <h2 className={styles.heading}>
            Answers before
            <span className={styles.headingAccent}> you even ask.</span>
          </h2>
          <p className={styles.sub}>
            A quick rundown of how NIFASE works so you can focus on trading,
            not decoding terms and conditions.
          </p>
        </div>

        <div className={styles.right}>
          {faqItems.map((item, i) => {
            const isOpen = i === openIndex;
            return (
              <div
                key={item.q}
                ref={(el) => (itemsRef.current[i] = el)}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.header}
                  onClick={() => toggleItem(i)}
                >
                  <span className={styles.q}>{item.q}</span>
                  <span
                    className={`${styles.icon} ${
                      isOpen ? styles.iconOpen : ""
                    }`}
                  >
                    <span />
                  </span>
                </button>

                <div
                  ref={(el) => (bodiesRef.current[i] = el)}
                  className={styles.body}
                >
                  <div className={styles.bodyInner}>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeSection7;
