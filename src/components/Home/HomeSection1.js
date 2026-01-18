"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoursePopupForm from "@/components/CoursePopupForm";

import styles from "./homeSection1.module.css";

const courses = [
  "Technical Analysis",
  "Fundamental Analysis",
  "Optional Trading",
  "Equity Research",
  "Portfolio Management",
  "Derivatives",
  "Risk Management",
  "Financial Modelling",
  "NSE Trading",
];

const TypewriterText = () => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = [
    "Optional Trading",
    "Crypto Trading",
    "Trading Strategies",
    "Investing",
    "Technical Analysis"
  ];

  useEffect(() => {
    const currentFullText = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentFullText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting]);

  return (
    <span className={styles.typewriterText}>
      {currentText}
      <span className={styles.cursor}>|</span>
    </span>
  );
};

const HomeSection1 = ({ user }) => {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <section className={styles.section}>
      <div className={`${styles.gridOverlay} grid-overlay`} aria-hidden="true" />
      <div className={styles.gradientGlow} aria-hidden="true" />

      <div className={styles.heroWrapper}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.badge}
          >
            <span className={`${styles.liveDot} live-dot`} />
            <span className={styles.badgeText}>India's Premier Finance Institute</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.heading}
          >
            Master The{" "}
            <span className="gradient-text">Stock Market</span>
            <br />
            & <span className="gradient-text">Finance</span> 
            <span className="ai"> with </span>
            <span className="gradient-text">AI</span> 
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.subheadline}
          >
            Trading, Investment & Financial Markets
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            // className={styles.learnWrapper}
          >
            {/* <span className={styles.learnText}>Learn</span> */}
            <TypewriterText />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={styles.description}
          >
            Launch your career with practical stock market & finance training aligned with real NSE market conditions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={styles.ctaWrapper}
          >
            <Button
              type="button"
              size="lg"
              className={`glow-primary ${styles.ctaButtonPrimary}`}
              onClick={() => setLeadOpen(true)}
            >
              Get Started
              <ArrowRight className={styles.ctaIcon} />
            </Button>

            <Button asChild size="lg" variant="outline" className={styles.ctaSecondary}>
              <Link href="/courses">Explore Programs</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className={styles.stats}
          >
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Users className={styles.statIconSvg} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statNumber}>15,000+</p>
                <p className={styles.statLabel}>Students Trained</p>
              </div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Award className={styles.statIconSvg} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statNumber}>98%</p>
                <p className={styles.statLabel}>Success Rate</p>
              </div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <TrendingUp className={styles.statIconSvg} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statNumber}>15+ Years</p>
                <p className={styles.statLabel}>Experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CoursePopupForm open={leadOpen} onClose={() => setLeadOpen(false)} />

      <div className={styles.tickerWrapper}>
        <div className={styles.ticker}>
          <div className={`${styles.tickerTrack} animate-ticker`}>
            {[...courses, ...courses].map((course, idx) => (
              <span key={`${course}-${idx}`} className={styles.tickerButton}>
                {course}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection1;