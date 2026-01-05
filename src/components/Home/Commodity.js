"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./Commodity.module.css";

// Yahoo Finance symbols.
// - GC=F: Gold futures (USD per troy ounce) -> converted to INR/10g in the API
// - SI=F: Silver futures (USD per troy ounce) -> converted to INR/kg in the API
// - CL=F: Crude futures (USD per barrel) -> converted to INR/bbl in the API
const COMMODITY_ORDER = ["GC=F", "SI=F", "CL=F"];
const CRYPTO_ORDER = ["BTC-USD", "ETH-USD"];
const DEFAULT_ORDER = [...COMMODITY_ORDER, ...CRYPTO_ORDER];

function isFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value);
}

function formatPrice(symbol, price, currency) {
	if (!isFiniteNumber(price)) return "—";

	const isCrypto = symbol === "BTC-USD" || symbol === "ETH-USD";
	const maximumFractionDigits = isCrypto ? 2 : 2;
	const minimumFractionDigits = isCrypto ? 2 : 2;

	const formatter = new Intl.NumberFormat("en-US", {
		style: currency ? "currency" : "decimal",
		currency: currency || undefined,
		maximumFractionDigits,
		minimumFractionDigits,
	});

	return formatter.format(price);
}

function formatPercent(value) {
	if (!isFiniteNumber(value)) return "—";
	const abs = Math.abs(value);
	const digits = abs < 1 ? 2 : 2;
	return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

function formatChange(value) {
	if (!isFiniteNumber(value)) return "—";
	const sign = value >= 0 ? "+" : "";
	return `${sign}${value.toFixed(2)}`;
}

function labelForSymbol(symbol) {
	if (symbol === "GC=F") return "Gold (10g)";
	if (symbol === "SI=F") return "Silver (1kg)";
	if (symbol === "CL=F") return "Crude Oil (1 bbl)";
	if (symbol === "BTC-USD") return "Bitcoin";
	if (symbol === "ETH-USD") return "Ethereum";
	return symbol;
}

export default function Commodity() {
	const [items, setItems] = useState([]);
	const [lastUpdated, setLastUpdated] = useState(null);
	const [loading, setLoading] = useState(true);

	const refreshMs = 10_000;

	const orderedItems = useMemo(() => {
		const map = new Map((items || []).map((item) => [item.symbol, item]));
		return DEFAULT_ORDER.map((sym) => map.get(sym)).filter(Boolean);
	}, [items]);

	const commodityItems = useMemo(() => {
		const map = new Map((orderedItems || []).map((item) => [item.symbol, item]));
		return COMMODITY_ORDER.map((sym) => map.get(sym)).filter(Boolean);
	}, [orderedItems]);

	const cryptoItems = useMemo(() => {
		const map = new Map((orderedItems || []).map((item) => [item.symbol, item]));
		return CRYPTO_ORDER.map((sym) => map.get(sym)).filter(Boolean);
	}, [orderedItems]);

	useEffect(() => {
		let timer;
		let cancelled = false;

		const load = async () => {
			try {
				const response = await fetch(`/api/commodity?currency=inr`, {
					cache: "no-store",
				});
				const json = await response.json();
				if (cancelled) return;

				if (Array.isArray(json?.items)) setItems(json.items);
				if (json?.lastUpdated) setLastUpdated(json.lastUpdated);
			} catch {
				// keep last good values
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		load();
		timer = window.setInterval(load, refreshMs);

		return () => {
			cancelled = true;
			if (timer) window.clearInterval(timer);
		};
	}, []);

	return (
		<section className={styles.section}>
			<div className={styles.inner}>
				<div className={styles.headerRow}>
					<h2 className={styles.heading}>Live Market</h2>
					<div className={styles.meta}>
						<span className={styles.liveDot} aria-hidden="true" />
						<span className={styles.metaText}>
							{loading
								? "Loading live data…"
								: lastUpdated
									? `Live • ${new Date(lastUpdated).toLocaleTimeString()}`
									: "Live"}
						</span>
					</div>
				</div>

				<div className={styles.group}>
					<h3 className={styles.subheading}>Commodity</h3>
					{!loading && commodityItems.length === 0 ? (
						<p className={styles.emptyState}>
							No live commodity data received.
						</p>
					) : null}
					<div className={styles.gridCommodity}>
						{(
							commodityItems.length
								? commodityItems
								: COMMODITY_ORDER.map((symbol) => ({ symbol }))
						).map((item) => {
							const changePercent = item?.changePercent;
							const isUp = isFiniteNumber(changePercent) ? changePercent >= 0 : null;

							return (
								<div key={item.symbol} className={styles.card}>
									<div className={styles.cardTop}>
										<div>
											<div className={styles.assetName}>{labelForSymbol(item.symbol)}</div>
											<div className={styles.assetSymbol}>{item.symbol}</div>
										</div>

										<div
											className={`${styles.badge} ${
												isUp === null ? styles.badgeNeutral : isUp ? styles.badgeUp : styles.badgeDown
											}`}
										>
											{formatPercent(changePercent)}
										</div>
									</div>

									<div className={styles.priceRow}>
										<div className={styles.price}>
											{formatPrice(item.symbol, item?.price, item?.currency)}
										</div>
										<div className={styles.changeLine}>
											<span
												className={`${styles.change} ${
													isUp === null ? styles.neutral : isUp ? styles.up : styles.down
												}`}
											>
												{formatChange(item?.change)}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className={styles.group}>
					<h3 className={styles.subheading}>Crypto</h3>
					{!loading && cryptoItems.length === 0 ? (
						<p className={styles.emptyState}>
							No live crypto data received.
						</p>
					) : null}
					<div className={styles.gridCrypto}>
						{(cryptoItems.length ? cryptoItems : CRYPTO_ORDER.map((symbol) => ({ symbol }))).map(
							(item) => {
								const changePercent = item?.changePercent;
								const isUp = isFiniteNumber(changePercent) ? changePercent >= 0 : null;

								return (
									<div key={item.symbol} className={styles.card}>
										<div className={styles.cardTop}>
											<div>
												<div className={styles.assetName}>{labelForSymbol(item.symbol)}</div>
												<div className={styles.assetSymbol}>{item.symbol}</div>
											</div>

											<div
												className={`${styles.badge} ${
												isUp === null ? styles.badgeNeutral : isUp ? styles.badgeUp : styles.badgeDown
												}`}
											>
												{formatPercent(changePercent)}
											</div>
										</div>

										<div className={styles.priceRow}>
											<div className={styles.price}>
												{formatPrice(item.symbol, item?.price, item?.currency)}
											</div>
											<div className={styles.changeLine}>
												<span
													className={`${styles.change} ${
														isUp === null ? styles.neutral : isUp ? styles.up : styles.down
													}`}
												>
													{formatChange(item?.change)}
												</span>
											</div>
										</div>
									</div>
								);
							}
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
