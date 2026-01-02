import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_STOCK_SYMBOLS = [
  "RELIANCE.NS",
  "TCS.NS",
  "HDFCBANK.NS",
  "INFY.NS",
  "ICICIBANK.NS",
  "BHARTIARTL.NS",
  "SBIN.NS",
  "WIPRO.NS",
];

const DEFAULT_INDEX_SYMBOLS = ["^NSEI", "^NSEBANK", "^CNXIT"];

const SYMBOL_PATTERN = /^[A-Z0-9^._-]+$/i;

function parseSymbolList(value, fallback) {
  if (!value?.trim()) return fallback;
  const symbols = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 50)
    .filter((item) => item.length <= 20 && SYMBOL_PATTERN.test(item));

  return symbols.length ? symbols : fallback;
}

function formatVolume(volume) {
  if (!Number.isFinite(volume)) return null;
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
  return String(Math.round(volume));
}

const NSE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.nseindia.com/",
};

const YAHOO_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
};

const NSE_INDEX_NAME_BY_SYMBOL = {
  "^NSEI": "NIFTY 50",
  "^NSEBANK": "NIFTY BANK",
  "^CNXIT": "NIFTY IT",
};

function formatNseDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}

function parseNseDate(value) {
  if (!value) return null;
  const asString = String(value);

  // Common NSE format: 02-Jan-2026
  const match = asString.match(/^\s*(\d{1,2})-([A-Za-z]{3})-(\d{4})\s*$/);
  if (match) {
    const day = Number(match[1]);
    const mon = match[2].toLowerCase();
    const year = Number(match[3]);
    const months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    const month = months[mon];
    if (month === undefined) return null;
    const date = new Date(Date.UTC(year, month, day));
    return Number.isFinite(date.getTime()) ? date : null;
  }

  // ISO or other parseable formats
  const parsed = new Date(asString);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function extractSetCookies(response) {
  if (!response?.headers) return [];

  const anyHeaders = response.headers;
  if (typeof anyHeaders.getSetCookie === "function") {
    return anyHeaders.getSetCookie();
  }

  const single = response.headers.get("set-cookie");
  return single ? [single] : [];
}

async function getNseCookieHeader() {
  const response = await fetch("https://www.nseindia.com/", {
    headers: NSE_HEADERS,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`NSE cookie bootstrap failed: ${response.status}`);
  }

  const cookies = extractSetCookies(response)
    .map((cookie) => String(cookie || "").split(";")[0])
    .filter(Boolean);

  return cookies.join("; ");
}

async function fetchNseJson(url, cookieHeader) {
  const response = await fetch(url, {
    headers: {
      ...NSE_HEADERS,
      ...(cookieHeader ? { Cookie: cookieHeader } : null),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `NSE request failed: ${response.status} ${String(body || "").slice(0, 200)}`
    );
  }

  return response.json();
}

async function fetchYahooJson(url) {
  const response = await fetch(url, { headers: YAHOO_HEADERS, cache: "no-store" });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Yahoo request failed: ${response.status} ${String(body || "").slice(0, 200)}`
    );
  }
  return response.json();
}

function asNumber(value) {
  const num = typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(num) ? num : 0;
}

function normalizeNsSymbol(symbol) {
  if (!symbol) return symbol;
  return String(symbol).replace(/\.NS$/i, "");
}

function toYahooEquityItem(ticker, quote) {
  const price = asNumber(quote?.regularMarketPrice);
  const change = asNumber(quote?.regularMarketChange);
  const changePercent = asNumber(quote?.regularMarketChangePercent);
  const volumeRaw = asNumber(quote?.regularMarketVolume);
  const dayHigh = asNumber(quote?.regularMarketDayHigh);
  const dayLow = asNumber(quote?.regularMarketDayLow);

  return {
    symbol: ticker,
    name: quote?.longName || quote?.shortName || quote?.displayName || ticker,
    price,
    change,
    changePercent,
    volume: volumeRaw ? formatVolume(volumeRaw) : null,
    high: dayHigh,
    low: dayLow,
    spark: null,
  };
}

function toYahooIndexItem(symbol, quote) {
  return {
    symbol,
    name: quote?.longName || quote?.shortName || quote?.displayName || symbol,
    price: asNumber(quote?.regularMarketPrice),
    change: asNumber(quote?.regularMarketChange),
    changePercent: asNumber(quote?.regularMarketChangePercent),
  };
}

async function fetchYahooQuotes(tickers) {
  const unique = Array.from(new Set((tickers || []).filter(Boolean)));
  if (!unique.length) return new Map();
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(
    unique.join(",")
  )}`;
  const json = await fetchYahooJson(url);
  const results = Array.isArray(json?.quoteResponse?.result) ? json.quoteResponse.result : [];
  const map = new Map();
  for (const item of results) {
    if (item?.symbol) map.set(String(item.symbol), item);
  }
  return map;
}

function yahooRangeAndInterval(rangeDays) {
  if (rangeDays <= 1) return { range: "1d", interval: "5m" };
  if (rangeDays <= 7) return { range: "5d", interval: "15m" };
  if (rangeDays <= 30) return { range: "1mo", interval: "1d" };
  if (rangeDays <= 90) return { range: "3mo", interval: "1d" };
  if (rangeDays <= 180) return { range: "6mo", interval: "1d" };
  return { range: "1y", interval: "1d" };
}

async function fetchYahooCandles(ticker, rangeDays) {
  const { range, interval } = yahooRangeAndInterval(rangeDays);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    ticker
  )}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`;
  const json = await fetchYahooJson(url);
  const result = Array.isArray(json?.chart?.result) ? json.chart.result[0] : null;
  if (!result) return [];

  const timestamps = Array.isArray(result?.timestamp) ? result.timestamp : [];
  const quote = Array.isArray(result?.indicators?.quote) ? result.indicators.quote[0] : null;
  if (!quote) return [];

  const opens = Array.isArray(quote?.open) ? quote.open : [];
  const highs = Array.isArray(quote?.high) ? quote.high : [];
  const lows = Array.isArray(quote?.low) ? quote.low : [];
  const closes = Array.isArray(quote?.close) ? quote.close : [];
  const volumes = Array.isArray(quote?.volume) ? quote.volume : [];

  const candles = [];
  for (let i = 0; i < timestamps.length; i++) {
    const ts = asNumber(timestamps[i]) * 1000;
    const open = asNumber(opens[i]);
    const high = asNumber(highs[i]);
    const low = asNumber(lows[i]);
    const close = asNumber(closes[i]);
    const volume = asNumber(volumes[i]);
    if (!ts || !(open || high || low || close)) continue;
    candles.push({ timestamp: ts, open, high, low, close, volume });
  }
  candles.sort((a, b) => a.timestamp - b.timestamp);
  return candles;
}

function toChartCandleRows(rawRows) {
  if (!Array.isArray(rawRows)) return [];

  const candles = [];
  for (const row of rawRows) {
    const dateObj = parseNseDate(row?.CH_TIMESTAMP || row?.TIMESTAMP || row?.timestamp || row?.date);
    if (!dateObj) continue;

    const open = asNumber(row?.CH_OPENING_PRICE ?? row?.open);
    const high = asNumber(row?.CH_TRADE_HIGH_PRICE ?? row?.high);
    const low = asNumber(row?.CH_TRADE_LOW_PRICE ?? row?.low);
    const close = asNumber(row?.CH_CLOSING_PRICE ?? row?.close);
    const volume = asNumber(row?.CH_TOT_TRADED_QTY ?? row?.volume);

    // Skip obviously invalid rows.
    if (!(open || high || low || close)) continue;

    candles.push({
      timestamp: dateObj.getTime(),
      open,
      high,
      low,
      close,
      volume,
    });
  }

  candles.sort((a, b) => a.timestamp - b.timestamp);
  return candles;
}

async function fetchNseHistoricalCandles(symbol, cookieHeader, rangeDays) {
  // Expand the requested window to account for weekends/holidays.
  const to = new Date();
  const from = new Date();
  const paddedDays = Math.min(365, Math.max(2, Math.round(rangeDays * 1.6)));
  from.setDate(from.getDate() - paddedDays);

  const fromStr = formatNseDate(from);
  const toStr = formatNseDate(to);
  const url = `https://www.nseindia.com/api/historical/cm/equity?symbol=${encodeURIComponent(
    symbol
  )}&series=%5B%22EQ%22%5D&from=${encodeURIComponent(fromStr)}&to=${encodeURIComponent(toStr)}`;

  const json = await fetchNseJson(url, cookieHeader);
  const rows = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  const candles = toChartCandleRows(rows);

  // Trim back to approx requested days if we have enough points.
  if (!candles.length) return [];
  if (rangeDays <= 1) return candles.slice(-2);
  return candles.slice(-Math.min(candles.length, rangeDays + 5));
}

function extractNseSpark(quoteJson) {
  const series =
    quoteJson?.grapthData ||
    quoteJson?.graphData ||
    quoteJson?.priceInfo?.intraDayChart ||
    null;

  if (!Array.isArray(series)) return null;

  const values = series
    .map((point) => asNumber(point?.value ?? point?.lastPrice ?? point?.price))
    .filter((v) => Number.isFinite(v) && v > 0);

  return values.length >= 2 ? values : null;
}

function toNseEquityItem(requestedSymbol, quoteJson) {
  const symbol = requestedSymbol;
  const info = quoteJson?.info || {};
  const priceInfo = quoteJson?.priceInfo || {};
  const dayHigh =
    asNumber(priceInfo?.intraDayHighLow?.max) ||
    asNumber(priceInfo?.dayHigh) ||
    asNumber(priceInfo?.high) ||
    0;
  const dayLow =
    asNumber(priceInfo?.intraDayHighLow?.min) ||
    asNumber(priceInfo?.dayLow) ||
    asNumber(priceInfo?.low) ||
    0;

  const volumeRaw =
    asNumber(quoteJson?.securityWiseDP?.quantityTraded) ||
    asNumber(quoteJson?.securityWiseDP?.qtyTraded) ||
    asNumber(quoteJson?.marketDeptOrderBook?.tradeInfo?.totalTradedVolume) ||
    asNumber(quoteJson?.marketDeptOrderBook?.tradeInfo?.totalTradedQuantity) ||
    0;

  return {
    symbol: `${symbol}.NS`,
    name: info?.companyName || info?.symbol || symbol,
    price: asNumber(priceInfo?.lastPrice),
    change: asNumber(priceInfo?.change),
    changePercent: asNumber(priceInfo?.pChange),
    volume: volumeRaw ? formatVolume(volumeRaw) : null,
    high: dayHigh,
    low: dayLow,
    spark: extractNseSpark(quoteJson),
  };
}

function toNseIndexItem(symbol, indexItem) {
  return {
    symbol,
    name: NSE_INDEX_NAME_BY_SYMBOL[symbol] || indexItem?.index || indexItem?.name || symbol,
    price: asNumber(indexItem?.last || indexItem?.lastPrice || indexItem?.value),
    change: asNumber(indexItem?.variation || indexItem?.change),
    changePercent: asNumber(indexItem?.percentChange || indexItem?.pChange || indexItem?.changePercent),
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const stockSymbols = parseSymbolList(searchParams.get("symbols"), DEFAULT_STOCK_SYMBOLS);
    const indexSymbols = parseSymbolList(searchParams.get("indices"), DEFAULT_INDEX_SYMBOLS);

    const wantCandles = searchParams.get("candles") === "1" || searchParams.get("candles") === "true";
    const chartSymbols = parseSymbolList(searchParams.get("chartSymbols"), []);
    const rangeDaysRaw = Number(searchParams.get("range") ?? "90");
    const rangeDays = Number.isFinite(rangeDaysRaw) && rangeDaysRaw > 0 ? Math.min(365, rangeDaysRaw) : 90;

    let cookieHeader = "";
    try {
      cookieHeader = await getNseCookieHeader();
    } catch {
      cookieHeader = "";
    }

    const normalizedStocks = stockSymbols.map(normalizeNsSymbol);
    const stocks = (
      await Promise.all(
        normalizedStocks.map(async (symbol) => {
          try {
            const url = `https://www.nseindia.com/api/quote-equity?symbol=${encodeURIComponent(symbol)}`;
            const quoteJson = await fetchNseJson(url, cookieHeader);
            return toNseEquityItem(symbol, quoteJson);
          } catch {
            return null;
          }
        })
      )
    ).filter(Boolean);

    let allIndices = [];
    if (cookieHeader) {
      try {
        const allIndicesJson = await fetchNseJson(
          "https://www.nseindia.com/api/allIndices",
          cookieHeader
        );
        allIndices = Array.isArray(allIndicesJson?.data) ? allIndicesJson.data : [];
      } catch {
        allIndices = [];
      }
    }

    const indices = [];
    for (const indexSymbol of indexSymbols) {
      const indexName = NSE_INDEX_NAME_BY_SYMBOL[indexSymbol];
      const found = indexName
        ? allIndices.find((item) => String(item?.index || "").toUpperCase() === indexName.toUpperCase())
        : null;

      if (found) {
        indices.push(toNseIndexItem(indexSymbol, found));
      }
    }

    // Yahoo fallback for missing stocks/indices.
    const haveStockSymbols = new Set(
      stocks
        .map((s) => normalizeNsSymbol(s?.symbol))
        .filter(Boolean)
        .map((s) => String(s).toUpperCase())
    );
    const missingStocks = normalizedStocks.filter(
      (s) => !haveStockSymbols.has(String(s).toUpperCase())
    );
    if (missingStocks.length) {
      try {
        const quoteMap = await fetchYahooQuotes(missingStocks.map((s) => `${s}.NS`));
        for (const sym of missingStocks) {
          const ticker = `${sym}.NS`;
          const quote = quoteMap.get(ticker);
          if (quote) stocks.push(toYahooEquityItem(ticker, quote));
        }
      } catch {
        // Silent
      }
    }

    const haveIndices = new Set(indices.map((i) => String(i?.symbol || "").toUpperCase()));
    const missingIndices = indexSymbols.filter(
      (s) => !haveIndices.has(String(s).toUpperCase())
    );
    if (missingIndices.length) {
      try {
        const quoteMap = await fetchYahooQuotes(missingIndices);
        for (const sym of missingIndices) {
          const quote = quoteMap.get(sym);
          if (quote) indices.push(toYahooIndexItem(sym, quote));
        }
      } catch {
        // Silent
      }
    }

    const candlesBySymbol = {};
    if (wantCandles) {
      const rawSymbols = chartSymbols.length
        ? chartSymbols
        : normalizedStocks.map((s) => String(s || "").trim()).filter(Boolean);
      const normalizedChartSymbols = Array.from(new Set(rawSymbols.map(normalizeNsSymbol)));

      const results = await Promise.all(
        normalizedChartSymbols.map(async (symbol) => {
          try {
            if (!cookieHeader) throw new Error("missing NSE cookie");
            const candles = await fetchNseHistoricalCandles(symbol, cookieHeader, rangeDays);
            return { symbol, candles };
          } catch {
            return { symbol, candles: [] };
          }
        })
      );

      for (const result of results) {
        if (!result?.symbol) continue;
        candlesBySymbol[result.symbol] = result.candles;
      }

      // Yahoo fallback for any symbols with no candles.
      const missingCandleSymbols = normalizedChartSymbols.filter(
        (sym) => !Array.isArray(candlesBySymbol?.[sym]) || candlesBySymbol[sym].length < 2
      );
      if (missingCandleSymbols.length) {
        await Promise.all(
          missingCandleSymbols.map(async (sym) => {
            try {
              const ticker = `${sym}.NS`;
              const candles = await fetchYahooCandles(ticker, rangeDays);
              if (candles.length >= 2) candlesBySymbol[sym] = candles;
            } catch {
              // Silent
            }
          })
        );
      }
    }

    return NextResponse.json(
      {
        lastUpdated: new Date().toISOString(),
        stocks,
        indices,
        candles: wantCandles ? candlesBySymbol : undefined,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    // Fail silently for the homepage widget: return an empty payload with 200
    // so the client can keep showing the last good data without console noise.
    return NextResponse.json(
      {
        lastUpdated: new Date().toISOString(),
        stocks: [],
        indices: [],
        candles: {},
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
