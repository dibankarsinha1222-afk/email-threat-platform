import pandas as pd

file_path = "dataset/test.parquet"

df = pd.read_parquet(file_path)

print("Dataset shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())

print("\nData types:")
print(df.dtypes)

print("\nLabel distribution:")
print(df["label"].value_counts())