import styles from "./newsection.module.css";

export default function NewSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* LEFT SIDE */}
        <div className={styles.left}>
          <h2 className={styles.heading}>
            Unlock Career at the <span>Top 1%</span> of the Industry
          </h2>

          <p className={styles.subheading}>
            Corporate-Style Financial Learning
          </p>

          <ul className={styles.list}>
            <li>
              <div className={styles.cardTitle}>Live Market Exposure</div>
              <div className={styles.preview}>
                Train with real-time NSE/BSE data and professional trading
                tools.
              </div>
            </li>
            <li>
              <div className={styles.cardTitle}>
                Corporate Trading Environment
              </div>
              <div className={styles.preview}>
                Learn in a setup that mirrors real trading desks and financial
                firms.
              </div>
            </li>
            <li>
              <div className={styles.cardTitle}>Hands-On Trading Practice</div>
              <div className={styles.preview}>
                Practical training in Equity, F&O, Intraday, Swing & Positional
                Trading.
              </div>
            </li>
            <li>
              <div className={styles.cardTitle}>Real Market Case Studies</div>
              <div className={styles.preview}>
                Work on actual market scenarios from Indian & global markets.
              </div>
            </li>
            <li>
              <div className={styles.cardTitle}>
                Structured Tasks & Deadlines
              </div>
              <div className={styles.preview}>
                Trading assignments with timelines and performance benchmarks.
              </div>
            </li>
            <li>
              <div className={styles.cardTitle}>1:1 Expert Mentorship</div>
              <div className={styles.preview}>
                Personal guidance from experienced traders and finance
                professionals.
              </div>
            </li>
            <li>
              <div className={styles.cardTitle}>Risk & Capital Management</div>
              <div className={styles.preview}>
                Learn professional risk control, position sizing, and
                discipline.
              </div>
            </li>
            <li>
              <div className={styles.cardTitle}>Trader Psychology Training</div>
              <div className={styles.preview}>
                Build the mindset required to survive and grow in real markets.
              </div>
            </li>
            <li>
              <div className={styles.cardTitle}>Industry-Focused Learning</div>
              <div className={styles.preview}>
                Learn how institutional traders and analysts actually operate.
              </div>
            </li>
            <li>
              <div className={styles.cardTitle}>Corporate-Style Learning</div>
              <div className={styles.preview}>
                Learn how institutional traders and analysts actually operate.
              </div>
            </li>
          </ul>
        </div>

        {/* RIGHT SIDE - SVG LOGOS ON LEFT */}
        <div className={styles.right}>
          <h3 className={styles.rightTitle}>
            Trusted by <span>India's Top</span> Firms
          </h3>

          <div className={styles.companyGrid}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className={styles.companyCard}>
                <div className={styles.logoContainer} aria-hidden="true">
                  <img
                    src={`/firm/${i + 1}.png`}
                    alt=""
                    className={styles.svgLogo}
                  />
                </div>
                <span className={styles.companyName}></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
