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


def run_nlp_analysis():
    df = pd.read_csv(DATASET_PATH)
    df = clean_dataframe(df)

    sentiment_distribution = (
        df['Sentiment'].value_counts().to_dict()
    )
    for key in ['Positive', 'Negative', 'Neutral']:
        sentiment_distribution.setdefault(key, 0)

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
        if 'Data_Quality_Label' in df.columns else {}
    )

    return {
        'sentiment_distribution': {k: int(v) for k, v in sentiment_distribution.items()},
        'sentiment_by_province': sentiment_by_province,
        'sentiment_by_year': sentiment_by_year,
        'top_words': top_words,
        'data_quality_distribution': {k: int(v) for k, v in data_quality_distribution.items()},
    }
