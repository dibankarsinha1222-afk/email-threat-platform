from flask import Flask, request, jsonify
import joblib
from preprocessing.risk_engine import calculate_risk

app = Flask(__name__)


# Load trained model
model = joblib.load(
    "models/phishing_model.pkl"
)

# Load TF-IDF vectorizer
vectorizer = joblib.load(
    "models/tfidf_vectorizer.pkl"
)


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    subject = data.get("subject", "")
    body = data.get("body", "")

    email_content = subject + " " + body

    # ML prediction
    email_vector = vectorizer.transform([email_content])

    probability = model.predict_proba(
        email_vector
    )[0][1]

    prediction = 1 if probability >= 0.5 else 0

    # Forensic features sent by Node.js
    header_features = data.get(
        "header_features",
        {
            "spf_fail": 0,
            "dkim_fail": 0,
            "dmarc_fail": 0,
            "reply_to_mismatch": 0
        }
    )

    url_features = data.get(
        "url_features",
        {
            "ip_based_url": 0,
            "at_symbol_url": 0
        }
    )

    ip_features = data.get(
        "ip_features",
        {
            "private_ip_count": 0,
            "relay_count": 0
        }
    )

    # Hybrid risk calculation
    risk_analysis = calculate_risk(
        ml_probability=probability,
        header_features=header_features,
        url_features=url_features,
        ip_features=ip_features
    )

    return jsonify({
        "prediction": prediction,
        "probability": round(
            float(probability), 4
        ),
        "riskAnalysis": risk_analysis
    })

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "ML service running"
    })


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=8000,
        debug=False
    )