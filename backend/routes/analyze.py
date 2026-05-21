import traceback
from pathlib import Path

import pandas as pd
from fastapi import APIRouter

from ml import clustering, cnn_damage, nlp_sentiment, timeseries, xgboost_model

router = APIRouter()
DATASETS_DIR = Path(__file__).resolve().parent.parent / 'datasets'

DATASET_FILES = [
    'Dataset1_ARIMA_TimeSeries.csv',
    'Dataset2_XGBoost_Classification.csv',
    'Dataset3_NLP_Sentiment.csv',
    'Dataset4_CNN_DamagePrediction.csv',
    'Dataset5_KMeans_RiskZones.csv',
]


def _error_response(exc: Exception):
    return {'error': str(exc), 'detail': traceback.format_exc()}


@router.get('/dataset/info')
def dataset_info():
    try:
        info = []
        for fname in DATASET_FILES:
            path = DATASETS_DIR / fname
            if not path.exists():
                info.append({'filename': fname, 'error': 'File not found'})
                continue
            df = pd.read_csv(path)
            info.append({
                'filename': fname,
                'rows': len(df),
                'columns': list(df.columns),
            })
        return {'datasets': info}
    except Exception as e:
        return _error_response(e)


@router.post('/analyze/timeseries')
def analyze_timeseries():
    try:
        return timeseries.run_timeseries_analysis()
    except Exception as e:
        return _error_response(e)


@router.post('/analyze/xgboost')
def analyze_xgboost():
    try:
        return xgboost_model.run_xgboost_analysis()
    except Exception as e:
        return _error_response(e)


@router.post('/analyze/nlp')
def analyze_nlp():
    try:
        return nlp_sentiment.run_nlp_analysis()
    except Exception as e:
        return _error_response(e)


@router.post('/analyze/cnn')
def analyze_cnn():
    try:
        return cnn_damage.run_cnn_analysis()
    except Exception as e:
        return _error_response(e)


@router.post('/analyze/clustering')
def analyze_clustering():
    try:
        return clustering.run_clustering_analysis()
    except Exception as e:
        return _error_response(e)


@router.post('/analyze/auto')
def analyze_auto():
    try:
        ts = timeseries.run_timeseries_analysis()
        xgb = xgboost_model.run_xgboost_analysis()
        nlp = nlp_sentiment.run_nlp_analysis()
        cnn = cnn_damage.run_cnn_analysis()
        clust = clustering.run_clustering_analysis()

        return {
            'recommended_algorithm': 'XGBoost Classification',
            'reason': 'Dataset has labeled target column with classification task',
            'timeseries': ts,
            'xgboost': xgb,
            'nlp': nlp,
            'cnn': cnn,
            'clustering': clust,
        }
    except Exception as e:
        return _error_response(e)
