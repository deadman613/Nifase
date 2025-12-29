
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import styles from "./testimonialsection.module.css";

const testimonials = [
  {
    quote:
      "I used to watch YouTube videos and still felt confused about trading. At NIFASE, things finally started making sense because concepts were explained step by step with real charts.",
    author: "Rahul Sharma",
    role: "Software Engineer → Trader",
  },
  {
    quote:
      "I was expecting quick profits, but instead I learned why patience and process matter more. That honesty is what I respect about NIFASE.",
    author: "Priya Patel",
    role: "MBA Student",
  },
  {
    quote:
      "I used to feel overwhelmed by charts and indicators. The way things are explained here made technical analysis feel simple and logical.",
    author: "Amit Verma",
    role: "Business Owner",
  },
  {
    quote:
      "For the first time, I felt that someone understands what beginners actually struggle with. The learning pace felt comfortable and practical.",
    author: "Sneha Reddy",
    role: "First-Time Investor",
  },
];

export default function TestimonialSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* optional soft glow background */}
      <div className={styles.glow} />

      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <h2 className={styles.heading}>
            What <span className={styles.gradientText}>Learners Say</span>
          </h2>
          <p className={styles.subheading}>
            Honest feedback from students learning trading the right way —
            structured, practical, and grounded in real markets.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={styles.card}
            >
              <Quote className={styles.quoteIcon} />
              <p className={styles.quote}>"{testimonial.quote}"</p>

              <div className={styles.cardFooter}>
                <div className={styles.avatar}>
                  <span className={styles.avatarInitial}>
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className={styles.authorName}>{testimonial.author}</p>
                  <p className={styles.authorRole}>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
