import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from 'lucide-react';
import styles from './homeSection1.module.css';

const HomeSection1 = ({ user }) => {
    return (
        <div className={styles.container}>
            {/* Hero Content */}
            <div className={styles.heroWrapper}>
                <div className={styles.heroContent}>
                    {/* Badge */}
                    <button className={styles.badge}>
                        <span className={styles.spark} />
                        <span className={styles.backdrop} />
                        <span className={styles.blur} />
                        <span className={styles.badgeText}>
                            ✨ Manage links smarter
                            <ArrowRightIcon className={styles.badgeIcon} />
                        </span>
                    </button>

                    {/* Heading */}
                    <h1 className={styles.heading}>
                        Smart Links with{' '}
                        <span className={styles.gradient}>
                            Precision
                        </span>
                    </h1>

                    {/* Description */}
                    <p className={styles.description}>
                        Effortlessly streamline your link management with Linkify.
                        <br className={styles.lineBreak} />
                        <span className={styles.subDescription}>
                            Shorten, track, and organize all your links in one place.
                        </span>
                    </p>

                    {/* CTA Button */}
                    <div className={styles.ctaWrapper}>
                        <Link 
                            href={user ? "/dashboard" : "/auth/sign-in"} 
                            className={styles.ctaButton}
                        >
                            Start creating for free
                            <ArrowRightIcon className={styles.ctaIcon} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSection1;