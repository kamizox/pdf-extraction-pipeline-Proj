def clean_dataframe(df):
    df = df.dropna(subset=['Year'])
    for col in df.select_dtypes(include='number').columns:
        df[col] = df[col].fillna(df[col].median())
    df = df.drop_duplicates()
    return df
