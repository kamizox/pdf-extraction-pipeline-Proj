from pathlib import Path

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from torch.utils.data import DataLoader, TensorDataset

from ml.preprocessing import clean_dataframe

torch.manual_seed(42)

DATASET_PATH = Path(__file__).resolve().parent.parent / 'datasets' / 'Dataset4_CNN_DamagePrediction.csv'
LABELS = ['Low Damage', 'Medium Damage', 'Extreme Damage']
GRID_SHAPE = (4, 3)
EPOCHS = 30
BATCH_SIZE = 32


def _feature_columns(df):
    cols = [c for c in df.columns if c.endswith('_normalized')]
    if len(cols) != 12:
        raise ValueError(f'Expected 12 normalized features, found {len(cols)}')
    return cols


def _clean_feature_name(col: str) -> str:
    return col.replace('_normalized', '')


def _rows_to_grids(X_scaled: np.ndarray) -> np.ndarray:
    """(n, 12) -> (n, 1, 4, 3) single-channel heatmaps."""
    n = X_scaled.shape[0]
    grids = X_scaled.reshape(n, 1, GRID_SHAPE[0], GRID_SHAPE[1])
    return grids.astype(np.float32)


def _grid_to_list(grid: np.ndarray) -> list:
    return np.round(grid.reshape(GRID_SHAPE), 4).tolist()


class FloodHeatmapCNN(nn.Module):
    """CNN on 4×3 heatmap grids — mirrors Conv2D(32)→Pool→Conv2D(64)→Dense→Dropout→Softmax."""

    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=2, padding='same'),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=1),
            nn.Conv2d(32, 64, kernel_size=2, padding='same'),
            nn.ReLU(),
        )
        with torch.no_grad():
            dummy = torch.zeros(1, 1, GRID_SHAPE[0], GRID_SHAPE[1])
            flat_dim = self.features(dummy).view(1, -1).shape[1]
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(flat_dim, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 3),
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)


def _train_model(model, train_loader, val_X, val_y, device):
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-3)
    val_X = val_X.to(device)
    val_y = val_y.to(device)

    model.train()
    for _ in range(EPOCHS):
        for batch_x, batch_y in train_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            optimizer.zero_grad()
            loss = criterion(model(batch_x), batch_y)
            loss.backward()
            optimizer.step()

    model.eval()
    with torch.no_grad():
        logits = model(val_X)
    return model


class _CNNPredictor:
    def __init__(self, model, device):
        self.model = model
        self.device = device

    def predict(self, X):
        self.model.eval()
        grids = torch.tensor(_rows_to_grids(X), device=self.device)
        with torch.no_grad():
            logits = self.model(grids)
        return logits.argmax(dim=1).cpu().numpy()


def _compute_feature_importance(model, device, X_test, y_test, feature_cols):
    wrapper = _CNNPredictor(model, device)
    baseline = accuracy_score(y_test, wrapper.predict(X_test))
    rng = np.random.RandomState(42)
    scores = []
    for j in range(len(feature_cols)):
        X_perm = X_test.copy()
        X_perm[:, j] = rng.permutation(X_perm[:, j])
        perm_acc = accuracy_score(y_test, wrapper.predict(X_perm))
        scores.append(max(0.0, baseline - perm_acc))
    return [
        {
            'feature': _clean_feature_name(feat),
            'importance': round(float(imp), 4),
        }
        for feat, imp in sorted(
            zip(feature_cols, scores),
            key=lambda x: -x[1],
        )
    ]


def _sample_grids(df: pd.DataFrame, X_scaled: np.ndarray, feature_cols: list) -> list:
    name_map = {_clean_feature_name(c): c for c in feature_cols}

    rainfall_cols = [
        name_map.get('Rainfall_Actual_mm'),
        name_map.get('Rainfall_Anomaly_pct'),
        name_map.get('Rainfall_Normal_mm'),
    ]
    rainfall_cols = [c for c in rainfall_cols if c]

    flood_col = name_map.get('Flooded_Area_sqkm')
    infra_cols = [
        name_map.get('Total_Houses_Damaged'),
        name_map.get('Roads_Damaged_km'),
        name_map.get('Est_Damages_USD_Mn'),
    ]
    infra_cols = [c for c in infra_cols if c]

    specs = [
        ('Sample 1: Rainfall Intensity', rainfall_cols),
        ('Sample 2: Flooded Area', [flood_col] if flood_col else []),
        ('Sample 3: Infrastructure Grid', infra_cols),
    ]

    samples = []
    for title, cols in specs:
        if not cols:
            idx = 0
        else:
            score = df[cols].fillna(0).sum(axis=1)
            idx = int(score.idxmax())
        row_idx = df.index.get_loc(idx)
        grid = X_scaled[row_idx].reshape(GRID_SHAPE)
        samples.append({'title': title, 'grid': _grid_to_list(grid)})

    return samples


def run_cnn_analysis():
    df = pd.read_csv(DATASET_PATH)
    df = clean_dataframe(df)
    df = df.dropna(subset=['Damage_Level'])

    feature_cols = _feature_columns(df)
    X = df[feature_cols].astype(float)
    y = df['Damage_Level'].astype(int).values

    scaler = MinMaxScaler(feature_range=(0, 1))
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    X_train_g = _rows_to_grids(X_train)
    X_test_g = _rows_to_grids(X_test)

    device = torch.device('cpu')
    model = FloodHeatmapCNN().to(device)

    train_dataset = TensorDataset(
        torch.tensor(X_train_g),
        torch.tensor(y_train, dtype=torch.long),
    )
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)

    val_split = int(0.9 * len(X_train_g))
    val_X = torch.tensor(X_train_g[val_split:])
    val_y = torch.tensor(y_train[val_split:], dtype=torch.long)

    _train_model(model, train_loader, val_X, val_y, device)

    model.eval()
    with torch.no_grad():
        test_tensor = torch.tensor(X_test_g, device=device)
        logits = model(test_tensor)
        y_pred = logits.argmax(dim=1).cpu().numpy()

    cm = confusion_matrix(y_test, y_pred, labels=[0, 1, 2])
    accuracy = round(float(accuracy_score(y_test, y_pred)) * 100, 1)
    f1 = round(float(f1_score(y_test, y_pred, average='weighted')) * 100, 1)

    feature_importance = _compute_feature_importance(
        model, device, X_test, y_test, feature_cols
    )
    sample_grids = _sample_grids(df.reset_index(drop=True), X_scaled, feature_cols)

    return {
        'accuracy': accuracy,
        'f1_score': f1,
        'model_summary': 'CNN — Spatial Heatmap Grid trained on 12 flood features',
        'confusion_matrix': cm.tolist(),
        'labels': LABELS,
        'class_labels': LABELS,
        'sample_grids': sample_grids,
        'feature_importance': feature_importance,
        'feature_importance_proxy': [
            {'feature': f['feature'], 'mean_abs_value': f['importance']}
            for f in feature_importance
        ],
    }
