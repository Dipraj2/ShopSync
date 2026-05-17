# 🚀 ShopSync: Multi-Store Product Aggregator

## 🌌 The Mission
Shoppers waste time jumping between different stores. ShopSync breaks the pull of isolated e-commerce platforms. You search once, and our system fans out across the network to bring you a unified, normalized view of products.

## ⚙️ Tech Stack
* **Core Engine:** Python/FastAPI
* **Network Protocol:** Async HTTP requests (httpx + asyncio) for concurrent fanning-out.
* **Frontend:** React 19 + Vite + Tailwind CSS 4 with Liquid Glass UI.

## 🛰️ Architecture
1. **Launch:** The user submits a single search query.
2. **Fan-Out:** The backend concurrently queries 3 independent mock store endpoints.
3. **Normalize:** Divergent JSON schemas are collapsed into a single canonical format.
4. **Aggregate:** The unified, price-sorted data is returned to the user's dashboard.
