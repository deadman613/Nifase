"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./homeSection7.module.css";

gsap.registerPlugin(ScrollTrigger);

const faqItems = [
  {
    q: "Is it worth doing a share market course?",
    a: "Yes, if you want to learn trading and investing seriously. A structured course helps you avoid confusion, save time, and reduce costly beginner mistakes. NIFASE focuses on skills and discipline, not shortcuts.",
  },
  {
    q: "Which is the best trading course for beginners?",
    a: "The best trading course for beginners is one that offers step-by-step learning, practical market training, strong risk management, real examples and structured lessons, and mentor support. NIFASE provides a clear beginner-to-trader learning path.",
  },
  {
    q: "How much does a share market course cost?",
    a: "Course fees depend on the program you choose (Beginner / Advanced / F&O). For updated pricing, please check the Programs page or contact the NIFASE team.",
  },
  {
    q: "Is the stock market a good career option?",
    a: "Yes, the stock market can be a great career option, but it requires real skills, discipline, and risk management. NIFASE helps you build market-ready skills with a professional learning approach.",
  },
  {
    q: "How can I build a career through stock market learning?",
    a: "After learning at NIFASE, you can explore paths like trading (Intraday / Swing / F&O), long-term investing and portfolio building, market research and analysis, finance-related roles (skill advantage), and education or content-based finance career.",
  },
  {
    q: "Can I earn good money from the stock market?",
    a: "Earning is possible, but it depends on your knowledge, risk control, capital, consistency, and market conditions. NIFASE focuses on skill-building first, not guaranteed income.",
  },
  {
    q: "How much can I earn from the stock market in a month?",
    a: "Monthly income is not fixed in trading. Some months may be profitable, some may be break-even, and some may have losses. NIFASE trains you to focus on process, risk management, and long-term consistency.",
  },
  {
    q: "What are the eligibility criteria for stock market certification courses?",
    a: "In most cases, eligibility is simple: interest in learning the stock market, basic understanding (beginners are welcome), and commitment to learning. NIFASE programs are designed for beginners as well as advanced learners.",
  },
  {
    q: "What are the benefits of doing a share market course at NIFASE?",
    a: "Top benefits include clear learning roadmap (no confusion), mentor-led guidance, practical market-focused training, strong risk management system, trading psychology and discipline training, and beginner-friendly learning with advanced growth.",
  },
  // {
  //   q: "What is a stock broker course?",
  //   a: "A stock broker course usually focuses on brokerage operations, compliance, and trading-related services. NIFASE primarily focuses on building trading and investing skills, market understanding, and professional execution.",
  // },
];

const faqItemsLeft = [
  {
    q: "What is a share market course at NIFASE?",
    a: "A share market course at NIFASE is a structured learning program designed to teach stock market concepts from basic to advanced levels. It covers trading, investing, chart reading, risk management, and market psychology in a practical way."
  },
  {
    q: "Who can join NIFASE share market courses?",
    a: "Anyone can join NIFASE courses, including beginners (starting from zero), students (for career advantage), working professionals (skill upgrade / side learning), and serious traders (for structure and discipline)."
  },
  {
    q: "Do I need any degree to learn the stock market?",
    a: "No. You don’t need any specific degree to learn the stock market. You only need basic understanding, discipline, and a learning mindset — NIFASE will guide you step-by-step."
  },
  {
    q: "What are the key takeaways from a share market course?",
    a: "After completing a NIFASE share market course, you will learn: stock market fundamentals clearly, how to read charts and trends, entry and exit planning, risk management and capital protection, trading discipline and psychology, and practical decision-making in real market scenarios."
  },
  {
    q: "What modules are included in the NIFASE share market course?",
    a: "Modules may vary by program, but typically include: Stock Market Basics & Terminology, Candlestick & Chart Reading, Technical Analysis (Indicators + Price Action), Support & Resistance + Trend Structure, Trading Strategies (Intraday / Swing), Futures & Options (Basics to Advanced), Risk Management & Position Sizing, Trading Psychology & Discipline, and Live Market Practice + Case Studies."
  },
  {
    q: "What account sizes are available?",
    a: "Account sizes typically range from $5,000 to $200,000, allowing you to choose a starting capital that matches your trading experience and risk tolerance."
  },
  {
    q: "Can I trade multiple accounts?",
    a: "Yes, you can manage multiple funded accounts simultaneously once you meet the evaluation criteria for each account tier."
  },
  {
    q: "What trading platforms do you support?",
    a: "We support major trading platforms including MetaTrader 4, MetaTrader 5, and cTrader, giving you flexibility in your trading setup."
  },
  {
    q: "Are there any trading restrictions?",
    a: "Standard risk management rules apply, including maximum daily loss limits and overall drawdown thresholds to protect both traders and capital."
  }
];

const HomeSection7 = () => {
  const [openIndexLeft, setOpenIndexLeft] = useState(0);
  const [openIndexRight, setOpenIndexRight] = useState(0);
  const sectionRef = useRef(null);
  const itemsRefLeft = useRef([]);
  const itemsRefRight = useRef([]);
  const bodiesRefLeft = useRef([]);
  const bodiesRefRight = useRef([]);

  // Scroll entrance for items
  useEffect(() => {
    const section = sectionRef.current;
    const itemsLeft = itemsRefLeft.current;
    const itemsRight = itemsRefRight.current;

    if (!section) return;

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

          // Animate left column items
          gsap.from(itemsLeft, {
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
            y: isMobile ? 22 : 40,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
          });

          // Animate right column items
          gsap.from(itemsRight, {
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
            y: isMobile ? 22 : 40,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.2,
          });
        }
      );
    }, section);

    return () => {
      mm?.revert();
      ctx.revert();
    };
  }, []);

  // Height animation for left accordion
  useEffect(() => {
    bodiesRefLeft.current.forEach((el, i) => {
      if (!el) return;
      const content = el.querySelector(`.${styles.bodyInner}`);
      const target = i === openIndexLeft ? content.offsetHeight : 0;

      gsap.to(el, {
        height: target,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [openIndexLeft]);

  // Height animation for right accordion
  useEffect(() => {
    bodiesRefRight.current.forEach((el, i) => {
      if (!el) return;
      const content = el.querySelector(`.${styles.bodyInner}`);
      const target = i === openIndexRight ? content.offsetHeight : 0;

      gsap.to(el, {
        height: target,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [openIndexRight]);

  const toggleItem = (index, side) => {
    if (side === "left") {
      setOpenIndexLeft((prev) => (prev === index ? -1 : index));
    } else {
      setOpenIndexRight((prev) => (prev === index ? -1 : index));
    }
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.gridOverlay} />

      <div className={styles.inner}>
        <div className={styles.headerCenter}>
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

        <div className={styles.faqColumns}>
          {/* Left Column */}
          <div className={styles.faqColumn}>
            {faqItemsLeft.map((item, i) => {
              const isOpen = i === openIndexLeft;
              return (
                <div
                  key={item.q}
                  ref={(el) => (itemsRefLeft.current[i] = el)}
                  className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.header}
                    onClick={() => toggleItem(i, "left")}
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
                    ref={(el) => (bodiesRefLeft.current[i] = el)}
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

          {/* Right Column */}
          <div className={styles.faqColumn}>
            {faqItems.map((item, i) => {
              const isOpen = i === openIndexRight;
              return (
                <div
                  key={item.q}
                  ref={(el) => (itemsRefRight.current[i] = el)}
                  className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.header}
                    onClick={() => toggleItem(i, "right")}
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
                    ref={(el) => (bodiesRefRight.current[i] = el)}
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
      </div>
    </section>
  );
};

export default HomeSection7;