from pathlib import Path

import pandas as pd
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

from ml.preprocessing import clean_dataframe

DATASET_PATH = Path(__file__).resolve().parent.parent / 'datasets' / 'Dataset2_XGBoost_Classification.csv'

FEATURES = [
    'Rainfall_Actual_mm', 'Rainfall_Anomaly_pct', 'Flooded_Area_sqkm',
    'Persons_Affected', 'Total_Houses_Damaged', 'Roads_Damaged_km',
    'Est_Damages_USD_Mn', 'Max_Temp_C', 'Mean_Temp_C',
]
CLASS_LABELS = ['Low', 'Medium', 'High']


def run_xgboost_analysis():
    df = pd.read_csv(DATASET_PATH)
    df = clean_dataframe(df)
    df = df.dropna(subset=['Fatality_Category'])

    X = df[FEATURES]
    y = df['Fatality_Category'].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        random_state=42,
        eval_metric='mlogloss',
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    importances = model.feature_importances_
    feature_importance = [
        {'feature': feat, 'importance': round(float(imp), 4)}
        for feat, imp in sorted(zip(FEATURES, importances), key=lambda x: -x[1])
    ]

    cm = confusion_matrix(y_test, y_pred, labels=[0, 1, 2])
    predictions_sample = [
        {'actual': int(a), 'predicted': int(p)}
        for a, p in zip(y_test.values[:20], y_pred[:20])
    ]

    return {
        'accuracy': round(float(accuracy_score(y_test, y_pred)), 4),
        'f1_score': round(float(f1_score(y_test, y_pred, average='weighted')), 4),
        'feature_importance': feature_importance,
        'confusion_matrix': cm.tolist(),
        'class_labels': CLASS_LABELS,
        'predictions_sample': predictions_sample,
    }
