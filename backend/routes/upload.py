import os
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

router = APIRouter()

DATASET_MAP = {
    'dataset1': 'Dataset1_ARIMA_TimeSeries',
    'dataset2': 'Dataset2_XGBoost_Classification',
    'dataset3': 'Dataset3_NLP_Sentiment',
    'dataset4': 'Dataset4_CNN_DamagePrediction',
    'dataset5': 'Dataset5_KMeans_RiskZones',
}

DATASETS_DIR = Path(__file__).resolve().parent.parent / 'datasets'


def _serialize_preview(df: pd.DataFrame, n: int = 5):
    preview = df.head(n).fillna('').to_dict(orient='records')
    for row in preview:
        for k, v in row.items():
            if hasattr(v, 'item'):
                row[k] = v.item()
            elif pd.isna(v):
                row[k] = None
    return preview


@router.post('/upload')
async def upload_file(
    file: UploadFile = File(...),
    dataset_key: Optional[str] = Form(None),
):
    try:
        DATASETS_DIR.mkdir(parents=True, exist_ok=True)

        filename = file.filename or 'uploaded.csv'
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ('.csv', '.xlsx', '.xls'):
            raise HTTPException(status_code=400, detail='Only CSV or Excel files allowed')

        if dataset_key and dataset_key in DATASET_MAP:
            save_name = DATASET_MAP[dataset_key] + ext
        else:
            save_name = filename

        save_path = DATASETS_DIR / save_name
        content = await file.read()

        if ext in ('.xlsx', '.xls'):
            temp_path = DATASETS_DIR / f'_temp_upload{ext}'
            temp_path.write_bytes(content)
            df = pd.read_excel(temp_path)
            temp_path.unlink(missing_ok=True)
            if dataset_key and dataset_key in DATASET_MAP:
                csv_name = DATASET_MAP[dataset_key] + '.csv'
                csv_path = DATASETS_DIR / csv_name
                df.to_csv(csv_path, index=False)
                save_name = csv_name
                save_path = csv_path
            else:
                save_path.write_bytes(content)
        else:
            save_path.write_bytes(content)
            df = pd.read_csv(save_path)

        return {
            'filename': save_name,
            'rows': len(df),
            'columns': len(df.columns),
            'column_names': list(df.columns),
            'preview': _serialize_preview(df, 5),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
