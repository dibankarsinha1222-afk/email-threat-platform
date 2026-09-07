import pandas as pd
import torch
import torch.nn as nn

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report

from torch.utils.data import TensorDataset, DataLoader


# ==========================================
# 1. Load dataset
# ==========================================

df = pd.read_parquet("dataset/test.parquet")

df["subject"] = df["subject"].fillna("")
df["text"] = df["text"].fillna("")

df["email_content"] = (
    df["subject"] + " " + df["text"]
)

df = df[
    ["email_content", "label"]
]

df = df[
    df["email_content"].str.strip() != ""
]

df = df.drop_duplicates(
    subset=["email_content"]
)


# ==========================================
# 2. Prepare data
# ==========================================

X = df["email_content"]
y = df["label"].astype(int)


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ==========================================
# 3. TF-IDF
# ==========================================

vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    max_features=20000,
    ngram_range=(1, 2)
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)


# ==========================================
# 4. Convert to PyTorch tensors
# ==========================================

X_train_tensor = torch.tensor(
    X_train_tfidf.toarray(),
    dtype=torch.float32
)

X_test_tensor = torch.tensor(
    X_test_tfidf.toarray(),
    dtype=torch.float32
)

y_train_tensor = torch.tensor(
    y_train.values,
    dtype=torch.float32
).reshape(-1, 1)

y_test_tensor = torch.tensor(
    y_test.values,
    dtype=torch.float32
).reshape(-1, 1)


# ==========================================
# 5. Create DataLoader
# ==========================================

train_dataset = TensorDataset(
    X_train_tensor,
    y_train_tensor
)

train_loader = DataLoader(
    train_dataset,
    batch_size=64,
    shuffle=True
)


# ==========================================
# 6. Neural Network
# ==========================================

class EmailThreatModel(nn.Module):

    def __init__(self, input_size):

        super().__init__()

        self.network = nn.Sequential(

            nn.Linear(
                input_size,
                128
            ),

            nn.ReLU(),

            nn.Dropout(0.3),

            nn.Linear(
                128,
                64
            ),

            nn.ReLU(),

            nn.Dropout(0.3),

            nn.Linear(
                64,
                1
            )
        )

    def forward(self, x):

        return self.network(x)


input_size = X_train_tensor.shape[1]

model = EmailThreatModel(
    input_size
)


# ==========================================
# 7. Loss and optimizer
# ==========================================

criterion = nn.BCEWithLogitsLoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001
)


# ==========================================
# 8. Training
# ==========================================

epochs = 10

print("\nStarting Deep Learning training...\n")

for epoch in range(epochs):

    model.train()

    total_loss = 0

    for X_batch, y_batch in train_loader:

        optimizer.zero_grad()

        outputs = model(X_batch)

        loss = criterion(
            outputs,
            y_batch
        )

        loss.backward()

        optimizer.step()

        total_loss += loss.item()

    average_loss = (
        total_loss /
        len(train_loader)
    )

    # Validation
    model.eval()

    with torch.no_grad():

        test_outputs = model(
            X_test_tensor
        )

        probabilities = torch.sigmoid(
            test_outputs
        )

        predictions = (
            probabilities >= 0.5
        ).int()

        accuracy = accuracy_score(
            y_test,
            predictions.numpy().flatten()
        )

    print(
        f"Epoch {epoch + 1}/{epochs} "
        f"- Loss: {average_loss:.4f} "
        f"- Validation Accuracy: {accuracy:.4f}"
    )


# ==========================================
# 9. Final evaluation
# ==========================================

model.eval()

with torch.no_grad():

    outputs = model(
        X_test_tensor
    )

    probabilities = torch.sigmoid(
        outputs
    )

    predictions = (
        probabilities >= 0.5
    ).int()


print("\nFinal Classification Report:")

print(
    classification_report(
        y_test,
        predictions.numpy().flatten()
    )
)


# ==========================================
# 10. Save model
# ==========================================

torch.save(
    model.state_dict(),
    "models/deep_learning_model.pth"
)

print(
    "\nDeep Learning model saved successfully."
)