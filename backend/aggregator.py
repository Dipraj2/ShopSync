"""Product search aggregator — fans out queries to multiple store APIs concurrently."""

import asyncio
import logging
from typing import Any

import httpx
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("aggregator")

STORE_TIMEOUT_SECONDS = 2.0

STORES: dict[str, str] = {
    "TechMart":    "http://localhost:8001/search",
    "GadgetHub":   "http://localhost:8002/search",
    "ElectroZone": "http://localhost:8003/search",
}

app = FastAPI(
    title="Product Search Aggregator",
    description="Fans out search queries to multiple store APIs, merges and sorts results by price.",
    version="1.0.0",
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET"], allow_headers=["*"])


@app.on_event("startup")
async def startup_event() -> None:
    app.state.http_client = httpx.AsyncClient(timeout=STORE_TIMEOUT_SECONDS)
    logger.info("HTTP client initialised (timeout=%.1fs)", STORE_TIMEOUT_SECONDS)


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await app.state.http_client.aclose()
    logger.info("HTTP client closed")


def normalize_product(raw: dict[str, Any], store_name: str) -> dict[str, Any]:
    """Collapse divergent store schemas into one canonical shape."""
    price_raw = raw.get("price_usd") or raw.get("cost") or raw.get("item_price") or 0.0
    name = raw.get("title") or raw.get("name") or raw.get("item_name") or "Unknown"
    product_id = str(raw.get("id") or raw.get("product_id") or raw.get("sku") or "")

    if "score" in raw:
        rating = round(float(raw["score"]) / 2, 1)
    elif "rating" in raw:
        rating = float(raw["rating"])
    elif "stars" in raw:
        rating = float(raw["stars"])
    else:
        rating = None

    if "in_stock" in raw:
        in_stock = bool(raw["in_stock"])
    elif "available" in raw:
        in_stock = bool(raw["available"])
    elif "qty_available" in raw:
        in_stock = int(raw["qty_available"]) > 0
    else:
        in_stock = True

    return {
        "id":       product_id,
        "name":     name,
        "price":    float(price_raw),
        "store":    store_name,
        "rating":   rating,
        "in_stock": in_stock,
        "category": raw.get("category") or (raw.get("tags", [None])[0] if raw.get("tags") else None),
        "tags":     raw.get("tags", []),
    }


async def fetch_store(
    client: httpx.AsyncClient, store_name: str, store_url: str, query: str,
) -> list[dict[str, Any]]:
    """Fetch products from a single store, returning [] on any failure."""
    try:
        logger.info("→ Querying %s with q=%r", store_name, query)
        response = await client.get(store_url, params={"q": query})
        response.raise_for_status()
        products = response.json()
        if not isinstance(products, list):
            logger.warning("%s returned unexpected type %s – skipping", store_name, type(products).__name__)
            return []
        logger.info("← %s returned %d products", store_name, len(products))
        return products
    except httpx.TimeoutException:
        logger.warning("✗ %s timed out – skipped", store_name)
        return []
    except httpx.ConnectError:
        logger.warning("✗ %s unreachable – skipped", store_name)
        return []
    except httpx.HTTPStatusError as exc:
        logger.warning("✗ %s returned HTTP %d – skipped", store_name, exc.response.status_code)
        return []
    except Exception as exc:
        logger.error("✗ Unexpected error from %s: %s – skipped", store_name, exc)
        return []


@app.get("/search", summary="Search all stores concurrently")
async def search(request: Request, q: str = Query(default="", description="Product search query")) -> JSONResponse:
    client: httpx.AsyncClient = request.app.state.http_client
    fetch_tasks = [fetch_store(client, name, url, q) for name, url in STORES.items()]
    store_results: list[list[dict[str, Any]]] = await asyncio.gather(*fetch_tasks)

    combined: list[dict[str, Any]] = []
    sources: list[str] = []
    for store_name, products in zip(STORES.keys(), store_results):
        if products:
            combined.extend(normalize_product(p, store_name) for p in products)
            sources.append(store_name)

    combined.sort(key=lambda p: p["price"])
    logger.info("Returning %d products from %d/%d stores for q=%r", len(combined), len(sources), len(STORES), q)

    return JSONResponse(content={
        "query": q,
        "total_results": len(combined),
        "sources_responded": sources,
        "stores_queried": list(STORES.keys()),
        "results": combined,
    })


@app.get("/health", summary="Health check", include_in_schema=False)
async def health() -> dict[str, str]:
    return {"status": "ok"}
