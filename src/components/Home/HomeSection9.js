"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './homeSection9.module.css';

const HomeSection9 = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [timeRange, setTimeRange] = useState('90');
  const [allChartData, setAllChartData] = useState({});
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', color: '#0047AB' },
    { symbol: 'TCS', name: 'Tata Consultancy', color: '#00539C' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', color: '#004C8F' },
    { symbol: 'INFY', name: 'Infosys', color: '#007CC3' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', color: '#F37021' },
    { symbol: 'SBIN', name: 'State Bank of India', color: '#22409A' }
  ];

  const timeRanges = [
    { value: '1', label: '1D' },
    // { value: '7', label: '1W' },
    { value: '30', label: '1M' },
    { value: '90', label: '3M' }
  ];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const toNumber = (value) => {
      const num = typeof value === 'number' ? value : Number(String(value ?? '').replace(/,/g, ''));
      return Number.isFinite(num) ? num : 0;
    };

    const fetchChartData = async () => {
      try {
        const symbols = stocks.map((s) => s.symbol).join(',');
        const response = await fetch(`/api/market?candles=1&chartSymbols=${encodeURIComponent(symbols)}&range=${encodeURIComponent(timeRange)}`,
          { cache: 'no-store', signal: controller.signal }
        );
        if (!response.ok) return;

        const payload = await response.json().catch(() => null);
        if (!payload || !isMounted) return;

        const candles = payload?.candles && typeof payload.candles === 'object' ? payload.candles : {};
        const chartDataMap = {};

        stocks.forEach((stock) => {
          const rows = Array.isArray(candles?.[stock.symbol]) ? candles[stock.symbol] : [];
          const data = rows
            .map((c) => ({
              timestamp: toNumber(c?.timestamp),
              open: toNumber(c?.open),
              high: toNumber(c?.high),
              low: toNumber(c?.low),
              close: toNumber(c?.close),
              volume: toNumber(c?.volume),
            }))
            .filter((c) => c.timestamp && (c.open || c.high || c.low || c.close));

          if (data.length) {
            chartDataMap[stock.symbol] = {
              data,
              name: stock.name,
            };
          }
        });

        // Silent background update: only overwrite if we got some real data.
        if (Object.keys(chartDataMap).length) {
          setAllChartData(chartDataMap);
          if (!chartDataMap[selectedStock]) {
            const firstAvailable = Object.keys(chartDataMap)[0];
            if (firstAvailable) setSelectedStock(firstAvailable);
          }
          const updated = payload?.lastUpdated ? new Date(payload.lastUpdated) : new Date();
          setLastUpdate(updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        }
      } catch {
        // Silent fail
      }
    };

    // No visible loading; fetch silently.
    fetchChartData();
    const interval = setInterval(fetchChartData, 30000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [timeRange]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setIsVisible(true)),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => setHoveredPoint(null);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw chart
  useEffect(() => {
    if (!allChartData[selectedStock] || !canvasRef.current) return;

    const chartData = allChartData[selectedStock]?.data;
    if (!Array.isArray(chartData) || chartData.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const yAxisWidth = 70;
    const candleStartX = 100;
    const padding = { top: 40, right: 60, bottom: 60, left: yAxisWidth };

    
    const allPrices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice || 1;

    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = width - candleStartX - padding.right;

    ctx.clearRect(0, 0, width, height);

    // Y-axis grid and labels (fixed position)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(yAxisWidth, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const price = maxPrice - (i / 5) * priceRange;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`₹${price.toFixed(0)}`, yAxisWidth - 8, y + 4);
    }

    // Y-axis line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(yAxisWidth, padding.top);
    ctx.lineTo(yAxisWidth, height - padding.bottom);
    ctx.stroke();

    // Candlesticks with gap from Y-axis
    const candleWidth = Math.max(2, (chartWidth / chartData.length) * 0.7);
    chartData.forEach((candle, index) => {
      const x = candleStartX + (index / (chartData.length - 1)) * chartWidth;
      const openY = padding.top + ((maxPrice - candle.open) / priceRange) * chartHeight;
      const closeY = padding.top + ((maxPrice - candle.close) / priceRange) * chartHeight;
      const highY = padding.top + ((maxPrice - candle.high) / priceRange) * chartHeight;
      const lowY = padding.top + ((maxPrice - candle.low) / priceRange) * chartHeight;

      const isGreen = candle.close >= candle.open;
      ctx.strokeStyle = isGreen ? '#00ff88' : '#ff4444';
      ctx.fillStyle = isGreen ? '#00ff88' : '#ff4444';

      // Wick
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      if (bodyHeight < 1) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - candleWidth / 2, openY);
        ctx.lineTo(x + candleWidth / 2, openY);
        ctx.stroke();
      } else {
        ctx.shadowColor = isGreen ? '#00ff88' : '#ff4444';
        ctx.shadowBlur = 8;
        ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.strokeRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
      }
    });

    // Time labels
    const timeLabels = 5;
    for (let i = 0; i < timeLabels; i++) {
      const index = Math.floor((i / (timeLabels - 1)) * (chartData.length - 1));
      const x = candleStartX + (index / (chartData.length - 1)) * chartWidth;
      const date = new Date(chartData[index].timestamp);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      const label = timeRange === '1' 
        ? date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      ctx.fillText(label, x, height - padding.bottom + 20);
    }

    // Hover tooltip + crosshair
    if (hoveredPoint && chartData[hoveredPoint.index]) {
      const candle = chartData[hoveredPoint.index];
      const x = candleStartX + (hoveredPoint.index / (chartData.length - 1)) * chartWidth;
      const y = padding.top + ((maxPrice - candle.close) / priceRange) * chartHeight;

      // Crosshair
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.moveTo(yAxisWidth, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Hover dot
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = candle.close >= candle.open ? '#00ff88' : '#ff4444';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tooltip
      const tooltipWidth = 160;
      const tooltipHeight = 110;
      const tooltipX = x > width / 2 ? x - tooltipWidth - 15 : x + 15;
      const tooltipY = Math.max(padding.top, Math.min(y - tooltipHeight / 2, height - padding.bottom - tooltipHeight));

      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.strokeStyle = candle.close >= candle.open ? '#00ff88' : '#ff4444';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';

      let yOffset = tooltipY + 18;
      ctx.fillText(`O: ₹${candle.open.toFixed(2)}`, tooltipX + 10, yOffset);
      yOffset += 18;
      ctx.fillText(`H: ₹${candle.high.toFixed(2)}`, tooltipX + 10, yOffset);
      yOffset += 18;
      ctx.fillText(`L: ₹${candle.low.toFixed(2)}`, tooltipX + 10, yOffset);
      yOffset += 18;
      ctx.fillText(`C: ₹${candle.close.toFixed(2)}`, tooltipX + 10, yOffset);
    }
  }, [allChartData, selectedStock, loading, hoveredPoint, timeRange]);

  const handleMouseMove = (e) => {
    if (!allChartData[selectedStock]) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const candleStartX = 100;
    const paddingRight = 60;
    const chartWidth = rect.width - candleStartX - paddingRight;
    const relativeX = x - candleStartX;

    if (relativeX < 0 || relativeX > chartWidth) {
      setHoveredPoint(null);
      return;
    }

    const chartData = allChartData[selectedStock].data;
    if (!Array.isArray(chartData) || chartData.length < 2) return;
    const index = Math.round((relativeX / chartWidth) * (chartData.length - 1));
    if (chartData[index]) setHoveredPoint({ index });
  };

  const handleMouseLeave = () => setHoveredPoint(null);

  const formatPrice = (price) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  const getCurrentPrice = () => allChartData[selectedStock]?.data?.[allChartData[selectedStock].data.length - 1]?.close || 0;
  const getPriceChange = () => {
    const data = allChartData[selectedStock]?.data;
    if (!data?.length) return 0;
    const first = data[0].close, last = data[data.length - 1].close;
    return first ? ((last - first) / first * 100) : 0;
  };

  return (
    <div ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.bgGradient}></div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.fadeInUp : ''}`}>
          <div className={styles.badge}>
            <span className={styles.liveDot}></span>
            Live Market Charts
          </div>
          <h2 className={styles.title}>
            Interactive <span className={styles.highlight}>Price Charts</span>
          </h2>
          <p className={styles.subtitle}>
            Track NSE stock prices with TradingView-style candlestick charts. Updates every 30s.
          </p>
        </div>

        <div className={`${styles.chartContainer} ${isVisible ? styles.fadeInUp : ''}`}>
          <div className={styles.controls}>
            <div className={styles.stockSelector}>
              {stocks.map((stock) => (
                <button
                  key={stock.symbol}
                  data-symbol={stock.symbol}
                  className={`${styles.stockButton} ${selectedStock === stock.symbol ? styles.stockButtonActive : ''}`}
                  onClick={() => setSelectedStock(stock.symbol)}
                >
                  {stock.symbol}
                </button>
              ))}
            </div>

            <div className={styles.timeSelector}>
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  className={`${styles.timeButton} ${timeRange === range.value ? styles.timeButtonActive : ''}`}
                  onClick={() => setTimeRange(range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {lastUpdate && (
            <div className={styles.liveStatus}>
              🟢 Live - Updated {lastUpdate} (Auto-refresh every 30s)
            </div>
          )}

          {(
            <div className={styles.priceInfo}>
              <div>
                <div className={styles.stockLabel}>
                  {allChartData[selectedStock]?.name}
                </div>
                <div className={styles.currentPrice}>
                  {formatPrice(hoveredPoint 
                    ? allChartData[selectedStock].data[hoveredPoint.index]?.close 
                    : getCurrentPrice())}
                </div>
              </div>
              <div className={getPriceChange() >= 0 ? styles.priceChangePositive : styles.priceChangeNegative}>
                {getPriceChange() >= 0 ? '↑' : '↓'}{Math.abs(getPriceChange()).toFixed(2)}%
              </div>
            </div>
          )}

          <div 
            className={styles.chartWrapper}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <canvas ref={canvasRef} className={styles.canvas} />
          </div>

          {allChartData[selectedStock] && (
            <div className={styles.chartFooter}>
              <div className={styles.footerItem}>
                <span className={styles.footerLabel}>High</span>
                <span className={styles.footerValue}>
                  {formatPrice(Math.max(...allChartData[selectedStock].data.map(d => d.high)))}
                </span>
              </div>
              <div className={styles.footerItem}>
                <span className={styles.footerLabel}>Low</span>
                <span className={styles.footerValue}>
                  {formatPrice(Math.min(...allChartData[selectedStock].data.map(d => d.low)))}
                </span>
              </div>
              <div className={styles.footerItem}>
                <span className={styles.footerLabel}>Volume</span>
                <span className={styles.footerValue}>
                  {allChartData[selectedStock].data[allChartData[selectedStock].data.length - 1]?.volume?.toLocaleString() || 'N/A'}
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
