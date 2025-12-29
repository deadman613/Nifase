import styles from "./gallerysection.module.css";

export default function GallerySection() {
  const images = [
    { src: "6.webp", label: "Trading Floor" },
    { src: "7.webp", label: "Live Analysis" },
    { src: "IMG_4066.webp", label: "Corridor" },
    { src: "IMG_4067.webp", label: "Classroom" },
    { src: "IMG_4068.webp", label: "Study Zone" },
    { src: "IMG_4071.webp", label: "Mentor Session" },
    { src: "6.webp", label: "Group Discussion" },
    { src: "7.webp", label: "Tech Lab" },
    { src: "IMG_4066.webp", label: "Library" }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* LEFT — GALLERY (3x3 with Labels) */}
        <div className={styles.gallery}>
          {images.map(({ src, label }, idx) => (
            <div 
              className={`${styles.imageCard} ${styles[`row${Math.floor(idx / 3) + 1}`]} ${styles[`col${(idx % 3) + 1}`]}`} 
              key={src + idx}
            >
              <img src={`/center/${src}`} alt={label} loading="lazy" />
              <div className={styles.imageLabel}>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — ENHANCED CONTENT */}
        <div className={styles.content}>
          <h2 className={styles.heading}>
            Experience Learning in a <span>Professional Campus</span>
          </h2>

          <p className={styles.description}>
            Our NIFASE campus reflects a real corporate trading environment — focused, distraction-free, and performance-driven with state-of-the-art facilities.
          </p>
{/* 
          <p className={styles.description}>
            From collaborative trading floors and advanced classrooms to mentor-led discussion zones and tech labs, everything is structured for seamless industry transition.
          </p> */}

          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>👥</div>
              <div>
                <h4 className={styles.featureTitle}>Small Batches</h4>
                <p className={styles.featureText}>Max 15 students per batch for personalized attention</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🏢</div>
              <div>
                <h4 className={styles.featureTitle}>Corporate Setup</h4>
                <p className={styles.featureText}>Real trading desks & live NSE data feeds</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🧑‍🏫</div>
              <div>
                <h4 className={styles.featureTitle}>Expert Mentors</h4>
                <p className={styles.featureText}>10+ years industry experience instructors</p>
              </div>
            </div>
          </div>

          <button className={styles.ctaButton}>
            Book Campus Tour
          </button>
        </div>
      </div>
    </section>
  );
}
