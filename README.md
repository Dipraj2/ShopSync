# ShopSync

**Multi-Store Product Search Aggregator**

ShopSync is a full-stack web application that unifies product search across multiple independent e-commerce store APIs. A single search query is concurrently dispatched to all connected stores, the heterogeneous JSON responses are normalized into a canonical format, and the merged results are returned to the user sorted by price -- all within sub-second response times.

Built as part of the **CSE 202: Object-Oriented Programming Lab** curriculum.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Architecture](#architecture)
- [Schema Normalization](#schema-normalization)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Design Decisions](#design-decisions)
- [License](#license)

---

## Problem Statement

Consumers routinely visit multiple e-commerce platforms to compare prices before making a purchase. Each platform exposes its own API format, field naming conventions, and rating scales. There is no unified interface that allows a user to search once and receive a consolidated, comparable view of products across all vendors.

ShopSync solves this by acting as a **search aggregator** -- a central service that abstracts away the differences between store APIs and presents a single, normalized result set to the end user.

---

## Architecture

ShopSync follows a **fan-out / fan-in** concurrent aggregation pattern:

```
                          +-------------------+
                          |    React Client   |
                          |   (port 5173)     |
                          +---------+---------+
                                    |
                              GET /search?q=...
                                    |
                          +---------v---------+
                          |    Aggregator     |
                          |  FastAPI (8000)   |
                          +---------+---------+
                                    |
                   +----------------+----------------+
                   |                |                |
            asyncio.gather()  (concurrent)
                   |                |                |
           +-------v------+ +------v-------+ +------v-------+
           |   TechMart   | |  GadgetHub   | | ElectroZone  |
           | FastAPI(8001)| | FastAPI(8002)| | FastAPI(8003)|
           +--------------+ +--------------+ +--------------+
```

**Request lifecycle:**

1. The client submits a search query to the aggregator endpoint.
2. The aggregator constructs concurrent HTTP requests to all registered store APIs using `asyncio.gather()`.
3. Each store returns its product catalogue filtered by the search term.
4. The aggregator normalizes every product into a canonical schema (see below).
5. The unified list is sorted by price (ascending) and returned as a single JSON response.
6. If any store is unreachable or times out (2-second threshold), it is silently excluded -- results from the remaining stores are still returned.

---

## Schema Normalization

Each mock store intentionally uses a different JSON schema to simulate real-world API divergence. The aggregator's `normalize_product()` function maps all variants into a single format.

| Field        | TechMart (8001)   | GadgetHub (8002)  | ElectroZone (8003)   | Canonical Output |
|--------------|-------------------|-------------------|----------------------|------------------|
| Product name | `title`           | `name`            | `item_name`          | `name`           |
| Price        | `price_usd`       | `cost`            | `item_price`         | `price`          |
| Identifier   | `id`              | `product_id`      | `sku`                | `id`             |
| Rating       | `rating` (0-5)    | `stars` (0-5)     | `score` (0-10)       | `rating` (0-5)   |
| Availability | `in_stock` (bool) | `available` (bool) | `qty_available` (int) | `in_stock` (bool) |
| Category     | _(none)_          | `category`        | `tags[]`             | `category`       |

ElectroZone's `score` field uses a 0-10 scale. The normalizer divides by 2 and rounds to one decimal place to produce a consistent 0-5 rating.

---

## Technology Stack

### Backend

| Component       | Technology                | Purpose                                        |
|-----------------|---------------------------|-------------------------------------------------|
| API Framework   | FastAPI                   | High-performance async web framework             |
| HTTP Client     | httpx (AsyncClient)       | Non-blocking concurrent outbound requests        |
| Concurrency     | asyncio.gather()          | Parallel fan-out to all store endpoints          |
| Server          | Uvicorn                   | ASGI server for FastAPI applications             |

### Frontend

| Component       | Technology                | Purpose                                        |
|-----------------|---------------------------|-------------------------------------------------|
| UI Library      | React 19                  | Component-based user interface                   |
| Build Tool      | Vite 8                    | Fast development server with HMR                 |
| Styling         | Tailwind CSS 4            | Utility-first CSS with custom design tokens      |
| Design System   | Custom (Liquid Glass)     | Glassmorphism-based dark theme with animations   |

---

## Project Structure

```
ShopSync/
|-- backend/
|   |-- aggregator.py          # Central aggregator API (port 8000)
|   |-- chaotic_stores.py      # Three mock store APIs (ports 8001-8003)
|   |-- requirements.txt       # Python dependencies
|   `-- .venv/                  # Virtual environment (not tracked)
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- ProductCard.jsx     # Product display card with gradient headers
|   |   |   |-- SearchBar.jsx       # Search input with trending suggestions
|   |   |   |-- StoreBadge.jsx      # Store-specific branded badges
|   |   |   |-- RatingStars.jsx     # Star rating visualization
|   |   |   |-- ResultsMeta.jsx     # Result count and store status
|   |   |   `-- SkeletonGrid.jsx    # Loading state placeholders
|   |   |-- hooks/
|   |   |   `-- useProductSearch.js  # Search state management hook
|   |   |-- utils/
|   |   |   `-- productImages.js     # Category detection and gradient mapping
|   |   |-- App.jsx                  # Main application with landing page sections
|   |   |-- main.jsx                 # Application entry point
|   |   `-- index.css                # Design system and CSS custom properties
|   |-- index.html
|   |-- vite.config.js               # Vite config with API proxy
|   |-- vercel.json                  # Vercel deployment configuration
|   `-- package.json
|-- README.md
`-- spec.md
```

---

## Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js 18 or later
- npm 9 or later

### 1. Clone the Repository

```bash
git clone https://github.com/Dipraj2/ShopSync.git
cd ShopSync
```

### 2. Start the Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start the three mock store APIs (ports 8001, 8002, 8003)
python chaotic_stores.py &

# Start the aggregator API (port 8000)
uvicorn aggregator:app --port 8000
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

### Verify the Setup

```bash
# Health check
curl http://localhost:8000/health

# Test a search query
curl "http://localhost:8000/search?q=laptop"
```

---

## API Reference

### Search Products

```
GET /search?q={query}
```

**Parameters:**

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| `q`       | string | No       | Search term. Empty string returns all.   |

**Response:**

```json
{
  "query": "laptop",
  "total_results": 12,
  "sources_responded": ["TechMart", "GadgetHub", "ElectroZone"],
  "stores_queried": ["TechMart", "GadgetHub", "ElectroZone"],
  "results": [
    {
      "id": "TM-003",
      "name": "Budget Laptop 14\" Celeron",
      "price": 349.99,
      "store": "TechMart",
      "rating": 3.9,
      "in_stock": false,
      "category": null,
      "tags": []
    }
  ]
}
```

The `sources_responded` field indicates which stores successfully returned data. Stores that timed out or returned errors are excluded from this list but still appear in `stores_queried`.

### Health Check

```
GET /health
```

Returns `{"status": "ok"}` if the aggregator is running.

---

## Deployment

### Frontend (Vercel)

1. Push the repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `frontend`.
4. Add the environment variable `VITE_API_URL` pointing to the deployed backend URL (e.g., `https://your-api.onrender.com`).
5. Deploy.

The `vercel.json` file in the frontend directory is pre-configured for Vite builds.

### Backend (Render / Railway / Fly.io)

Deploy the `backend/` directory to any Python hosting provider. The start command is:

```bash
uvicorn aggregator:app --host 0.0.0.0 --port 8000
```

Ensure the mock store processes are also running on the same host, or update the `STORES` dictionary in `aggregator.py` to point to their deployed URLs.

---

## Design Decisions

**Why fan-out with asyncio.gather()?**
Sequential querying would multiply latency linearly with the number of stores. Using `asyncio.gather()`, all store requests execute concurrently, so total latency equals the slowest individual store rather than the sum of all stores.

**Why three different schemas?**
Real-world APIs rarely share a common schema. By deliberately varying field names, rating scales, and data types across the three mock stores, the project demonstrates a practical normalization pipeline that would apply to any production aggregator.

**Why a 2-second timeout?**
A 2-second per-store timeout balances responsiveness with reliability. If a store is slow or down, the user still receives results from the remaining stores without waiting indefinitely.

**Why Liquid Glass UI?**
The glassmorphism-based design system provides a modern, visually distinctive interface that differentiates ShopSync from generic CRUD applications. All design tokens are defined as CSS custom properties in `index.css`, making the theme easily customizable.

**Why deterministic product gradients?**
Product card headers use a hash-based gradient selection tied to the product ID. This ensures the same product always renders with the same visual identity across sessions without requiring stored image assets.

---

## License

This project was developed for academic purposes as part of the CSE 202 OOP Lab coursework. All rights reserved by the authors.
