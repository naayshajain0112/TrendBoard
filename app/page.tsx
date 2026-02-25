"use client";

import { useEffect, useState, useMemo } from "react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "markets", label: "Markets" },
  { id: "tech", label: "Technology" },
  { id: "economy", label: "Economy" },
  { id: "crypto", label: "Crypto" },
  { id: "commodities", label: "Commodities" },
  { id: "earnings", label: "Earnings" },
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  markets: ["stock", "market", "s&p", "nasdaq", "dow", "equity", "shares", "wall street", "index", "rally", "sell-off"],
  tech: ["tech", "technology", "ai", "software", "apple", "google", "microsoft", "meta", "amazon", "nvidia", "semiconductor"],
  economy: ["fed", "federal reserve", "inflation", "gdp", "interest rate", "economy", "recession", "jobs", "unemployment", "cpi", "fiscal"],
  crypto: ["bitcoin", "ethereum", "crypto", "blockchain", "btc", "eth", "defi", "token", "nft", "web3"],
  commodities: ["gold", "oil", "silver", "commodity", "crude", "energy", "natural gas", "copper", "wheat"],
  earnings: ["earnings", "revenue", "profit", "loss", "quarterly", "eps", "guidance", "forecast", "beat", "miss"],
};

function categorizeItem(item: any): string[] {
  const text = `${item.headline} ${item.summary}`.toLowerCase();
  const matched: string[] = [];
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) matched.push(cat);
  }
  return matched.length ? matched : ["markets"];
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} style={{ background: "#ffeaa0", borderRadius: "1px" }}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        const tagged = data.slice(0, 18).map((item: any) => ({
          ...item,
          categories: categorizeItem(item),
        }));
        setNews(tagged);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = news;
    if (activeCategory !== "all") {
      result = result.filter((item) => item.categories.includes(activeCategory));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.headline?.toLowerCase().includes(q) ||
          item.summary?.toLowerCase().includes(q) ||
          item.source?.toLowerCase().includes(q)
      );
    }
    return result.slice(0, 6);
  }, [news, activeCategory, search]);

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const isFiltered = activeCategory !== "all" || search.trim() !== "";

  const TICKERS = [
    { sym: "SPY", val: "513.42", chg: "+1.24%" },
    { sym: "QQQ", val: "437.18", chg: "-0.38%" },
    { sym: "AAPL", val: "178.90", chg: "+0.95%" },
    { sym: "MSFT", val: "415.20", chg: "+2.10%" },
    { sym: "TSLA", val: "193.57", chg: "-1.73%" },
    { sym: "NVDA", val: "875.43", chg: "+3.42%" },
    { sym: "BTC", val: "67,234", chg: "+1.88%" },
    { sym: "ETH", val: "3,521", chg: "+0.44%" },
    { sym: "GOLD", val: "2,312", chg: "-0.12%" },
    { sym: "DXY", val: "104.23", chg: "+0.08%" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #0a0a0a;
          --paper: #f5f0e8;
          --paper-dark: #ede8dc;
          --accent: #c8102e;
          --accent-light: #f0d0d5;
          --muted: #6b6560;
          --rule: #c8bfb0;
        }

        body {
          background-color: var(--paper);
          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--ink);
        }

        .trendboard {
          min-height: 100vh;
          background: var(--paper);
          background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.04) 28px);
        }

        /* MASTHEAD */
        .masthead { border-bottom: 3px double var(--ink); padding: 1.5rem 3rem 0; }
        .masthead-top {
          display: flex; justify-content: space-between; align-items: flex-end;
          padding-bottom: 0.5rem; border-bottom: 1px solid var(--rule); margin-bottom: 0.5rem;
        }
        .masthead-meta {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem;
          color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase;
        }
        .live-dot {
          display: inline-block; width: 7px; height: 7px; background: var(--accent);
          border-radius: 50%; margin-right: 6px; animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .masthead-title {
          font-family: 'Playfair Display', serif; font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 900; letter-spacing: -0.03em; line-height: 0.95;
          text-align: center; padding: 0.6rem 0;
        }
        .masthead-title span { color: var(--accent); font-style: italic; }
        .masthead-sub {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
          letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted);
          text-align: center; padding-bottom: 1rem;
        }

        /* TICKER */
        .ticker-wrap {
          background: var(--ink); color: var(--paper); overflow: hidden;
          padding: 0.45rem 0; font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.06em;
        }
        .ticker-inner { display: flex; width: max-content; animation: ticker 28s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }
        .ticker-item { white-space: nowrap; padding: 0 2.5rem; color: #d4cfc7; }
        .ticker-item .up { color: #5dbb7a; }
        .ticker-item .down { color: #e05c5c; }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* CONTROLS */
        .controls-bar {
          max-width: 1280px; margin: 0 auto; padding: 1.5rem 3rem 0;
          display: flex; gap: 1.25rem; align-items: center; flex-wrap: wrap;
        }

        .search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 360px; }
        .search-icon {
          position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
          width: 14px; height: 14px; color: var(--muted); pointer-events: none; transition: color 0.15s;
        }
        .search-wrap:focus-within .search-icon { color: var(--ink); }
        .search-input {
          width: 100%; background: transparent;
          border: 1px solid var(--rule); border-bottom-color: var(--ink);
          outline: none; padding: 0.6rem 2rem 0.6rem 2.4rem;
          font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem;
          letter-spacing: 0.04em; color: var(--ink); caret-color: var(--accent);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-input:focus { border-color: var(--ink); box-shadow: 0 2px 0 0 var(--accent); }
        .search-clear {
          position: absolute; right: 0.7rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--muted);
          font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; padding: 0.1rem 0.3rem;
          transition: color 0.15s; line-height: 1;
        }
        .search-clear:hover { color: var(--accent); }

        .category-filters { display: flex; gap: 0; flex-wrap: wrap; border: 1px solid var(--rule); }
        .cat-btn {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.5rem 0.9rem; background: transparent;
          border: none; border-right: 1px solid var(--rule);
          cursor: pointer; color: var(--muted); transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .cat-btn:last-child { border-right: none; }
        .cat-btn:hover { background: var(--paper-dark); color: var(--ink); }
        .cat-btn.active { background: var(--ink); color: var(--paper); }
        .cat-btn.active:hover { background: #2a2520; }

        /* RESULTS META */
        .results-meta {
          max-width: 1280px; margin: 0 auto; padding: 0.75rem 3rem 0;
          font-family: 'IBM Plex Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted);
          display: flex; align-items: center; gap: 0.75rem;
        }
        .results-meta::after { content: ''; flex: 1; height: 1px; background: var(--rule); }

        /* GRID */
        .content { max-width: 1280px; margin: 0 auto; padding: 1.75rem 3rem 4rem; }

        .news-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr;
          grid-template-rows: auto auto; gap: 0; border: 1px solid var(--ink);
        }
        .news-grid.flat { grid-template-columns: 1fr 1fr 1fr; }

        .card {
          padding: 1.75rem; border-right: 1px solid var(--ink); border-bottom: 1px solid var(--ink);
          position: relative; background: var(--paper); transition: background 0.2s ease;
          cursor: pointer; text-decoration: none; color: inherit; display: block;
        }
        .card:hover { background: var(--paper-dark); }

        /* Default grid borders */
        .news-grid:not(.flat) .card:nth-child(3),
        .news-grid:not(.flat) .card:nth-child(6) { border-right: none; }
        .news-grid:not(.flat) .card:nth-child(4),
        .news-grid:not(.flat) .card:nth-child(5),
        .news-grid:not(.flat) .card:nth-child(6) { border-bottom: none; }

        /* Flat grid borders */
        .news-grid.flat .card:nth-child(3n) { border-right: none; }
        .news-grid.flat .card:nth-child(n+4) { border-bottom: none; }

        .card.feature { grid-column: 1; grid-row: 1 / 3; border-right: 1px solid var(--ink); border-bottom: none; }

        .card-badge {
          display: inline-block; font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--paper); background: var(--accent); padding: 0.2rem 0.55rem; margin-bottom: 0.85rem;
        }
        .card-cat-tag {
          display: inline-block; font-family: 'IBM Plex Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--accent); border: 1px solid var(--accent-light);
          padding: 0.15rem 0.45rem; margin-right: 0.4rem; margin-bottom: 0.7rem;
        }
        .card-meta {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; color: var(--muted);
          letter-spacing: 0.04em; margin-bottom: 0.6rem; display: flex; gap: 0.6rem; align-items: center;
        }
        .card-meta::before { content: ''; display: inline-block; width: 18px; height: 1px; background: var(--rule); }

        .card.feature .headline {
          font-family: 'Playfair Display', serif; font-size: clamp(1.5rem, 2.5vw, 2.1rem);
          font-weight: 700; line-height: 1.2; margin-bottom: 1rem; letter-spacing: -0.02em;
        }
        .card:not(.feature) .headline {
          font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700;
          line-height: 1.3; margin-bottom: 0.65rem; letter-spacing: -0.01em;
        }

        .summary {
          font-size: 0.875rem; color: #3a3530; line-height: 1.65;
          display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
        }
        .card.feature .summary { -webkit-line-clamp: 6; font-size: 0.95rem; }

        .read-link {
          display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1.25rem;
          font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent);
          text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.15s;
        }
        .read-link:hover { border-color: var(--accent); }

        .divider-line { width: 32px; height: 2px; background: var(--accent); margin: 1rem 0; }

        /* EMPTY STATE */
        .empty-state { border: 1px solid var(--rule); padding: 4rem 2rem; text-align: center; }
        .empty-title {
          font-family: 'Playfair Display', serif; font-size: 1.4rem;
          font-style: italic; color: var(--muted); margin-bottom: 0.5rem;
        }
        .empty-sub {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--rule);
        }

        /* LOADING */
        .loading-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; height: 400px; gap: 1.5rem;
        }
        .loading-logo { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; letter-spacing: -0.03em; }
        .loading-bar { width: 200px; height: 1px; background: var(--rule); position: relative; overflow: hidden; }
        .loading-bar::after {
          content: ''; position: absolute; left: -40%; top: 0; width: 40%; height: 100%;
          background: var(--ink); animation: load 1.2s ease-in-out infinite;
        }
        @keyframes load { 0% { left: -40%; } 100% { left: 100%; } }
        .loading-text {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted);
        }

        /* FOOTER */
        .footer { border-top: 3px double var(--ink); padding: 1.5rem 3rem; display: flex; justify-content: space-between; align-items: center; }
        .footer-brand { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1rem; }
        .footer-meta { font-family: 'IBM Plex Mono', monospace; font-size: 0.6rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }

        @media (max-width: 900px) {
          .masthead { padding: 1.25rem 1.5rem 0; }
          .controls-bar { padding: 1.25rem 1.5rem 0; }
          .results-meta { padding: 0.75rem 1.5rem 0; }
          .content { padding: 1.5rem 1.5rem 3rem; }
          .news-grid, .news-grid.flat { grid-template-columns: 1fr 1fr; }
          .card.feature { grid-column: 1 / -1; grid-row: 1; border-right: none; border-bottom: 1px solid var(--ink); }
          .footer { padding: 1.25rem 1.5rem; }
        }
        @media (max-width: 580px) {
          .news-grid, .news-grid.flat { grid-template-columns: 1fr; }
          .card { border-right: none !important; border-bottom: 1px solid var(--ink) !important; }
          .card:last-child { border-bottom: none !important; }
          .category-filters { overflow-x: auto; flex-wrap: nowrap; }
          .search-wrap { max-width: 100%; }
        }
      `}</style>

      <div className="trendboard">
        <header className="masthead">
          <div className="masthead-top">
            <span className="masthead-meta">{dateString}</span>
            <span className="masthead-meta">
              <span className="live-dot" />
              Live Feed — {timeString}
            </span>
            <span className="masthead-meta">Financial Intelligence</span>
          </div>
          <h1 className="masthead-title">Trend<span>Board</span></h1>
          <p className="masthead-sub">Real-time market intelligence & financial analysis</p>
        </header>

        <div className="ticker-wrap" aria-hidden="true">
          <div className="ticker-inner">
            {[...TICKERS, ...TICKERS].map((t, i) => (
              <span key={i} className="ticker-item">
                <strong>{t.sym}</strong>&nbsp;{t.val}&nbsp;
                <span className={t.chg.startsWith("+") ? "up" : "down"}>{t.chg}</span>
                &ensp;·&ensp;
              </span>
            ))}
          </div>
        </div>

        {/* Search + Category Controls */}
        <div className="controls-bar">
          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search headlines, sources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear">✕</button>
            )}
          </div>

          <div className="category-filters" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`cat-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {!loading && (
          <div className="results-meta">
            {filtered.length === 0
              ? "No results"
              : `${filtered.length} stor${filtered.length === 1 ? "y" : "ies"}`}
            {activeCategory !== "all" && ` · ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
            {search.trim() && ` · "${search}"`}
          </div>
        )}

        <main className="content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-logo">TrendBoard</div>
              <div className="loading-bar" />
              <p className="loading-text">Fetching market intelligence…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No stories found</p>
              <p className="empty-sub">Try a different search or category</p>
            </div>
          ) : (
            <div className={`news-grid ${isFiltered ? "flat" : ""}`}>
              {filtered.map((item, i) => {
                const isFeature = i === 0 && !isFiltered;
                return (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`card ${isFeature ? "feature" : ""}`}
                  >
                    <div>
                      {isFeature && <div className="card-badge">Feature Story</div>}
                      {item.categories?.slice(0, 2).map((cat: string) => (
                        <span key={cat} className="card-cat-tag">
                          {CATEGORIES.find(c => c.id === cat)?.label ?? cat}
                        </span>
                      ))}
                    </div>

                    <p className="card-meta">
                      {item.source}&nbsp;·&nbsp;
                      {new Date(item.datetime * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>

                    <h2 className="headline">
                      <HighlightText text={item.headline} query={search} />
                    </h2>

                    {isFeature && <div className="divider-line" />}

                    <p className="summary">
                      <HighlightText text={item.summary} query={search} />
                    </p>

                    <span className="read-link">Continue reading →</span>
                  </a>
                );
              })}
            </div>
          )}
        </main>

        <footer className="footer">
          <div className="footer-brand">TrendBoard</div>
          <div className="footer-meta">{dateString}&nbsp;·&nbsp;All data for informational purposes only</div>
          <div className="footer-meta">© {new Date().getFullYear()}</div>
        </footer>
      </div>
    </>
  );
}