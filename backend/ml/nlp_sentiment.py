import re
from collections import Counter
from pathlib import Path

import pandas as pd

from ml.preprocessing import clean_dataframe

DATASET_PATH = Path(__file__).resolve().parent.parent / 'datasets' / 'Dataset3_NLP_Sentiment.csv'


def _top_words(texts, n=10):
    counter = Counter()
    for text in texts.dropna():
        words = re.findall(r'[a-zA-Z]+', str(text).lower())
        for w in words:
            if len(w) >= 4:
                counter[w] += 1
    return [{'word': w, 'count': c} for w, c in counter.most_common(n)]


def _report_completeness(df):
    if 'Data_Quality_Label' not in df.columns:
        return {
            'valid_reports': 0,
            'incomplete_reports': 0,
            'valid_pct': 0.0,
            'incomplete_pct': 0.0,
        }

    if 'Valid' in df['Data_Quality_Label'].values or 'Incomplete' in df['Data_Quality_Label'].values:
        valid = int((df['Data_Quality_Label'] == 'Valid').sum())
        incomplete = int((df['Data_Quality_Label'] == 'Incomplete').sum())
    else:
        valid = int((df['Data_Quality_Label'] == 'Good').sum())
        incomplete = int(df['Data_Quality_Label'].isin(['Average', 'Poor']).sum())
    total = valid + incomplete or 1
    return {
        'valid_reports': valid,
        'incomplete_reports': incomplete,
        'valid_pct': round(100 * valid / total, 1),
        'incomplete_pct': round(100 * incomplete / total, 1),
    }


def run_nlp_analysis():
    df = pd.read_csv(DATASET_PATH)
    df = clean_dataframe(df)

    sentiment_distribution = df['Sentiment'].value_counts().to_dict()
    for key in ['Positive', 'Negative', 'Neutral']:
        sentiment_distribution.setdefault(key, 0)

    total_sent = sum(sentiment_distribution.values()) or 1
    positive_pct = round(
        100 * sentiment_distribution.get('Positive', 0) / total_sent, 1
    )

    sentiment_by_province = []
    for province, grp in df.groupby('Province'):
        counts = grp['Sentiment'].value_counts()
        sentiment_by_province.append({
            'province': str(province),
            'Positive': int(counts.get('Positive', 0)),
            'Negative': int(counts.get('Negative', 0)),
            'Neutral': int(counts.get('Neutral', 0)),
        })

    sentiment_by_year = []
    for year, grp in df.groupby('Year'):
        counts = grp['Sentiment'].value_counts()
        sentiment_by_year.append({
            'year': int(year),
            'Positive': int(counts.get('Positive', 0)),
            'Negative': int(counts.get('Negative', 0)),
            'Neutral': int(counts.get('Neutral', 0)),
        })
    sentiment_by_year.sort(key=lambda x: x['year'])

    top_words = _top_words(df['Combined_Text'])

    data_quality_distribution = (
        df['Data_Quality_Label'].value_counts().to_dict()
        if 'Data_Quality_Label' in df.columns
        else {}
    )

    completeness = _report_completeness(df)

    return {
        'sentiment_distribution': {k: int(v) for k, v in sentiment_distribution.items()},
        'sentiment_by_province': sentiment_by_province,
        'sentiment_by_year': sentiment_by_year,
        'top_words': top_words,
        'data_quality_distribution': {k: int(v) for k, v in data_quality_distribution.items()},
        'report_completeness': completeness,
        'positive_sentiment_pct': positive_pct,
        'sentiment_note': (
            'Disaster emergency logs are predominantly negative or neutral; '
            f'{positive_pct}% positive sentiment reflects the critical, loss-focused '
            'nature of field reports rather than model bias.'
        ),
    }
