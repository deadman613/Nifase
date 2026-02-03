"use client";

import styles from "./TeamSection.module.css";

const trainers = [
  {
    role: "Head Trainer • NSE & Derivatives",
    name: "Puneet Narang",
    image: "/instructor.webp",
    experience: "20+ years live market experience",
    highlight:
      "Specializes in Optional trading, intraday, index trading, and building rule‑based systems for retail traders.",
    rating: 4.9,
    ratingCount: "320+ reviews",
    badges: [
      { text: "Live Market Sessions", primary: true },
      { text: "1:1 Doubt Support", primary: false },
    ],
  },
  {
    role: "Senior Analyst • Technical Research",
    name: "Krishna sachdeva",
    image: "/trainer2.jfif",
    experience: "2.5 years of experience in indices cryptos and 1 year in commodities",
    highlight:
      "Expert in technical analysis, chart patterns, and momentum trading strategies with proven track record.",
    rating: 4.8,
    ratingCount: "280+ reviews",
    badges: [
      { text: "Chart Mastery", primary: true },
      { text: "Strategy Builder", primary: false },
    ],
  },
  {
    role: "Risk Manager • Portfolio Expert",
    name: "Vishal Pandey",
    image: "/trainer3.jfif",
    experience: "6+years experience in nse and bse indices and stocks 2+years of experience in commodities.",
    highlight:
      "Focuses on position sizing, portfolio diversification, and risk-reward optimization for consistent returns.",
    rating: 4.9,
    ratingCount: "295+ reviews",
    badges: [
      { text: "Risk Control", primary: true },
      { text: "Portfolio Building", primary: false },
    ],
  },
];

export default function TeamSection() {
  return (
    <section className={styles.section}>
      <div className={styles.gradientOrb} />
      <div className={styles.gradientOrbRight} />

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.chipRow}>
            <span className={styles.chipDot} />
            <span className={styles.chipText}>Meet Your Trainers</span>
          </div>

          <h2 className={styles.heading}>
            Learn Directly from
            <br />
            <span>Our Expert Market Mentors</span>
          </h2>

          <p className={styles.subtext}>
            At NIFASE, you don't learn from generic YouTube educators or
            recorded slides. Your trainers are full‑time market professionals who read price,
            orderflow, and sentiment every single day.
          </p>
        </div>

        {/* TRAINERS GRID */}
        <div className={styles.trainersGrid}>
          {trainers.map((trainer, index) => (
            <article key={index} className={styles.card}>
              <div className={styles.cardGlow} />

              <div className={styles.avatarRing}>
                <div className={styles.avatarGlow} />
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className={styles.avatar}
                />
              </div>

              <div className={styles.cardBody}>
                <p className={styles.role}>{trainer.role}</p>
                <p className={styles.name}>{trainer.name}</p>
                <p className={styles.experience}>{trainer.experience}</p>
                <p className={styles.highlight}>{trainer.highlight}</p>

                {/* rating row */}
                <div className={styles.ratingRow}>
                  <div
                    className={styles.stars}
                    aria-label={`Rated ${trainer.rating} out of 5`}
                  >
                    <span className={styles.star}>★</span>
                    <span className={styles.star}>★</span>
                    <span className={styles.star}>★</span>
                    <span className={styles.star}>★</span>
                    <span className={trainer.rating >= 4.9 ? styles.star : styles.starHalf}>★</span>
                  </div>
                  <div className={styles.ratingText}>
                    <span className={styles.ratingValue}>{trainer.rating}</span>
                    <span className={styles.ratingCount}>
                      {trainer.ratingCount}
                    </span>
                  </div>
                </div>

                <div className={styles.badgeRow}>
                  {trainer.badges.map((badge, badgeIndex) => (
                    <div key={badgeIndex} className={styles.badge}>
                      <span
                        className={
                          badge.primary
                            ? styles.badgeDot
                            : styles.badgeDotSecondary
                        }
                      />
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* FEATURES LIST */}
        <div className={styles.features}>
          <ul className={styles.points}>
            <li>
              Designs step‑by‑step frameworks so even beginners can understand
              complex market structures.
            </li>
            <li>
              Focuses on execution, risk management, and psychology — not just
              theory and patterns.
            </li>
            <li>
              Reviews student trades, gives actionable feedback, and helps you
              build your own trading plan.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}