import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_SYMBOLS = ["GC=F", "SI=F", "CL=F", "BTC-USD", "ETH-USD"];
const SYMBOL_PATTERN = /^[A-Z0-9=._-]+$/i;

// Prefer TradingView (scanner endpoint) for live quotes. If blocked/unavailable, fall back to
// Yahoo Finance, then Stooq (commodities) and CoinGecko (crypto) to keep the homepage widget populated.

const YAHOO_USDINR_SYMBOL = "USDINR=X";

const COINGECKO_USDT_ID = "tether";

// India-display conversions when currency=inr
// Gold/Silver are USD per troy ounce; Crude is USD per barrel.
const INR_CONVERSION = {
  "GC=F": {
    // 1 troy oz = 31.1034768 g
    multiplier: 10 / 31.1034768,
  },
  "SI=F": {
    multiplier: 1000 / 31.1034768,
  },
  "CL=F": {
    multiplier: 1,
  },
};

const STQ_SYMBOL_MAP = {
  // Fallback mapping when Yahoo is unavailable.
  "GC=F": "gc.f",
  "SI=F": "si.f",
  "CL=F": "cl.f",
};

const COINGECKO_ID_MAP = {
  "BTC-USD": "bitcoin",
  "ETH-USD": "ethereum",
};

// TradingView tickers for the scanner endpoint.
// Note: TradingView doesn't provide a public, documented "API" for raw quote data.
// The scanner endpoint is commonly used but can change/break; we keep robust fallbacks.
const TRADINGVIEW_TICKER_MAP = {
  "GC=F": "COMEX:GC1!",
  "SI=F": "COMEX:SI1!",
  "CL=F": "NYMEX:CL1!",
  "BTC-USD": "BITSTAMP:BTCUSD",
  "ETH-USD": "BITSTAMP:ETHUSD",
};

// USD-only mode: do not apply FX or unit conversions.

function normalizeYahooNumber(value) {
  return asNumber(value);
}

async function fetchUsdToInrFallback() {
  try {
    const url = "https://api.exchangerate.host/latest?base=USD&symbols=INR";
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const json = await response.json().catch(() => null);
    const rate = asNumber(json?.rates?.INR);
    return Number.isFinite(rate) && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

async function fetchUsdtToInr() {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
      COINGECKO_USDT_ID
    )}&vs_currencies=inr`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;
    const json = await response.json().catch(() => null);
    const rate = asNumber(json?.[COINGECKO_USDT_ID]?.inr);
    return Number.isFinite(rate) && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

function convertUsdQuoteToInr(symbol, quote, usdToInr) {
  const cfg = INR_CONVERSION[symbol];
  if (!cfg) return quote;
  const m = cfg.multiplier ?? 1;
  return {
    price: asNumber(quote?.price) * usdToInr * m,
    change: asNumber(quote?.change) * usdToInr * m,
    changePercent: asNumber(quote?.changePercent),
    currency: "INR",
    marketState: quote?.marketState || null,
  };
}

async function fetchYahooQuotes(symbols) {
  const unique = Array.from(new Set((symbols || []).filter(Boolean)));
  if (!unique.length) return new Map();

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(
    unique.join(",")
  )}`;

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      // A basic UA helps with some edge blocks.
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Yahoo request failed: ${response.status} ${String(body || "").slice(0, 200)}`);
  }

  const json = await response.json();
  const rows = json?.quoteResponse?.result;
  const map = new Map();

  if (Array.isArray(rows)) {
    for (const row of rows) {
      const symbol = row?.symbol;
      if (!symbol) continue;
      map.set(symbol, {
        price: normalizeYahooNumber(row?.regularMarketPrice),
        change: normalizeYahooNumber(row?.regularMarketChange),
        changePercent: normalizeYahooNumber(row?.regularMarketChangePercent),
        currency: row?.currency || null,
        marketState: row?.marketState || null,
      });
    }
  }

  return map;
}

function convertYahooCommodity(symbol, quote, options) {
  if (options?.currency === "inr") {
    return convertUsdQuoteToInr(symbol, quote, options.usdToInr || 1);
  }
  return quote;
}

const CACHE_TTL_MS = 12_000;
let cached = null;

function parseSymbolList(value, fallback) {
  if (!value?.trim()) return fallback;

  const symbols = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20)
    .filter((item) => item.length <= 20 && SYMBOL_PATTERN.test(item));

  return symbols.length ? symbols : fallback;
}

function asNumber(value) {
  const num = typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(num) ? num : 0;
}

function parseCsvLine(line) {
  // Stooq uses simple CSV with no quoted fields for this endpoint.
  return String(line || "")
    .trim()
    .split(",")
    .map((cell) => cell.trim());
}

async function fetchStooqQuote(stooqSymbol) {
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(
    stooqSymbol
  )}&f=sd2t2ohlcv&h&e=csv`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Stooq request failed: ${response.status} ${String(body || "").slice(0, 200)}`);
  }

  const text = await response.text();
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return null;

  const headers = parseCsvLine(lines[0]);
  const values = parseCsvLine(lines[1]);
  const record = Object.fromEntries(headers.map((h, idx) => [h, values[idx]]));

  const open = asNumber(record.Open);
  const close = asNumber(record.Close);
  const change = close - open;
  const changePercent = open ? (change / open) * 100 : 0;

  return {
    price: close,
    change,
    changePercent,
    currency: "USD",
    marketState: null,
  };
}

function computeChangeFromPercent(price, pct) {
  const percent = asNumber(pct);
  const ratio = 1 + percent / 100;
  if (!Number.isFinite(ratio) || ratio === 0) return 0;
  const prev = price / ratio;
  return price - prev;
}

async function fetchCoinGecko(ids) {
  const unique = Array.from(new Set((ids || []).filter(Boolean)));
  if (!unique.length) return {};

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
    unique.join(",")
  )}&vs_currencies=usd&include_24hr_change=true`;

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`CoinGecko request failed: ${response.status} ${String(body || "").slice(0, 200)}`);
  }

  return await response.json();
}

