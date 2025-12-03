"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './homeSection8.module.css';

const HomeSection8 = () => {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch live crypto data from CoinGecko API
    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&sparkline=false&price_change_percentage=24h'
                );
                const data = await response.json();
                setCryptoData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
                setLoading(false);
            }
        };

        fetchCryptoData();
        
        // Refresh data every 30 seconds
        const interval = setInterval(fetchCryptoData, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // GSAP animations
    useEffect(() => {
        if (!loading && cryptoData.length > 0) {
            const section = sectionRef.current;
            const cards = cardsRef.current.filter(card => card !== null);

            const ctx = gsap.context(() => {
                gsap.set(cards, { y: 50, opacity: 0 });

                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                cards.forEach((card, index) => {
                                    gsap.to(card, {
                                        y: 0,
                                        opacity: 1,
                                        duration: 0.6,
                                        delay: index * 0.1,
                                        ease: 'power3.out'
                                    });
                                });
                                observer.unobserve(section);
                            }
                        });
                    },
                    { threshold: 0.2 }
                );

                if (section) {
                    observer.observe(section);
                }

                return () => {
                    if (section && observer) {
                        observer.disconnect();
                    }
                };
            }, section);

            return () => ctx.revert();
        }
    }, [loading, cryptoData]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const formatMarketCap = (marketCap) => {
        if (marketCap >= 1e9) {
            return `$${(marketCap / 1e9).toFixed(2)}B`;
        }
        return `$${(marketCap / 1e6).toFixed(2)}M`;
    };

    return (
        <div ref={sectionRef} className={styles.section}>
            {/* Background Effects */}
            <div className={styles.bgGradient}></div>
            <div className={styles.grid}></div>

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <span className={styles.liveDot}></span>
                        Live Market Data
                    </div>
                    <h2 className={styles.title}>
                        Real-Time <span className={styles.highlight}>Trading</span> Insights
                    </h2>
                    <p className={styles.subtitle}>
                        Track live cryptocurrency prices and market movements in real-time
                    </p>
                </div>

                {/* Trading Cards Grid */}
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p className={styles.loadingText}>Loading market data...</p>
                    </div>
                ) : (
                    <div className={styles.cardsGrid}>
                        {cryptoData.map((coin, index) => (
                            <div
                                key={coin.id}
                                ref={el => cardsRef.current[index] = el}
                                className={styles.card}
                            >
                                {/* Card Header */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.coinInfo}>
                                        <img 
                                            src={coin.image} 
                                            alt={coin.name}
                                            className={styles.coinIcon}
                                        />
                                        <div>
                                            <h3 className={styles.coinName}>{coin.name}</h3>
                                            <span className={styles.coinSymbol}>
                                                {coin.symbol.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.rank}>#{coin.market_cap_rank}</div>
                                </div>

                                {/* Price */}
                                <div className={styles.priceSection}>
                                    <div className={styles.currentPrice}>
                                        {formatPrice(coin.current_price)}
                                    </div>
                                    <div className={
                                        coin.price_change_percentage_24h >= 0 
                                            ? styles.priceChangePositive 
                                            : styles.priceChangeNegative
                                    }>
                                        {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className={styles.stats}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Market Cap</span>
                                        <span className={styles.statValue}>
                                            {formatMarketCap(coin.market_cap)}
                                        </span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Volume 24h</span>
                                        <span className={styles.statValue}>
                                            {formatMarketCap(coin.total_volume)}
                                        </span>
                                    </div>
                                </div>

                                {/* Mini Chart Placeholder */}
                                <div className={styles.miniChart}>
                                    <div 
                                        className={
                                            coin.price_change_percentage_24h >= 0 
                                                ? styles.chartLinePositive 
                                                : styles.chartLineNegative
                                        }
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeSection8;