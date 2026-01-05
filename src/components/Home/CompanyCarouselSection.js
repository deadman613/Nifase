import styles from "./companyCarouselSection.module.css";

const favicon = (domain, size = 128) =>
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;

const companies = [
  {
    name: "NSE India",
    logo: favicon("nseindia.com"),
  },
  {
    name: "BSE India",
    logo: favicon("bseindia.com"),
  },
  {
    name: "Zerodha",
    logo: favicon("zerodha.com"),
  },
  {
    name: "Upstox",
    logo: favicon("upstox.com"),
  },
  {
    name: "Groww",
    logo: favicon("groww.in"),
  },
  {
    name: "Angel One",
    logo: favicon("angelone.in"),
  },
  {
    name: "HDFC Bank",
    logo: favicon("hdfcbank.com"),
  },
  {
    name: "ICICI Bank",
    logo: favicon("icicibank.com"),
  },
  {
    name: "State Bank of India",
    logo: favicon("sbi.co.in"),
  },
];

export default function CompanyCarouselSection() {
  const trackItems = [...companies, ...companies];

  return (
    <section className={styles.section} aria-label="Trading company logos">
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Company <span>Logos</span>
        </h2>
        <p className={styles.subheading}>
          Indian finance & markets brands.
        </p>

        <div className={styles.carousel}>
          <div className={`${styles.track} animate-ticker`}>
            {trackItems.map((company, idx) => (
              <div key={`${company.name}-${idx}`} className={styles.logoCard}>
                <img
                  src={company.logo}
                  alt={company.name}
                  className={styles.logo}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer-when-downgrade"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.dataset.fallbackApplied === "true") return;
                    img.dataset.fallbackApplied = "true";
                    img.src = favicon(company.logo.replace(/^.*domain=([^&]+).*$/, "$1"), 64);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