async function fetchTradingViewQuotes(symbols) {
  const requested = Array.from(new Set((symbols || []).filter(Boolean)));
  const tickers = requested.map((s) => TRADINGVIEW_TICKER_MAP[s]).filter(Boolean);
  if (!tickers.length) return new Map();

  const url = "https://scanner.tradingview.com/global/scan";
  const payload = {
    symbols: {
      tickers,
    },
    columns: ["close", "change", "change_abs", "currency_code"],
  };

  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Some edge blocks are less aggressive with a browser UA and Referer.
      "User-Agent": "Mozilla/5.0",
      Referer: "https://www.tradingview.com/",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`TradingView request failed: ${response.status} ${String(body || "").slice(0, 200)}`);
  }

  const json = await response.json().catch(() => null);
  const rows = json?.data;
  const mapByTicker = new Map();

  if (Array.isArray(rows)) {
    for (const row of rows) {
      const ticker = row?.s;
      const values = Array.isArray(row?.d) ? row.d : [];
      if (!ticker) continue;

      const price = asNumber(values[0]);
      const changePercent = asNumber(values[1]);
      const changeAbs = asNumber(values[2]);
      const currency = values[3] ? String(values[3]) : null;

      mapByTicker.set(String(ticker), {
        price,
        change: changeAbs || computeChangeFromPercent(price, changePercent),
        changePercent,
        currency,
        marketState: null,
      });
    }
  }

  const result = new Map();
  for (const symbol of requested) {
    const ticker = TRADINGVIEW_TICKER_MAP[symbol];
    if (!ticker) continue;
    if (mapByTicker.has(ticker)) result.set(symbol, mapByTicker.get(ticker));
  }
  return result;
}

function toItem(symbol, data) {
  const forceUsd = symbol === "BTC-USD" || symbol === "ETH-USD";
  return {
    symbol,
    name: symbol,
    price: asNumber(data?.price),
    change: asNumber(data?.change),
    changePercent: asNumber(data?.changePercent),
    currency: forceUsd ? "USD" : data?.currency || null,
    marketState: data?.marketState || null,
  };
}

