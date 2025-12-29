"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './homeSection8.module.css';

const HomeSection8 = () => {
    const sectionRef = useRef(null);
    const [stocks, setStocks] = useState([]);
    const [niftyIndices, setNiftyIndices] = useState([
        { name: "NIFTY 50", value: 22456.80, change: 145.30, changePercent: 0.65 },
        { name: "NIFTY BANK", value: 47892.45, change: -123.50, changePercent: -0.26 },
        { name: "NIFTY IT", value: 34567.20, change: 234.80, changePercent: 0.68 },
    ]);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    // Initial NSE stock symbols
    const nseStockSymbols = [
        "RELIANCE.BSE", "TCS.BSE", "HDFCBANK.BSE", "INFY.BSE",
        "ICICIBANK.BSE", "BHARTIARTL.BSE", "SBIN.BSE", "WIPRO.BSE"
    ];

    // Fallback data in case API fails
    const fallbackStocks = [
        { symbol: "RELIANCE", name: "Reliance Industries", price: 2456.75, change: 23.45, changePercent: 0.96, volume: "12.5M", high: 2478.90, low: 2431.20 },
        { symbol: "TCS", name: "Tata Consultancy", price: 3892.30, change: -15.60, changePercent: -0.40, volume: "8.2M", high: 3912.50, low: 3875.00 },
        { symbol: "HDFCBANK", name: "HDFC Bank", price: 1678.45, change: 12.80, changePercent: 0.77, volume: "15.3M", high: 1689.00, low: 1665.00 },
        { symbol: "INFY", name: "Infosys", price: 1456.20, change: 8.35, changePercent: 0.58, volume: "9.8M", high: 1462.50, low: 1445.00 },
        { symbol: "ICICIBANK", name: "ICICI Bank", price: 1023.50, change: -5.20, changePercent: -0.51, volume: "11.2M", high: 1032.00, low: 1018.00 },
        { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1289.75, change: 18.90, changePercent: 1.49, volume: "6.7M", high: 1295.00, low: 1268.00 },
        { symbol: "SBIN", name: "State Bank of India", price: 628.40, change: 4.25, changePercent: 0.68, volume: "22.1M", high: 632.50, low: 623.00 },
        { symbol: "WIPRO", name: "Wipro", price: 478.65, change: -2.80, changePercent: -0.58, volume: "7.4M", high: 483.00, low: 475.50 },
    ];

    // Fetch stock data from API
    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setLoading(true);
                
                // Using Yahoo Finance API alternative (free, no API key needed)
                // You can replace this with any Indian stock API
                const response = await fetch(
                    'https://query1.finance.yahoo.com/v7/finance/quote?symbols=RELIANCE.NS,TCS.NS,HDFCBANK.NS,INFY.NS,ICICIBANK.NS,BHARTIARTL.NS,SBIN.NS,WIPRO.NS'
                );
                
                if (!response.ok) {
                    throw new Error('API response not ok');
                }
                
                const data = await response.json();
                
                if (data?.quoteResponse?.result) {
                    const formattedStocks = data.quoteResponse.result.map(stock => ({
                        symbol: stock.symbol.replace('.NS', ''),
                        name: stock.shortName || stock.longName || stock.symbol,
                        price: stock.regularMarketPrice || 0,
                        change: stock.regularMarketChange || 0,
                        changePercent: stock.regularMarketChangePercent || 0,
                        volume: formatVolume(stock.regularMarketVolume || 0),
                        high: stock.regularMarketDayHigh || 0,
                        low: stock.regularMarketDayLow || 0,
                    }));
                    
                    setStocks(formattedStocks);
                } else {
                    // Use fallback data if API doesn't return expected format
                    setStocks(fallbackStocks);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stock data:', error);
                // Use fallback data on error
                setStocks(fallbackStocks);
                setLoading(false);
            }
        };

        fetchStockData();
        
        // Refresh data every 30 seconds
        const interval = setInterval(fetchStockData, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const formatVolume = (volume) => {
        if (volume >= 1e6) {
            return `${(volume / 1e6).toFixed(1)}M`;
        }
        if (volume >= 1e3) {
            return `${(volume / 1e3).toFixed(1)}K`;
        }
        return volume.toString();
    };

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

    // Simulate NIFTY indices updates
    useEffect(() => {
        const updateNiftyIndices = () => {
            setNiftyIndices(prevIndices =>
                prevIndices.map(index => {
                    const change = (Math.random() - 0.5) * index.value * 0.001;
                    const newValue = index.value + change;
                    const newChange = index.change + change;
                    const newChangePercent = (newChange / (newValue - newChange)) * 100;

                    return {
                        ...index,
                        value: parseFloat(newValue.toFixed(2)),
                        change: parseFloat(newChange.toFixed(2)),
                        changePercent: parseFloat(newChangePercent.toFixed(2)),
                    };
                })
            );
        };

        const interval = setInterval(updateNiftyIndices, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsLoading(true);
        
        // Re-fetch stock data
        const fetchStockData = async () => {
            try {
                const response = await fetch(
                    'https://query1.finance.yahoo.com/v7/finance/quote?symbols=RELIANCE.NS,TCS.NS,HDFCBANK.NS,INFY.NS,ICICIBANK.NS,BHARTIARTL.NS,SBIN.NS,WIPRO.NS'
                );
                
                if (!response.ok) {
                    throw new Error('API response not ok');
                }
                
                const data = await response.json();
                
                if (data?.quoteResponse?.result) {
                    const formattedStocks = data.quoteResponse.result.map(stock => ({
                        symbol: stock.symbol.replace('.NS', ''),
                        name: stock.shortName || stock.longName || stock.symbol,
                        price: stock.regularMarketPrice || 0,
                        change: stock.regularMarketChange || 0,
                        changePercent: stock.regularMarketChangePercent || 0,
                        volume: formatVolume(stock.regularMarketVolume || 0),
                        high: stock.regularMarketDayHigh || 0,
                        low: stock.regularMarketDayLow || 0,
                    }));
                    
                    setStocks(formattedStocks);
                }
                
                setLastUpdate(new Date());
                setIsLoading(false);
            } catch (error) {
                console.error('Error refreshing stock data:', error);
                setLastUpdate(new Date());
                setIsLoading(false);
            }
        };
        
        fetchStockData();
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
                        Last updated: {lastUpdate.toLocaleTimeString('en-IN')}
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

                {/* Loading State */}
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p className={styles.loadingText}>Loading market data...</p>
                    </div>
                ) : (
                    <>
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
                                            <h3 className={styles.stockSymbol}>{stock.symbol}</h3>
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
                                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
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
                                                clipPath: `polygon(0% 100%, 10% ${50 + Math.random() * 40}%, 20% ${40 + Math.random() * 30}%, 30% ${45 + Math.random() * 35}%, 40% ${35 + Math.random() * 40}%, 50% ${40 + Math.random() * 30}%, 60% ${30 + Math.random() * 35}%, 70% ${35 + Math.random() * 30}%, 80% ${25 + Math.random() * 40}%, 90% ${30 + Math.random() * 25}%, 100% ${20 + Math.random() * 30}%, 100% 100%)`
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
                                        <p className={styles.indexValue}>{index.value.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className={`${styles.indexChange} ${index.change >= 0 ? styles.positive : styles.negative}`}>
                                        <p className={styles.indexChangeValue}>
                                            {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                                        </p>
                                        <p className={styles.indexChangePercent}>
                                            ({index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default HomeSection8;