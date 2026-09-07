import joblib


# Load trained model
model = joblib.load(
    "models/phishing_model.pkl"
)

# Load TF-IDF vectorizer
vectorizer = joblib.load(
    "models/tfidf_vectorizer.pkl"
)


def predict_email(subject, body):

    # Combine subject and body
    email_content = (
        subject + " " + body
    )

    # Convert email to TF-IDF
    email_vector = vectorizer.transform(
        [email_content]
    )

    # Get probability
    probability = model.predict_proba(
        email_vector
    )[0][1]

    # Prediction
    prediction = (
        1
        if probability >= 0.5
        else 0
    )

    return {
        "prediction": prediction,
        "probability": round(
            float(probability),
            4
        )
    }


# Test
if __name__ == "__main__":

    result = predict_email(
        "Urgent Account Verification",
        "Your account has been suspended. "
        "Click here to verify your password."
    )

    print("ML Prediction:")
    print(result)