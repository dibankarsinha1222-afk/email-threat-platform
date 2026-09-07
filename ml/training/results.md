# ML Experiment Results

## Experiment 1 — TF-IDF + Logistic Regression

### Random Train/Test Split

- Dataset: Seven Phishing Email Datasets
- Total emails: 20,304
- Training: 80%
- Testing: 20%
- Features: Subject + Email Body
- Vectorization: TF-IDF
- Model: Logistic Regression

### Results

- Accuracy: 96.996%
- Precision: 97%
- Recall: 97%
- F1-score: 97%

### Confusion Matrix

|                  | Predicted Legitimate | Predicted Malicious |
|------------------|----------------------|---------------------|
| Actual Legitimate | 2108 | 66 |
| Actual Malicious  | 56   | 1831 |

---

## Experiment 2 — Unseen Source Evaluation

### Setup

Enron emails were completely excluded from training.

Training sources:

- TREC-07
- TREC-05
- CEAS-08
- TREC-06
- Assassin
- Ling

Training emails: 17,231

Testing source:

- Enron

Testing emails: 3,073

### Results

- Accuracy: 96.616%
- Precision: 97%
- Recall: 96%
- F1-score: 96%

### Confusion Matrix

|                  | Predicted Legitimate | Predicted Malicious |
|------------------|----------------------|---------------------|
| Actual Legitimate | 1575 | 49 |
| Actual Malicious  | 55   | 1394 |

---

## Next Experiment

Deep Learning model using the same dataset and evaluation methodology.

---

## Experiment 3 — TF-IDF + Neural Network

### Random Train/Test Split

- Features: Subject + Email Body
- Vectorization: TF-IDF
- Neural Network:
  - Dense layer: 128
  - Dense layer: 64
  - Dropout: 0.3
  - Output: 1
- Optimizer: Adam
- Epochs: 10

### Results

- Best Validation Accuracy: 97.17%
- Best Epoch: 4
- Final Validation Accuracy: 96.95%

### Observation

Training loss continued decreasing while validation accuracy stopped improving, indicating possible overfitting after approximately epoch 4.

### Next Experiment

Train the neural network without using Enron during training and evaluate exclusively on Enron.

---

## Experiment 4 — Neural Network on Unseen Enron

### Setup

Enron emails were completely excluded from training.

Training emails: 17,231

Testing emails: 3,073

### Results

- Best Enron Accuracy: 95.74%
- Final Enron Accuracy: 95.41%
- Best Epoch: 2
- Precision: 95%
- Recall: 95%
- F1-score: 95%

### Confusion Matrix

|                  | Predicted Legitimate | Predicted Malicious |
|------------------|----------------------|---------------------|
| Actual Legitimate | 1553 | 71 |
| Actual Malicious  | 70   | 1379 |

### Comparison

TF-IDF + Logistic Regression:
96.62%

Neural Network:
95.41%

### Observation

The neural network performed slightly better in the random-split experiment but generalized worse to the completely unseen Enron source. The simpler Logistic Regression model currently provides better cross-source generalization.