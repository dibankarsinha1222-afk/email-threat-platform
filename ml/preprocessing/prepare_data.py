import pandas as pd

# Load dataset
df = pd.read_parquet("dataset/test.parquet")

# Keep only the columns we need
df = df[["subject", "text", "label"]].copy()

# Replace missing values
df["subject"] = df["subject"].fillna("")
df["text"] = df["text"].fillna("")

# Combine subject and body
df["email_content"] = (
    df["subject"] + " " + df["text"]
)

# Keep only required columns
df = df[["email_content", "label"]]

# Remove empty emails
df = df[df["email_content"].str.strip() != ""]

# Remove duplicate emails
df = df.drop_duplicates(subset=["email_content"])

print("Prepared dataset shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nLabel distribution:")
print(df["label"].value_counts())

print("\nSample:")
print(df.head(3))