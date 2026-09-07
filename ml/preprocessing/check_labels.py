import pandas as pd

df = pd.read_parquet("dataset/test.parquet")

print("===== LABEL 0 EXAMPLES =====")

label_0 = df[df["label"] == 0]

for i, row in label_0.head(3).iterrows():
    print("\nSubject:", row["subject"])
    print("Label:", row["label"])
    print("Text:", str(row["text"])[:500])


print("\n\n===== LABEL 1 EXAMPLES =====")

label_1 = df[df["label"] == 1]

for i, row in label_1.head(3).iterrows():
    print("\nSubject:", row["subject"])
    print("Label:", row["label"])
    print("Text:", str(row["text"])[:500])