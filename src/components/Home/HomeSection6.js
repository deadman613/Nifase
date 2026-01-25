"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./homeSection6.module.css";

gsap.registerPlugin(ScrollTrigger);

const HomeSection6 = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const cardRef = useRef(null);
  const captionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const card = cardRef.current;
    const caption = captionRef.current;

    if (!section || !line || !card || !caption) return;

    let mm;
    const ctx = gsap.context(() => {
      mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 768px)",
          isDesktop: "(min-width: 769px)",
        },
        (context) => {
          const { isMobile } = context.conditions;
          const lineY = isMobile ? 22 : 40;
          const cardY = isMobile ? 70 : 120;
          const captionY = isMobile ? 18 : 40;

          // Heading line (play once)
          gsap.fromTo(
            line,
            { opacity: 0, y: lineY, letterSpacing: "-0.08em" },
            {
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none",
                once: true,
              },
              opacity: 1,
              y: 0,
              letterSpacing: "-0.03em",
              duration: 0.9,
              ease: "power2.out",
            }
          );

          // Card (play once)
          gsap.fromTo(
            card,
            { y: cardY, scale: 0.9, rotateZ: -6, opacity: 0, filter: "blur(8px)" },
            {
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
              },
              y: 0,
              scale: 1,
              rotateZ: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.05,
              ease: "power2.out",
            }
          );

          // Caption (play once)
          gsap.from(caption, {
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
              once: true,
            },
            y: captionY,
            opacity: 0,
            duration: 0.85,
            ease: "power2.out",
          });
        }
      );
    }, section);

    // Mouse‑move parallax for card
    const handleMove = (e) => {
      if (!cardRef.current) return;
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(cardRef.current, {
        rotationY: x * 10,
        rotationX: -y * 10,
        x: x * 20,
        y: y * 20,
        transformPerspective: 800,
        transformOrigin: "50% 50%",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const canParallax = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (canParallax) {
      section.addEventListener("pointermove", handleMove);
    }

    return () => {
      mm?.revert();
      ctx.revert();
      if (canParallax) {
        section.removeEventListener("pointermove", handleMove);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.glow} />

      <div className={styles.inner}>
        {/* One line heading */}
        <h2 ref={lineRef} className={styles.headingLine}>
           <span className={styles.headingTransparent}>Certificate</span>
        </h2>

        {/* Center certificate card */}
        <div ref={cardRef} className={styles.certificate}>
          <div className={styles.certInner}>
            <div className={styles.certHeader}>
              <span className={styles.logoDot} />
              <span className={styles.brand}>NIFASE</span>
              <span className={styles.tag}>Payout certificate</span>
            </div>

            <div className={styles.certBody}>
              <p className={styles.certTitle}>
                National Institute of Finance and Stock Education
              </p>
              <p className={styles.certLine}>
                This confirms a successful funded‑account withdrawal processed
                through our trading program.
              </p>
              <div className={styles.certAmountRow}>
                <span className={styles.label}>Amount</span>
                <span className={styles.amount}>₹ 5,400.00</span>
              </div>
              <div className={styles.certMetaRow}>
                <div>
                  <span className={styles.metaLabel}>Date</span>
                  <span className={styles.metaValue}>2025‑06‑02</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>Certificate ID</span>
                  <span className={styles.metaValue}>102449</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p ref={captionRef} className={styles.caption}>
          NIFASE payout certificates give traders a clear, shareable record of
          every withdrawal they’ve earned.
        </p>
      </div>
    </section>
  );
};

export default HomeSection6;
