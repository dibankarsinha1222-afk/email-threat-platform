import pandas as pd

df = pd.read_parquet("dataset/test.parquet")

print("Dataset sources:")
print(df["dataset_name"].value_counts())

print("\n\nLabels by source:")
print(
    pd.crosstab(
        df["dataset_name"],
        df["label"]
    )
)