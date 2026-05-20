# Week 3 — Retriever Refactor: Git Commit Guide

```
src/
├── constants/
│   └── retriever.constants.js      ← commit 1
├── utils/
│   ├── queryEmbedder.js            ← commit 2
│   ├── vectorSearch.js             ← commit 3
│   ├── resultSorter.js             ← commit 4
│   └── resultFormatter.js          ← commit 5
└── services/
    ├── retrieverPipeline.js        ← commit 6
    └── retriever.js                ← commit 7 (updated)
```

---

## Commit Commands (run in order)

```bash
# Commit 1 — Constants
git add src/constants/retriever.constants.js
git commit -m "feat: add retriever constants (TOP_K, NUM_CANDIDATES, MAX_CHUNK_LENGTH)"

# Commit 2 — Query Embedder
git add src/utils/queryEmbedder.js
git commit -m "feat: add queryEmbedder utility to embed user question"

# Commit 3 — Vector Search
git add src/utils/vectorSearch.js
git commit -m "feat: add vectorSearch utility for MongoDB Atlas $vectorSearch"

# Commit 4 — Result Sorter
git add src/utils/resultSorter.js
git commit -m "feat: add resultSorter utility to rank chunks by score"

# Commit 5 — Result Formatter
git add src/utils/resultFormatter.js
git commit -m "feat: add resultFormatter utility to trim and shape results"

# Commit 6 — Pipeline Orchestrator
git add src/services/retrieverPipeline.js
git commit -m "feat: add retrieverPipeline to orchestrate embed → search → sort → format"

# Commit 7 — Refactored Retriever (thin wrapper)
git add src/services/retriever.js
git commit -m "refactor: simplify retriever.js to delegate to retrieverPipeline"
```

---

## What Each Commit Shows

| # | File | Responsibility |
|---|------|----------------|
| 1 | `retriever.constants.js` | Centralised config — no magic numbers |
| 2 | `queryEmbedder.js` | Single concern: question → vector |
| 3 | `vectorSearch.js` | Single concern: vector → raw DB results |
| 4 | `resultSorter.js` | Single concern: sort by similarity score |
| 5 | `resultFormatter.js` | Single concern: trim text, shape output |
| 6 | `retrieverPipeline.js` | Orchestration only — no business logic |
| 7 | `retriever.js` | Public API unchanged — zero impact on `query.js` |

> `query.js` never needs to change. It still imports `retrieveChunks` from `retriever.js` exactly as before.