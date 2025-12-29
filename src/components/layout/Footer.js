"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./footer.module.css";

gsap.registerPlugin(ScrollTrigger);

// AnimationContainer (same design)
const AnimationContainer = ({ children, className, reverse, delay }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reverse ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{
        duration: 0.2,
        delay: delay,
        ease: "easeInOut",
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

// TextHoverEffect (unchanged)
const TextHoverEffect = ({ text, duration }) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({
    cx: "50%",
    cy: "50%",
  });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor={"var(--indigo-500)"} />
              <stop offset="25%" stopColor={"var(--violet-500)"} />
              <stop offset="50%" stopColor={"var(--purple-500)"} />
              <stop offset="75%" stopColor={"var(--fuchsia-500)"} />
              <stop offset="100%" stopColor={"var(--rose-500)"} />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="font-[helvetica] font-bold stroke-neutral-800 fill-transparent text-7xl"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="font-[helvetica] font-bold fill-transparent text-7xl stroke-neutral-800"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        y2="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="font-[helvetica] font-bold fill-transparent text-7xl"
      >
        {text}
      </text>
    </svg>
  );
};

// Main Footer Component with GSAP ScrollTrigger
const Footer = () => {
  const footerRef = useRef(null);
  const gridRef = useRef(null);
  const linkColsRef = useRef([]);

  useEffect(() => {
    const footer = footerRef.current;
    const grid = gridRef.current;

    if (!footer || !grid) return;

    const ctx = gsap.context(() => {
      // Footer fade+lift on scroll forward
      gsap.from(footer, {
        scrollTrigger: {
          trigger: footer,
          start: "top bottom",
          end: "top center",
          scrub: 1, // forward linked to scroll
        },
        opacity: 0,
        y: 60,
        ease: "power2.out",
      });

      // Columns stagger (Product, Integrations, Resources, Company)
      if (linkColsRef.current.length) {
        gsap.from(linkColsRef.current, {
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            end: "top 60%",
            scrub: 1,
          },
          y: 40,
          opacity: 0,
          ease: "power2.out",
          stagger: 0.15,
        });
      }
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.topDivider}></div>

      <div ref={gridRef} className={styles.grid}>
        <AnimationContainer delay={0.1}>
          <div className={styles.logoSection}>
            <div className={styles.logoWrapper}>
              <Image
                src="/NIFASE_Logo-removebg-preview.png"
                alt="NIFASE Logo"
                width={120}
                height={120}
                className={styles.logo}
                priority={true}
              />
            </div>
            <p className={styles.description}>Manage your links with ease.</p>
            <span className={styles.madeBy}>Made by Jatin</span>
          </div>
        </AnimationContainer>

        <div className={styles.linksGrid}>
          <div className={styles.linksRow}>
            <AnimationContainer delay={0.2}>
              <div
                className={styles.linkColumn}
                ref={(el) => (linkColsRef.current[0] = el)}
              >
                <h3 className={styles.columnTitle}>Product</h3>
                <ul className={styles.linkList}>
                  <li className={styles.linkItem}>
                    <Link href="" className={styles.link}>
                      Features
                    </Link>
                  </li>
                  <li className={styles.linkItem}>
                    <Link href="" className={styles.link}>
                      Pricing
                    </Link>
                  </li>
                  <li className={styles.linkItem}>
                    <Link href="" className={styles.link}>
                      Testimonials
                    </Link>
                  </li>
                  <li className={styles.linkItem}>
                    <Link href="" className={styles.link}>
                      Integration
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>

            <AnimationContainer delay={0.3}>
              <div
                className={styles.linkColumn}
                ref={(el) => (linkColsRef.current[1] = el)}
              >
                <h3 className={styles.columnTitle}>Integrations</h3>
                <ul className={styles.linkList}>
                  <li className={styles.linkItem}>
                    <Link href="" className={styles.link}>
                      Facebook
                    </Link>
                  </li>
                  <li className={styles.linkItem}>
                    <Link href="" className={styles.link}>
                      Instagram
                    </Link>
                  </li>
                  <li className={styles.linkItem}>
                    <Link href="" className={styles.link}>
                      Twitter
                    </Link>
                  </li>
                  <li className={styles.linkItem}>
                    <Link href="" className={styles.link}>
                      LinkedIn
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
          </div>

          <div className={styles.linksRow}>
            <AnimationContainer delay={0.4}>
              <div
                className={styles.linkColumn}
                ref={(el) => (linkColsRef.current[2] = el)}
              >
                <h3 className={styles.columnTitle}>Resources</h3>
                <ul className={styles.linkList}>
                  <li className={styles.linkItem}>
                    <Link href="/resources/blog" className={styles.link}>
                      Blog
                    </Link>
                  </li>
                  <li className={styles.linkItem}>
                    <Link href="/resources/help" className={styles.link}>
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>

            <AnimationContainer delay={0.5}>
              <div
                className={styles.linkColumn}
                ref={(el) => (linkColsRef.current[3] = el)}
              >
                <h3 className={styles.columnTitle}>Company</h3>
                <ul className={styles.linkList}>
                  <li className={styles.linkItem}>
                    <Link href="" className={styles.link}>
                      About Us
                    </Link>
                  </li>
                  <li className={styles.linkItem}>
                    <Link href="/privacy" className={styles.link}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li className={styles.linkItem}>
                    <Link href="/terms" className={styles.link}>
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <AnimationContainer delay={0.6}>
          <p className={styles.copyrightText}>
            &copy; {new Date().getFullYear()} NIfase INC. All rights
            reserved.
          </p>
        </AnimationContainer>
      </div>
    </footer>
  );
};

export default Footer;
