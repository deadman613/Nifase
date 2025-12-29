import styles from "./whocanlearn.module.css";

export default function WhoCanLearn() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Who <span>Can Learn</span> at NIFASE?
        </h2>

        <p className={styles.subheading}>
          Our programs are designed for individuals from diverse backgrounds who
          want structured, practical, and career-focused financial education.
        </p>

        <div className={styles.grid}>
          {/* Working Professionals */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L22 9L17 14.74L18.18 21.5L12 17.77L5.82 21.5L7 14.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Working Professionals</h3>
            <p>
              Enhance market understanding, decision-making, and financial
              confidence alongside your professional career.
            </p>
          </div>

          {/* Students */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V8M4 8H20M4 8V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V8M4 8V12M20 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Students</h3>
            <p>
              Build strong foundations in trading, investment concepts, and
              market behavior during college or early education years.
            </p>
          </div>

          {/* Homemakers */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 8H5C3.89543 8 3 8.89543 3 10V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V10C21 8.89543 20.1046 8 19 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 8V5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Homemakers</h3>
            <p>
              Learn to understand markets, manage capital wisely, and participate
              confidently in financial decisions.
            </p>
          </div>

          {/* Business Owners */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21L12 12L21 21H3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Business Owners</h3>
            <p>
              Gain clarity on markets, risk, and capital allocation to make
              informed financial and strategic decisions.
            </p>
          </div>

          {/* Job Seekers */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21V19C21 17.9391 20.5786 16.9217 19.8284 16.1716C19.0783 15.4214 18.0609 15 17 15H7C5.93913 15 4.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C9 12.1046 8.10457 13 7 13C5.89543 13 5 12.1046 5 11C5 9.89543 5.89543 9 7 9C8.10457 9 9 9.89543 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 10V8C21 6.89543 20.1046 6 19 6H15C13.8954 6 13 6.89543 13 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Job Seekers</h3>
            <p>
              Prepare for roles in finance, trading, and analytics with
              industry-aligned knowledge and practical exposure.
            </p>
          </div>

          {/* Freelancers */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L14 7.5L12 13L10 9L8 12L8 17C8 18.1 8.9 19 10 19L20 19C21.1 19 22 18.1 22 17V8C22 6.9 21.1 6 20 6L18 6L18 4C18 2.9 17.1 2 16 2L8 2C6.9 2 6 2.9 6 4L6 6L4 6C2.9 6 2 6.9 2 8V17C2 19.2 3.8 21 6 21H20C22.2 21 24 19.2 24 17V8C24 6.8 23.2 6 22 6L20 6L20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Freelancers</h3>
            <p>
              Build financial discipline and market awareness while managing
              variable income and global work opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
