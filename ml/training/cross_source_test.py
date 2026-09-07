import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# =====================================
# 1. Load dataset
# =====================================

df = pd.read_parquet("dataset/test.parquet")

df["subject"] = df["subject"].fillna("")
df["text"] = df["text"].fillna("")

df["email_content"] = (
    df["subject"] + " " + df["text"]
)

df = df[
    ["email_content", "label", "dataset_name"]
]

df = df[
    df["email_content"].str.strip() != ""
]

df = df.drop_duplicates(
    subset=["email_content"]
)


# =====================================
# 2. Separate Enron
# =====================================

train_df = df[
    df["dataset_name"] != "Enron"
]

test_df = df[
    df["dataset_name"] == "Enron"
]

print("Training emails:", len(train_df))
print("Testing emails:", len(test_df))

print("\nTraining sources:")
print(train_df["dataset_name"].value_counts())

print("\nTest source:")
print(test_df["dataset_name"].value_counts())


# =====================================
# 3. Prepare X and y
# =====================================

X_train = train_df["email_content"]
y_train = train_df["label"]

X_test = test_df["email_content"]
y_test = test_df["label"]


# =====================================
# 4. TF-IDF
# =====================================

vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    max_features=50000,
    ngram_range=(1, 2)
)

X_train_tfidf = vectorizer.fit_transform(
    X_train
)

X_test_tfidf = vectorizer.transform(
    X_test
)


# =====================================
# 5. Train model
# =====================================

model = LogisticRegression(
    max_iter=1000
)

model.fit(
    X_train_tfidf,
    y_train
)


# =====================================
# 6. Test on unseen source
# =====================================

predictions = model.predict(
    X_test_tfidf
)


# =====================================
# 7. Evaluate
# =====================================

print("\n==============================")
print("UNSEEN SOURCE EVALUATION")
print("==============================")

print("\nAccuracy:")
print(
    accuracy_score(
        y_test,
        predictions
    )
)

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        predictions
    )
)

print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_test,
        predictions
    )
)