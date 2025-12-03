"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './homeSection9.module.css';

const HomeSection9 = () => {
    const sectionRef = useRef(null);
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const [selectedCoin, setSelectedCoin] = useState('bitcoin');
    const [timeRange, setTimeRange] = useState('7');
    const [allChartData, setAllChartData] = useState({});
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [loading, setLoading] = useState(true);

    const coins = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: '#f7931a' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627eea' },
        { id: 'binancecoin', name: 'BNB', symbol: 'BNB', color: '#f3ba2f' },
        { id: 'solana', name: 'Solana', symbol: 'SOL', color: '#14f195' },
        { id: 'cardano', name: 'Cardano', symbol: 'ADA', color: '#0033ad' },
        { id: 'ripple', name: 'XRP', symbol: 'XRP', color: '#23292f' }
    ];

    const timeRanges = [
        { value: '1', label: '24H' },
        { value: '7', label: '7D' },
        { value: '30', label: '30D' },
        { value: '90', label: '90D' }
    ];

    // Fetch chart data for all coins
    useEffect(() => {
        const fetchAllChartData = async () => {
            setLoading(true);
            
            // Generate dummy data for all coins initially
            const chartDataMap = {};
            coins.forEach(coin => {
                chartDataMap[coin.id] = {
                    prices: generateDummyData(coin.id),
                    color: coin.color,
                    symbol: coin.symbol
                };
            });
            
            setAllChartData(chartDataMap);
            setLoading(false);
            
            // Try to fetch real data in background
            try {
                for (let i = 0; i < coins.length; i++) {
                    const coin = coins[i];
                    
                    try {
                        const response = await fetch(
                            `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${timeRange}`,
                            {
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json',
                                }
                            }
                        );
                        
                        if (response.ok) {
                            const data = await response.json();
                            setAllChartData(prev => ({
                                ...prev,
                                [coin.id]: {
                                    prices: data.prices,
                                    color: coin.color,
                                    symbol: coin.symbol
                                }
                            }));
                        }
                        
                        // Add delay between requests
                        if (i < coins.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    } catch (error) {
                        console.warn(`Could not fetch real data for ${coin.id}, using simulated data`);
                    }
                }
            } catch (error) {
                console.warn('Using simulated data due to API unavailability');
            }
        };

        fetchAllChartData();
    }, [timeRange]);

    // Generate realistic dummy data as fallback
    const generateDummyData = (coinId) => {
        const now = Date.now();
        const pointsPerDay = 24;
        const days = parseInt(timeRange);
        const totalPoints = days * pointsPerDay;
        const data = [];
        
        // Different base prices for different coins
        const basePrices = {
            'bitcoin': 45000,
            'ethereum': 2500,
            'binancecoin': 320,
            'solana': 110,
            'cardano': 0.55,
            'ripple': 0.52
        };
        
        const basePrice = basePrices[coinId] || 1000;
        const volatility = basePrice * 0.05; // 5% volatility
        
        let currentPrice = basePrice;
        
        for (let i = 0; i < totalPoints; i++) {
            const timestamp = now - (totalPoints - i) * (3600000 / pointsPerDay);
            
            // Random walk with trend
            const change = (Math.random() - 0.48) * volatility; // Slight upward bias
            currentPrice += change;
            
            // Add some noise
            const noise = Math.sin(i / 5) * (volatility * 0.2);
            const price = Math.max(currentPrice + noise, basePrice * 0.8); // Don't go below 80% of base
            
            data.push([timestamp, price]);
        }
        
        return data;
    };

    // Draw chart on canvas with mouse tracking
    useEffect(() => {
        if (!allChartData[selectedCoin] || !canvasRef.current || loading) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const width = rect.width;
        const height = rect.height;
        const padding = 60;

        const chartData = allChartData[selectedCoin].prices;
        const prices = chartData.map(point => point[1]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;

        const isPositive = prices[prices.length - 1] >= prices[0];

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i / 5) * (height - padding * 2);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Price labels
            const price = maxPrice - (i / 5) * priceRange;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`$${price.toFixed(2)}`, padding - 10, y + 4);
        }

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, isPositive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        // Draw area chart
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);

        chartData.forEach((point, index) => {
            const x = padding + (index / (chartData.length - 1)) * (width - padding * 2);
            const y = height - padding - ((point[1] - minPrice) / priceRange) * (height - padding * 2);
            ctx.lineTo(x, y);
        });

        ctx.lineTo(width - padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line chart
        ctx.beginPath();
        chartData.forEach((point, index) => {
            const x = padding + (index / (chartData.length - 1)) * (width - padding * 2);
            const y = height - padding - ((point[1] - minPrice) / priceRange) * (height - padding * 2);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.strokeStyle = isPositive ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw hovered point
        if (hoveredPoint) {
            const x = padding + (hoveredPoint.index / (chartData.length - 1)) * (width - padding * 2);
            const y = height - padding - ((hoveredPoint.price - minPrice) / priceRange) * (height - padding * 2);

            // Vertical line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
            ctx.setLineDash([]);

            // Point
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = isPositive ? '#22c55e' : '#ef4444';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Tooltip background
            const tooltipWidth = 120;
            const tooltipHeight = 60;
            const tooltipX = x > width / 2 ? x - tooltipWidth - 15 : x + 15;
            const tooltipY = y - tooltipHeight / 2;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.strokeStyle = isPositive ? '#22c55e' : '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
            ctx.fill();
            ctx.stroke();

            // Tooltip text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`$${hoveredPoint.price.toFixed(2)}`, tooltipX + 10, tooltipY + 25);
            
            ctx.font = '11px sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            const date = new Date(hoveredPoint.timestamp);
            ctx.fillText(date.toLocaleDateString(), tooltipX + 10, tooltipY + 45);
        }

    }, [allChartData, selectedCoin, loading, hoveredPoint]);

    // Mouse move handler
    const handleMouseMove = (e) => {
        if (!allChartData[selectedCoin] || loading) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        const padding = 60;
        const chartWidth = rect.width - padding * 2;
        const relativeX = x - padding;

        if (relativeX < 0 || relativeX > chartWidth) {
            setHoveredPoint(null);
            return;
        }

        const chartData = allChartData[selectedCoin].prices;
        const index = Math.round((relativeX / chartWidth) * (chartData.length - 1));
        
        if (chartData[index]) {
            setHoveredPoint({
                index,
                price: chartData[index][1],
                timestamp: chartData[index][0]
            });
        }
    };

    const handleMouseLeave = () => {
        setHoveredPoint(null);
    };

    // GSAP animations
    useEffect(() => {
        const section = sectionRef.current;
        const chart = chartRef.current;

        const ctx = gsap.context(() => {
            gsap.set(chart, { y: 50, opacity: 0 });

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(chart, {
                                y: 0,
                                opacity: 1,
                                duration: 0.8,
                                ease: 'power3.out'
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
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const getCurrentPrice = () => {
        if (!allChartData[selectedCoin]) return 0;
        const prices = allChartData[selectedCoin].prices;
        return prices[prices.length - 1][1];
    };

    const getPriceChange = () => {
        if (!allChartData[selectedCoin]) return 0;
        const prices = allChartData[selectedCoin].prices;
        const firstPrice = prices[0][1];
        const lastPrice = prices[prices.length - 1][1];
        return ((lastPrice - firstPrice) / firstPrice) * 100;
    };

    return (
        <div ref={sectionRef} className={styles.section}>
            <div className={styles.bgGradient}></div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <span className={styles.liveDot}></span>
                        Live Market Charts
                    </div>
                    <h2 className={styles.title}>
                        Interactive <span className={styles.highlight}>Price Charts</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Track real-time cryptocurrency prices with interactive charts. Hover to see exact prices at any point.
                    </p>
                </div>

                <div ref={chartRef} className={styles.chartContainer}>
                    <div className={styles.controls}>
                        <div className={styles.coinSelector}>
                            {coins.map((coin) => (
                                <button
                                    key={coin.id}
                                    className={`${styles.coinButton} ${
                                        selectedCoin === coin.id ? styles.coinButtonActive : ''
                                    }`}
                                    onClick={() => setSelectedCoin(coin.id)}
                                    style={{
                                        '--coin-color': coin.color
                                    }}
                                >
                                    <span className={styles.coinSymbol}>{coin.symbol}</span>
                                </button>
                            ))}
                        </div>

                        <div className={styles.timeSelector}>
                            {timeRanges.map((range) => (
                                <button
                                    key={range.value}
                                    className={`${styles.timeButton} ${
                                        timeRange === range.value ? styles.timeButtonActive : ''
                                    }`}
                                    onClick={() => setTimeRange(range.value)}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!loading && (
                        <div className={styles.priceInfo}>
                            <div>
                                <div className={styles.coinLabel}>
                                    {coins.find(c => c.id === selectedCoin)?.name}
                                </div>
                                <div className={styles.currentPrice}>
                                    {formatPrice(hoveredPoint?.price || getCurrentPrice())}
                                </div>
                            </div>
                            <div className={
                                getPriceChange() >= 0 
                                    ? styles.priceChangePositive 
                                    : styles.priceChangeNegative
                            }>
                                {getPriceChange() >= 0 ? '↑' : '↓'}
                                {Math.abs(getPriceChange()).toFixed(2)}%
                            </div>
                        </div>
                    )}

                    <div 
                        className={styles.chartWrapper}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {loading ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.spinner}></div>
                                <p className={styles.loadingText}>Loading chart data...</p>
                            </div>
                        ) : (
                            <canvas ref={canvasRef} className={styles.canvas}></canvas>
                        )}
                    </div>

                    {!loading && allChartData[selectedCoin] && (
                        <div className={styles.chartFooter}>
                            <div className={styles.footerItem}>
                                <span className={styles.footerLabel}>Highest</span>
                                <span className={styles.footerValue}>
                                    {formatPrice(Math.max(...allChartData[selectedCoin].prices.map(p => p[1])))}
                                </span>
                            </div>
                            <div className={styles.footerItem}>
                                <span className={styles.footerLabel}>Lowest</span>
                                <span className={styles.footerValue}>
                                    {formatPrice(Math.min(...allChartData[selectedCoin].prices.map(p => p[1])))}
                                </span>
                            </div>
                            <div className={styles.footerItem}>
                                <span className={styles.footerLabel}>Average</span>
                                <span className={styles.footerValue}>
                                    {formatPrice(
                                        allChartData[selectedCoin].prices.reduce((sum, p) => sum + p[1], 0) / 
                                        allChartData[selectedCoin].prices.length
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeSection9;