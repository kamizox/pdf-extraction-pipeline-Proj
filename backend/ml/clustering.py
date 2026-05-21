from pathlib import Path

import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

from ml.preprocessing import clean_dataframe

DATASET_PATH = Path(__file__).resolve().parent.parent / 'datasets' / 'Dataset5_KMeans_RiskZones.csv'

FEATURES = [
    'Rainfall_Actual_mm', 'Flooded_Area_sqkm', 'Total_Deaths_Cum',
    'Persons_Affected', 'Est_Damages_USD_Mn',
]


def run_clustering_analysis():
    df = pd.read_csv(DATASET_PATH)
    df = clean_dataframe(df)

    for col in FEATURES:
        if df[col].isna().all():
            raise ValueError(f'Feature column {col} is all null')

    X = df[FEATURES].fillna(df[FEATURES].median())
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)
    sil = silhouette_score(X_scaled, labels)

    centers_scaled = kmeans.cluster_centers_
    centers_original = scaler.inverse_transform(centers_scaled)

    cluster_centers = []
    for i, center in enumerate(centers_original):
        entry = {'cluster': i}
        for j, feat in enumerate(FEATURES):
            entry[feat] = round(float(center[j]), 2)
        cluster_centers.append(entry)

    cluster_counts = {str(i): int((labels == i).sum()) for i in range(4)}

    meta_cols = ['Province', 'District', 'Year'] + FEATURES
    df_out = df[meta_cols].copy()
    df_out['cluster'] = labels.astype(int)

    data_with_clusters = []
    for _, row in df_out.iterrows():
        data_with_clusters.append({
            'Province': str(row['Province']),
            'District': str(row['District']),
            'Year': int(row['Year']),
            'cluster': int(row['cluster']),
            'Rainfall_Actual_mm': round(float(row['Rainfall_Actual_mm']), 2),
            'Flooded_Area_sqkm': round(float(row['Flooded_Area_sqkm']), 2),
        })

    return {
        'silhouette_score': round(float(sil), 4),
        'cluster_counts': cluster_counts,
        'cluster_centers': cluster_centers,
        'data_with_clusters': data_with_clusters,
    }
