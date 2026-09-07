import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

import joblib


# 1. Load dataset
df = pd.read_parquet("dataset/test.parquet")

# 2. Handle missing values
df["subject"] = df["subject"].fillna("")
df["text"] = df["text"].fillna("")

# 3. Combine subject and body
df["email_content"] = (
    df["subject"] + " " + df["text"]
)

# 4. Keep required columns
df = df[["email_content", "label"]]

# 5. Remove empty emails
df = df[df["email_content"].str.strip() != ""]

# 6. Remove duplicates
df = df.drop_duplicates(
    subset=["email_content"]
)

# 7. Separate input and label
X = df["email_content"]
y = df["label"]

# 8. Split into training and testing data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 9. Convert text into numerical features
vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    max_features=50000,
    ngram_range=(1, 2)
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# 10. Create the model
model = LogisticRegression(
    max_iter=1000
)

# 11. Train
model.fit(X_train_tfidf, y_train)

# 12. Predict
predictions = model.predict(X_test_tfidf)

# 13. Evaluate
accuracy = accuracy_score(
    y_test,
    predictions
)

print("\nAccuracy:")
print(accuracy)

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

# 14. Save model
joblib.dump(
    model,
    "models/phishing_model.pkl"
)

joblib.dump(
    vectorizer,
    "models/tfidf_vectorizer.pkl"
)

print("\nModel saved successfully.")