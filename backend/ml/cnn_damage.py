from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier

from ml.preprocessing import clean_dataframe

DATASET_PATH = Path(__file__).resolve().parent.parent / 'datasets' / 'Dataset4_CNN_DamagePrediction.csv'
CLASS_LABELS = ['Low Damage', 'Medium Damage', 'Extreme Damage']


def run_cnn_analysis():
    df = pd.read_csv(DATASET_PATH)
    df = clean_dataframe(df)
    df = df.dropna(subset=['Damage_Level'])

    feature_cols = [c for c in df.columns if c.endswith('_normalized')]
    if not feature_cols:
        raise ValueError('No normalized feature columns found in Dataset 4')

    X = df[feature_cols]
    y = df['Damage_Level'].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = MLPClassifier(
        hidden_layer_sizes=(64, 32),
        max_iter=200,
        random_state=42,
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    cm = confusion_matrix(y_test, y_pred, labels=[0, 1, 2])

    coefs = np.abs(model.coefs_[0])
    mean_abs = coefs.mean(axis=1)
    feature_importance_proxy = [
        {'feature': feat, 'mean_abs_value': round(float(val), 4)}
        for feat, val in sorted(zip(feature_cols, mean_abs), key=lambda x: -x[1])
    ]

    return {
        'accuracy': round(float(accuracy_score(y_test, y_pred)), 4),
        'f1_score': round(float(f1_score(y_test, y_pred, average='weighted')), 4),
        'confusion_matrix': cm.tolist(),
        'class_labels': CLASS_LABELS,
        'feature_importance_proxy': feature_importance_proxy,
        'training_note': 'MLP Classifier (64→32 dense layers) trained on 12 normalized features',
    }
