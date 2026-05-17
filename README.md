# ShopSync — Multi-Store Product Aggregator

Unified product search aggregator that fans out queries across multiple independent e-commerce store APIs concurrently, normalizes the results, and displays them in a responsive liquid glass UI sorted by price.

## Project Structure

```
├── frontend/          # React 19 + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vercel.json
│   └── package.json
├── backend/           # FastAPI + httpx + asyncio
│   ├── aggregator.py
│   ├── chaotic_stores.py
│   └── requirements.txt
└── spec.md
```

## Quick Start

### Backend
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python chaotic_stores.py &
uvicorn aggregator:app --port 8000
```

### Frontend
```bash
cd frontend
npm install && npm run dev
```

Open http://localhost:5173

## Tech Stack
- **Frontend:** React 19, Vite 8, Tailwind CSS 4, Liquid Glass UI
- **Backend:** Python, FastAPI, httpx, asyncio
- **Architecture:** Fan-out / fan-in concurrent API aggregation
