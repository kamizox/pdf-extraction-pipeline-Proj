# Pakistan Flood ML Analytics Dashboard

Full-stack analytics platform for Pakistan flood data (2005–2025). Upload five CSV/Excel datasets, run five ML models, and explore results through an interactive React dashboard with a light-green UI.

**Live repo:** [github.com/kamizox/pdf-extraction-pipeline-Proj](https://github.com/kamizox/pdf-extraction-pipeline-Proj)

---

## Features

| Module | Algorithm | Dataset | Objective |
|--------|-----------|---------|-----------|
| 1 | ARIMAX(2,1,2) | Yearly time series (21 rows) | Forecast annual casualties 2026–2030 |
| 2 | XGBoost | District records (2,267 rows) | Multilevel fatality tier classification |
| 3 | NLP analytics | Incident reports (2,267 rows) | Sentiment & report quality (Valid/Incomplete) |
| 4 | CNN (PyTorch) | Damage features (2,267 rows) | 4×3 heatmap grids → damage tier prediction |
| 5 | K-Means (k=3) | Risk zones (2,267 rows) | Unsupervised regional risk clustering |

- **Upload flow:** Five dedicated dataset slots before entering the dashboard  
- **Auto-detect:** Run all models in one request  
- **Charts:** Recharts (line, bar, pie, scatter, heatmap grids)  
- **API docs:** FastAPI Swagger at `/docs`

---

## Project structure

```
flood-ml-project/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── routes/              # upload, analyze
│   ├── ml/                  # ML modules
│   ├── datasets/            # 5 CSV datasets
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # UploadPage, Dashboard
│   │   └── components/      # Charts & selectors
│   └── package.json
└── .github/workflows/ci.yml
```

---

## Prerequisites

- **Python 3.11+** (3.14 works; TensorFlow not required — CNN uses PyTorch)  
- **Node.js 18+** and npm  
- **Git**

---

## Quick start

### 1. Clone the repository

```bash
git clone https://github.com/kamizox/pdf-extraction-pipeline-Proj.git
cd pdf-extraction-pipeline-Proj
```

### 2. Backend (port 8000)

```bash
cd backend
pip install -r requirements.txt
pip install torch
python generate_datasets.py   # only if datasets/ is empty
uvicorn main:app --reload --port 8000
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

### 3. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

### 4. Workflow

1. Upload all **5 datasets** on the landing page (or use bundled CSVs in `backend/datasets/`).  
2. Click **Go to Dashboard**.  
3. Select an algorithm → **Run Analysis**.  
4. Switch tabs: ARIMA, XGBoost, NLP, CNN, KMeans, Plotly overview.

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload CSV/XLSX (`dataset_key`: dataset1–dataset5) |
| `GET` | `/api/dataset/info` | Metadata for all five datasets |
| `POST` | `/api/analyze/timeseries` | ARIMAX forecast |
| `POST` | `/api/analyze/xgboost` | Fatality classification |
| `POST` | `/api/analyze/nlp` | Sentiment & data quality |
| `POST` | `/api/analyze/cnn` | CNN heatmap damage model |
| `POST` | `/api/analyze/clustering` | K-Means risk zones |
| `POST` | `/api/analyze/auto` | Run all five models |

---

## Datasets

| File | Used by |
|------|---------|
| `Dataset1_ARIMA_TimeSeries.csv` | ARIMAX |
| `Dataset2_XGBoost_Classification.csv` | XGBoost |
| `Dataset3_NLP_Sentiment.csv` | NLP |
| `Dataset4_CNN_DamagePrediction.csv` | CNN |
| `Dataset5_KMeans_RiskZones.csv` | K-Means |

Each analyze endpoint loads **only** its dedicated dataset from `backend/datasets/`.

---

## Tech stack

- **Backend:** FastAPI, pandas, scikit-learn, XGBoost, statsmodels, PyTorch  
- **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Axios  
- **CI:** GitHub Actions (backend smoke tests + frontend build)

---

## Notes

- **K-Means:** Silhouette ≈ 0.885 with k=3 on raw scaled features; most districts cluster as low risk, reflecting real flood exposure (extreme years like 2010/2022 are rare high-risk outliers).  
- **CNN:** Rows are reshaped to 4×3 single-channel heatmaps from 12 normalized features.  
- **CORS:** Frontend origins `http://localhost:5173` and `http://localhost:3000` are allowed.

---

## License

Academic / project use. Add a license file if you publish publicly.
