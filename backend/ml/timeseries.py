import warnings
from pathlib import Path

import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

from ml.preprocessing import clean_dataframe

warnings.filterwarnings('ignore')

DATASET_PATH = Path(__file__).resolve().parent.parent / 'datasets' / 'Dataset1_ARIMA_TimeSeries.csv'


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

    series = df.set_index('Year')['Total_Deaths'].astype(float)
    model = ARIMA(series, order=(2, 1, 2))
    fitted = model.fit()
    forecast_steps = 5
    forecast_result = fitted.get_forecast(steps=forecast_steps)
    pred = forecast_result.predicted_mean
    conf = forecast_result.conf_int()

    last_year = int(df['Year'].max())
    forecast = []
    for i in range(forecast_steps):
        year = last_year + i + 1
        forecast.append({
            'year': year,
            'predicted_deaths': round(float(pred.iloc[i]), 2),
            'lower_ci': round(float(conf.iloc[i, 0]), 2),
            'upper_ci': round(float(conf.iloc[i, 1]), 2),
        })

    return {
        'historical': historical,
        'forecast': forecast,
        'model_aic': round(float(fitted.aic), 2),
        'model_summary': 'ARIMA(2,1,2) fitted on 21 yearly records',
    }
