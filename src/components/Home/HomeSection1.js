"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Award, Users } from 'lucide-react';
import styles from './homeSection1.module.css';

const courses = [
  "Technical Analysis",
  "Fundamental Analysis",
  "Options Trading",
  "Equity Research",
  "Portfolio Management",
  "Derivatives",
  "Risk Management",
  "Financial Modelling",
  "NSE Trading",
];

const HomeSection1 = ({ user }) => {
  return (
    <section className={styles.section}>
      {/* Grid overlay */}
      <div className={styles.gridOverlay} />
      
      {/* Gradient glow */}
      <div className={styles.gradientGlow} />
      
      {/* Hero content */}
      <div className={styles.heroWrapper}>
        <div className={styles.heroContent}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.badge}
          >
            <span className={styles.liveDot} />
            <span className={styles.badgeText}>India's Premier Finance Institute</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.heading}
          >
            Master The{" "}
            <span className={styles.gradientText}>Stock Market</span>
            <br />
            & <span className={styles.gradientText}>Finance</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.subheadline}
          >
            Trading, Investment & Financial Markets
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={styles.description}
          >
            Launch your career with practical stock market & finance training aligned with real NSE market conditions.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={styles.ctaWrapper}
          >
            <Link
              href={user ? "/dashboard" : "/auth/sign-in"}
              className={styles.ctaButtonPrimary}
            >
              Start Learning Now
              <ArrowRight className={styles.ctaIcon} />
            </Link>
            <Link
              href="/courses"
              className={styles.ctaButtonSecondary}
            >
              Explore Programs
            </Link>
          </motion.div>

          {/* Stats */}
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
                <p className={styles.statNumber}>8+ Years</p>
                <p className={styles.statLabel}>Experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className={styles.tickerWrapper}>
        <div className={styles.ticker}>
          <div className={styles.tickerTrack}>
            {[...courses, ...courses].map((course, idx) => (
              <span
                key={`${course}-${idx}`}
                className={styles.tickerButton}
              >
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