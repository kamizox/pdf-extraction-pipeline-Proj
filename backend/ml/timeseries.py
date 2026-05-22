import warnings
from pathlib import Path

import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

from ml.preprocessing import clean_dataframe

warnings.filterwarnings('ignore')

DATASET_PATH = Path(__file__).resolve().parent.parent / 'datasets' / 'Dataset1_ARIMA_TimeSeries.csv'
EXOG_COLS = ['Avg_Rainfall_mm', 'Flooded_Area_sqkm']
FORECAST_YEARS = (2026, 2030)


def run_timeseries_analysis():
    df = pd.read_csv(DATASET_PATH)
    df = clean_dataframe(df)
    df = df.sort_values('Year')

    historical = [
        {
            'year': int(row['Year']),
            'deaths': float(row['Total_Deaths']),
            'persons_affected': float(row['Persons_Affected']),
            'rainfall': float(row['Avg_Rainfall_mm']),
        }
        for _, row in df.iterrows()
    ]

    endog = df['Total_Deaths'].astype(float)
    exog = df[EXOG_COLS].astype(float)

    model = SARIMAX(endog, exog=exog, order=(2, 1, 2))
    fitted = model.fit(disp=False)

    forecast_steps = FORECAST_YEARS[1] - FORECAST_YEARS[0] + 1
    last_exog = exog.tail(3).mean()
    future_exog = pd.DataFrame(
        np.tile(last_exog.values, (forecast_steps, 1)),
        columns=EXOG_COLS,
    )

    forecast_result = fitted.get_forecast(steps=forecast_steps, exog=future_exog)
    pred = forecast_result.predicted_mean
    conf = forecast_result.conf_int()

    forecast = []
    for i, year in enumerate(range(FORECAST_YEARS[0], FORECAST_YEARS[1] + 1)):
        forecast.append({
            'year': year,
            'predicted_deaths': round(float(pred.iloc[i]), 2),
            'lower_ci': round(float(conf.iloc[i, 0]), 2),
            'upper_ci': round(float(conf.iloc[i, 1]), 2),
        })

    return {
        'historical': historical,
        'forecast': forecast,
        'forecast_range': f'{FORECAST_YEARS[0]}–{FORECAST_YEARS[1]}',
        'model_aic': round(float(fitted.aic), 2),
        'model_summary': (
            'ARIMAX(2,1,2) on Total_Deaths with exogenous '
            'Avg_Rainfall_mm and Flooded_Area_sqkm'
        ),
    }
