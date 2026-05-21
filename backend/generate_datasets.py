"""Generate the 5 Pakistan flood ML datasets with correct shapes and columns."""
import numpy as np
import pandas as pd
from pathlib import Path

np.random.seed(42)
OUT = Path(__file__).parent / 'datasets'
OUT.mkdir(parents=True, exist_ok=True)

PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'GB', 'AJK']
DISTRICTS = {
    'Punjab': ['Lahore', 'Multan', 'Faisalabad', 'Rawalpindi'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
    'KPK': ['Peshawar', 'Swat', 'Mardan', 'Abbottabad'],
    'Balochistan': ['Quetta', 'Gwadar', 'Zhob', 'Lasbela'],
    'GB': ['Gilgit', 'Skardu'],
    'AJK': ['Muzaffarabad', 'Mirpur'],
}


def gen_dataset1():
    years = list(range(2005, 2026))
    n = len(years)
    df = pd.DataFrame({
        'Year': years,
        'Total_Deaths': np.random.randint(50, 500, n),
        'Total_Injured': np.random.randint(200, 5000, n),
        'Persons_Affected': np.random.randint(10000, 500000, n),
        'Total_Incidents': np.random.randint(5, 80, n),
        'Avg_Rainfall_mm': np.random.uniform(100, 400, n).round(1),
        'Avg_Rainfall_Anomaly': np.random.uniform(-30, 50, n).round(1),
        'Total_Houses_Damaged': np.random.randint(1000, 50000, n),
        'Total_Damages_USD_Mn': np.random.uniform(10, 500, n).round(2),
        'Flooded_Area_sqkm': np.random.uniform(500, 8000, n).round(1),
        'Villages_Affected': np.random.randint(20, 500, n),
    })
    df.to_csv(OUT / 'Dataset1_ARIMA_TimeSeries.csv', index=False)
    print(f'Dataset1: {df.shape}')


def _base_rows(n=2267):
    rows = []
    for i in range(n):
        prov = PROVINCES[i % len(PROVINCES)]
        dists = DISTRICTS[prov]
        dist = dists[i % len(dists)]
        year = 2005 + (i % 21)
        rows.append((year, prov, dist))
    return rows


def gen_dataset2():
    base = _base_rows()
    n = len(base)
    rainfall = np.random.uniform(50, 600, n)
    df = pd.DataFrame({
        'Year': [b[0] for b in base],
        'Province': [b[1] for b in base],
        'District': [b[2] for b in base],
        'Rainfall_Actual_mm': rainfall.round(1),
        'Rainfall_Anomaly_pct': np.random.uniform(-40, 80, n).round(1),
        'Flooded_Area_sqkm': np.random.uniform(0, 5000, n).round(1),
        'Persons_Affected': np.random.randint(0, 200000, n),
        'Persons_in_Camps': np.random.randint(0, 50000, n),
        'Medical_Camps': np.random.randint(0, 30, n),
        'Persons_Rescued': np.random.randint(0, 80000, n),
        'Total_Houses_Damaged': np.random.randint(0, 10000, n),
        'Roads_Damaged_km': np.random.uniform(0, 200, n).round(1),
        'Est_Damages_USD_Mn': np.random.uniform(0, 300, n).round(2),
        'Max_Temp_C': np.random.uniform(28, 45, n).round(1),
        'Min_Temp_C': np.random.uniform(10, 28, n).round(1),
        'Mean_Temp_C': np.random.uniform(18, 38, n).round(1),
        'Total_Deaths_Cum': np.random.randint(0, 500, n),
    })
    df['Fatality_Category'] = pd.cut(
        df['Total_Deaths_Cum'], bins=[-1, 50, 150, 1000], labels=[0, 1, 2]
    ).astype(int)
    df['Fatality_Label'] = df['Fatality_Category'].map({0: 'Low', 1: 'Medium', 2: 'High'})
    df.to_csv(OUT / 'Dataset2_XGBoost_Classification.csv', index=False)
    print(f'Dataset2: {df.shape}')


def gen_dataset3():
    base = _base_rows()
    n = len(base)
    sentiments = np.random.choice(['Positive', 'Negative', 'Neutral'], n, p=[0.35, 0.48, 0.17])
    texts = [
        'severe flood damage to villages roads and crops widespread evacuation needed',
        'heavy monsoon rainfall caused river overflow and infrastructure collapse',
        'relief camps established medical support provided to affected families',
    ]
    combined = [texts[i % 3] + f' district {base[i][2]} year {base[i][0]}' for i in range(n)]
    df = pd.DataFrame({
        'Year': [b[0] for b in base],
        'Province': [b[1] for b in base],
        'District': [b[2] for b in base],
        'Cause_of_Death': np.random.choice(['Drowning', 'Building Collapse', 'Disease', 'Unknown'], n),
        'Cause_of_Incident': np.random.choice(['Flash Flood', 'River Overflow', 'Dam Breach', 'Landslide'], n),
        'Remarks': ['Emergency declared'] * n,
        'Key_Impacts': ['Housing agriculture transport'] * n,
        'Lessons_Failures': ['Early warning systems need improvement'] * n,
        'Total_Deaths_Cum': np.random.randint(0, 400, n),
        'Persons_Affected': np.random.randint(0, 150000, n),
        'Est_Damages_USD_Mn': np.random.uniform(0, 250, n).round(2),
        'Combined_Text': combined,
        'Data_Quality_Label': np.random.choice(['Good', 'Average', 'Poor'], n, p=[0.22, 0.44, 0.34]),
        'Sentiment': sentiments,
        'Text_Word_Count': [len(c.split()) for c in combined],
    })
    df.to_csv(OUT / 'Dataset3_NLP_Sentiment.csv', index=False)
    print(f'Dataset3: {df.shape}')


def gen_dataset4():
    base = _base_rows()
    n = len(base)
    raw_cols = {
        'Year': [b[0] for b in base],
        'Province': [b[1] for b in base],
        'District': [b[2] for b in base],
        'Rainfall_Actual_mm': np.random.uniform(50, 600, n).round(1),
        'Rainfall_Anomaly_pct': np.random.uniform(-40, 80, n).round(1),
        'Rainfall_Normal_mm': np.random.uniform(80, 350, n).round(1),
        'Max_Temp_C': np.random.uniform(28, 45, n).round(1),
        'Min_Temp_C': np.random.uniform(10, 28, n).round(1),
        'Mean_Temp_C': np.random.uniform(18, 38, n).round(1),
        'Flooded_Area_sqkm': np.random.uniform(0, 5000, n).round(1),
        'Area_Affected_Acres': np.random.uniform(0, 50000, n).round(1),
        'Persons_Affected': np.random.randint(0, 200000, n),
        'Villages_Affected': np.random.randint(0, 300, n),
        'Total_Houses_Damaged': np.random.randint(0, 12000, n),
        'Houses_Fully_Damaged': np.random.randint(0, 6000, n),
        'Houses_Partially_Damaged': np.random.randint(0, 6000, n),
        'Schools_Total': np.random.randint(0, 50, n),
        'Roads_Damaged_km': np.random.uniform(0, 250, n).round(1),
        'Bridges_Damaged': np.random.randint(0, 20, n),
        'Est_Damages_USD_Mn': np.random.uniform(0, 400, n).round(2),
    }
    df = pd.DataFrame(raw_cols)
    df['Damage_Level'] = pd.cut(
        df['Est_Damages_USD_Mn'], bins=[-1, 50, 150, 500], labels=[0, 1, 2]
    ).astype(int)
    df['Damage_Label'] = df['Damage_Level'].map(
        {0: 'Low Damage', 1: 'Medium Damage', 2: 'High Damage'}
    )

    norm_features = [
        'Rainfall_Actual_mm', 'Rainfall_Anomaly_pct', 'Flooded_Area_sqkm',
        'Persons_Affected', 'Total_Houses_Damaged', 'Houses_Fully_Damaged',
        'Houses_Partially_Damaged', 'Roads_Damaged_km', 'Est_Damages_USD_Mn',
        'Max_Temp_C', 'Min_Temp_C', 'Mean_Temp_C',
    ]
    for col in norm_features:
        mn, mx = df[col].min(), df[col].max()
        df[f'{col}_normalized'] = ((df[col] - mn) / (mx - mn + 1e-9)).round(4)

    df.to_csv(OUT / 'Dataset4_CNN_DamagePrediction.csv', index=False)
    print(f'Dataset4: {df.shape}')


def gen_dataset5():
    base = _base_rows()
    n = len(base)
    df = pd.DataFrame({
        'Year': [b[0] for b in base],
        'Province': [b[1] for b in base],
        'District': [b[2] for b in base],
        'Total_Deaths_Cum': np.random.randint(0, 500, n),
        'Injured_Total_Cum': np.random.randint(0, 3000, n),
        'Total_Houses_Damaged': np.random.randint(0, 15000, n),
        'Cropped_Area_Acres': np.random.uniform(0, 80000, n).round(1),
        'Roads_Damaged_km': np.random.uniform(0, 300, n).round(1),
        'Flooded_Area_sqkm': np.random.uniform(0, 6000, n).round(1),
        'Persons_Affected': np.random.randint(0, 250000, n),
        'Est_Damages_USD_Mn': np.random.uniform(0, 350, n).round(2),
        'Rainfall_Actual_mm': np.random.uniform(50, 650, n).round(1),
        'Rainfall_Anomaly_pct': np.random.uniform(-45, 90, n).round(1),
    })
    df.to_csv(OUT / 'Dataset5_KMeans_RiskZones.csv', index=False)
    print(f'Dataset5: {df.shape}')


if __name__ == '__main__':
    gen_dataset1()
    gen_dataset2()
    gen_dataset3()
    gen_dataset4()
    gen_dataset5()
    print('All datasets written to', OUT)
