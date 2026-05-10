# pmodds — Polymarket Live Odds Dashboard

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![CI](https://github.com/ericfledderman/polymarket-dashboard/actions/workflows/ci.yml/badge.svg?branch=main)

---

## Screenshots

<!-- Add screenshot here after deployment -->
![Project Screenshot](https://github.com/ericfledderman/polymarket-dashboard/blob/main/screenshot.png)


---

## Features

- **Live data** from Polymarket’s public Gamma API (no API key required)
- **Auto-refresh** every 60 seconds with manual refresh control
- **Category filtering** across Politics, Crypto, Sports, Tech, Science, and more
- **Full-text search** across market questions
- **Sort options** by volume, liquidity, closing date, or implied certainty
- **Responsive design** with a mobile-first layout (1 / 2 / 3 column grid)
- **Trending strip** highlighting top markets by volume with sparkline-style charts (mock history for now)

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 (theme via CSS custom properties) |
| Data | TanStack Query |
| Charts | Recharts |
| Icons | Lucide React |
| Hosting | Vercel |

---

## Getting Started

```bash
git clone https://github.com/ericfledderman/polymarket-dashboard.git
cd polymarket-odds
npm ci
npm run dev
```

Optional checks:

```bash
npm run lint
npm run build
```

No API keys are required for local development when using the default dev proxy to Polymarket’s Gamma API.

---

## Project Structure

```
src/
├── api.ts                    # Polymarket API client and response normalization
├── types.ts                  # Shared TypeScript types (markets, categories, sort keys)
├── utils.ts                  # Formatting helpers and mock sparkline series generator
├── main.tsx                  # App bootstrap, React Query provider
├── index.css                 # Tailwind entry, CSS variables, global utilities (fonts, shimmer)
├── App.tsx                   # Root layout: query, filters, trending strip, market grid
└── components/
    ├── Header.tsx            # Sticky header with search, live indicator, refresh
    ├── Filters.tsx           # Category pills and sort dropdown
    ├── StatsBar.tsx          # Aggregate volume, liquidity, high-certainty count
    ├── MarketCard.tsx        # Market tile with odds bar and Recharts sparkline
    ├── MarketCardSkeleton.tsx# Shimmer placeholder for loading cards
    └── TrendingSection.tsx   # Top volume markets with larger card treatment
```

---

## Roadmap

- [ ] Price history charts (real API data)
- [ ] Watchlist with persistence
- [ ] Trending markets
- [ ] PWA support

---

## Why I Built This

I am building an automated prediction market trading bot, and this dashboard is the public-facing monitoring surface for that work. It keeps live odds, liquidity, and category-level context in one fast, readable view while the trading stack runs elsewhere.

---

## License

[WTFPL](http://www.wtfpl.net/) — see [LICENSE](LICENSE).
