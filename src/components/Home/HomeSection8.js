"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './homeSection8.module.css';

const HomeSection8 = () => {
    const sectionRef = useRef(null);
    const [stocks, setStocks] = useState([]);
    const [niftyIndices, setNiftyIndices] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const INDEX_NAME_BY_SYMBOL = {
        "^NSEI": "NIFTY 50",
        "^NSEBANK": "NIFTY BANK",
        "^CNXIT": "NIFTY IT",
    };

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const response = await fetch('/api/market', { cache: 'no-store' });
                if (!response.ok) return;

                const data = await response.json().catch(() => null);
                if (!data) return;
                const apiStocks = Array.isArray(data?.stocks) ? data.stocks : [];
                const apiIndices = Array.isArray(data?.indices) ? data.indices : [];

                const toNumber = (value) => {
                    const num = typeof value === 'number' ? value : Number(String(value ?? '').replace(/,/g, ''));
                    return Number.isFinite(num) ? num : 0;
                };

                setStocks(
                    apiStocks.map((stock) => ({
                        ...stock,
                        displaySymbol: typeof stock.symbol === 'string' ? stock.symbol.replace('.NS', '') : stock.symbol,
                        price: toNumber(stock.price),
                        change: toNumber(stock.change),
                        changePercent: toNumber(stock.changePercent),
                        high: toNumber(stock.high),
                        low: toNumber(stock.low),
                        spark: Array.isArray(stock.spark) ? stock.spark : null,
                    }))
                );

                setNiftyIndices(
                    apiIndices.map((index) => ({
                        ...index,
                        name: INDEX_NAME_BY_SYMBOL[index.symbol] || index.name || index.symbol,
                        value: toNumber(index.price),
                        change: toNumber(index.change),
                        changePercent: toNumber(index.changePercent),
                    }))
                );

                setLastUpdate(data?.lastUpdated ? new Date(data.lastUpdated) : new Date());
            } catch (error) {
                // Silent fail: keep last good data.
            }
        };

        fetchMarketData();
        
        // Refresh data every 30 seconds
        const interval = setInterval(fetchMarketData, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleRefresh = () => {
        setIsLoading(true);
        
        const fetchMarketData = async () => {
            try {
                const response = await fetch('/api/market', { cache: 'no-store' });
                if (!response.ok) {
                    setIsLoading(false);
                    return;
                }

                const data = await response.json().catch(() => null);
                if (!data) {
                    setIsLoading(false);
                    return;
                }
                const apiStocks = Array.isArray(data?.stocks) ? data.stocks : [];
                const apiIndices = Array.isArray(data?.indices) ? data.indices : [];

                const toNumber = (value) => {
                    const num = typeof value === 'number' ? value : Number(String(value ?? '').replace(/,/g, ''));
                    return Number.isFinite(num) ? num : 0;
                };

                setStocks(
                    apiStocks.map((stock) => ({
                        ...stock,
                        displaySymbol: typeof stock.symbol === 'string' ? stock.symbol.replace('.NS', '') : stock.symbol,
                        price: toNumber(stock.price),
                        change: toNumber(stock.change),
                        changePercent: toNumber(stock.changePercent),
                        high: toNumber(stock.high),
                        low: toNumber(stock.low),
                        spark: Array.isArray(stock.spark) ? stock.spark : null,
                    }))
                );

                setNiftyIndices(
                    apiIndices.map((index) => ({
                        ...index,
                        name: INDEX_NAME_BY_SYMBOL[index.symbol] || index.name || index.symbol,
                        value: toNumber(index.price),
                        change: toNumber(index.change),
                        changePercent: toNumber(index.changePercent),
                    }))
                );

                setLastUpdate(data?.lastUpdated ? new Date(data.lastUpdated) : new Date());
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        
        fetchMarketData();
    };

    const sparkPolygon = (values) => {
        if (!Array.isArray(values) || values.length < 2) return 'polygon(0% 100%, 0% 70%, 100% 70%, 100% 100%)';

        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;

        const points = values.map((value, idx) => {
            const x = (idx / (values.length - 1)) * 100;
            const normalized = (value - min) / range;
            const y = 80 - normalized * 60; // 20..80
            return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
        });

        return `polygon(0% 100%, ${points.join(', ')}, 100% 100%)`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(price);
    };

    return (
        <section ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ''}`}>
            {/* Grid overlay */}
            <div className={styles.gridOverlay}></div>
            
            {/* Glow effect */}
            <div className={styles.glowEffect}></div>

            <div className={styles.container}>
                {/* Header */}
                <div className={`${styles.header} ${isVisible ? styles.fadeInUp : ''}`}>
                    <div className={styles.badge}>
                        <span className={styles.liveDot}></span>
                        <span className={styles.badgeText}>Live NSE Market Data</span>
                    </div>
                    
                    <h2 className={styles.title}>
                        Real-Time <span className={styles.highlight}>NSE Trading</span> Insights
                    </h2>
                    <p className={styles.subtitle}>
                        Track live NSE stock prices and market movements in real-time
                    </p>
                </div>

                {/* Refresh button */}
                <div className={`${styles.refreshContainer} ${isVisible ? styles.fadeIn : ''}`}>
                    <p className={styles.lastUpdate}>
                        Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString('en-IN') : '—'}
                    </p>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className={styles.refreshButton}
                    >
                        <svg 
                            className={`${styles.refreshIcon} ${isLoading ? styles.spinning : ''}`}
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Stocks grid */}
                <div className={`${styles.stocksGrid} ${isVisible ? styles.fadeInUp : ''}`}>
                    {stocks.map((stock, index) => (
                        <div
                            key={stock.symbol}
                            className={styles.stockCard}
                            style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                        >
                            {/* Header */}
                            <div className={styles.stockHeader}>
                                <div>
                                    <h3 className={styles.stockSymbol}>{stock.displaySymbol || stock.symbol}</h3>
                                    <p className={styles.stockName}>{stock.name}</p>
                                </div>
                                <div className={styles.stockBadge}>NSE</div>
                            </div>

                            {/* Price */}
                            <div className={styles.priceSection}>
                                <div className={styles.currentPrice}>
                                    {formatPrice(stock.price)}
                                </div>
                                <div className={
                                    stock.change >= 0 
                                        ? styles.priceChangePositive 
                                        : styles.priceChangeNegative
                                }>
                                    <svg 
                                        width="12" 
                                        height="12" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                    >
                                        {stock.change >= 0 ? (
                                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                                        ) : (
                                            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                                        )}
                                    </svg>
                                    {stock.changePercent >= 0 ? '+' : ''}{Number(stock.changePercent || 0).toFixed(2)}%
                                </div>
                            </div>

                            {/* Stats */}
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <p className={styles.statLabel}>High</p>
                                    <p className={styles.statValue}>{formatPrice(stock.high)}</p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statLabel}>Low</p>
                                    <p className={styles.statValue}>{formatPrice(stock.low)}</p>
                                </div>
                            </div>

                            {/* Mini chart placeholder */}
                            <div className={styles.miniChart}>
                                <div 
                                    className={stock.change >= 0 ? styles.chartPositive : styles.chartNegative}
                                    style={{
                                        clipPath: sparkPolygon(stock.spark)
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* NIFTY indices */}
                <div className={`${styles.indicesGrid} ${isVisible ? styles.fadeInUp : ''}`}>
                    {niftyIndices.map((index, i) => (
                        <div
                            key={index.name}
                            className={styles.indexCard}
                            style={{ animationDelay: `${0.6 + i * 0.1}s` }}
                        >
                            <div>
                                <p className={styles.indexName}>{index.name}</p>
                                <p className={styles.indexValue}>{Number(index.value || 0).toLocaleString('en-IN')}</p>
                            </div>
                            <div className={`${styles.indexChange} ${index.change >= 0 ? styles.positive : styles.negative}`}>
                                <p className={styles.indexChangeValue}>
                                    {index.change >= 0 ? '+' : ''}{Number(index.change || 0).toFixed(2)}
                                </p>
                                <p className={styles.indexChangePercent}>
                                    ({index.change >= 0 ? '+' : ''}{Number(index.changePercent || 0).toFixed(2)}%)
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeSection8;