export async function GET(request) {
  try {
    const now = Date.now();
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    const { searchParams } = new URL(request.url);

    const currency = (searchParams.get("currency") || "inr").toLowerCase();
    const wantInr = currency === "inr";

    // Allow optional symbols but keep it safe/limited.
    const requested = parseSymbolList(searchParams.get("symbols"), DEFAULT_SYMBOLS);

    // 0) Try TradingView first.
    try {
      const tvMap = await fetchTradingViewQuotes(requested);

      const usdToInr = wantInr
        ? (await fetchUsdtToInr()) || (await fetchUsdToInrFallback()) || 1
        : 1;

      const items = requested
        .map((symbol) => {
          const base = tvMap.get(symbol);
          if (!base) return null;

          // Match existing behavior: only commodities are converted to INR when currency=inr.
          const converted = wantInr ? convertUsdQuoteToInr(symbol, base, usdToInr) : base;
          return toItem(symbol, converted);
        })
        .filter(Boolean);

      if (items.length) {
        const data = { lastUpdated: new Date().toISOString(), items };
        cached = { ts: now, data };
        return NextResponse.json(data, {
          headers: {
            "Cache-Control": "no-store",
          },
        });
      }
    } catch {
      // Fall back below.
    }

    // 1) Try Yahoo first (live).
    try {
      const yahooSymbols = wantInr ? [...requested, YAHOO_USDINR_SYMBOL] : requested;
      const yahooMap = await fetchYahooQuotes(yahooSymbols);

      let usdToInr = 1;
      if (wantInr) {
        // User preference: multiply commodity USD quotes by live USDT/INR.
        // If unavailable, fall back to Yahoo USDINR or a generic FX endpoint.
        usdToInr = (await fetchUsdtToInr()) || 0;
        if (!usdToInr) usdToInr = asNumber(yahooMap.get(YAHOO_USDINR_SYMBOL)?.price) || 0;
        if (!usdToInr) usdToInr = (await fetchUsdToInrFallback()) || 1;
      }

      const items = requested
        .map((symbol) => {
          const base = yahooMap.get(symbol);
          if (!base) return null;
          const converted = convertYahooCommodity(symbol, base, { currency: wantInr ? "inr" : "usd", usdToInr });
          return toItem(symbol, converted);
        })
        .filter(Boolean);

      if (items.length) {
        const data = { lastUpdated: new Date().toISOString(), items };
        cached = { ts: now, data };
        return NextResponse.json(data, {
          headers: {
            "Cache-Control": "no-store",
          },
        });
      }
    } catch {
      // Fall back below.
    }

    const commoditySymbols = requested.filter((s) => Boolean(STQ_SYMBOL_MAP[s]));
    const cryptoSymbols = requested.filter((s) => Boolean(COINGECKO_ID_MAP[s]));

    const usdToInrFallback = wantInr
      ? (await fetchUsdtToInr()) || (await fetchUsdToInrFallback()) || 1
      : 1;

    const [commoditySettled, coingeckoSettled] = await Promise.all([
      Promise.allSettled(
        commoditySymbols.map(async (symbol) => {
          const stooqSymbol = STQ_SYMBOL_MAP[symbol];
          const quote = await fetchStooqQuote(stooqSymbol);
          if (!quote) return null;
          return [symbol, quote];
        })
      ),
      fetchCoinGecko(cryptoSymbols.map((s) => COINGECKO_ID_MAP[s])).then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => ({ status: "rejected", reason })
      ),
    ]);

    const map = new Map();

    for (const result of commoditySettled) {
      if (result.status !== "fulfilled") continue;
      const entry = result.value;
      if (!entry) continue;
      const [symbol, quote] = entry;
      const converted = wantInr ? convertUsdQuoteToInr(symbol, quote, usdToInrFallback) : quote;
      map.set(symbol, converted);
    }

    const coingeckoJson = coingeckoSettled.status === "fulfilled" ? coingeckoSettled.value : {};

    for (const symbol of cryptoSymbols) {
      const id = COINGECKO_ID_MAP[symbol];
      const row = coingeckoJson?.[id];
      const price = asNumber(row?.usd);
      const changePercent = asNumber(row?.usd_24h_change);
      map.set(symbol, {
        price,
        change: computeChangeFromPercent(price, changePercent),
        changePercent,
        currency: "USD",
        marketState: null,
      });
    }

    const items = requested.map((symbol) => (map.has(symbol) ? toItem(symbol, map.get(symbol)) : null)).filter(Boolean);
    const data = {
      lastUpdated: new Date().toISOString(),
      items,
    };
    cached = { ts: now, data };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    // Keep homepage widget resilient: prefer last cached values over empty output.
    if (cached?.data) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json(
      {
        lastUpdated: new Date().toISOString(),
        items: [],
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
