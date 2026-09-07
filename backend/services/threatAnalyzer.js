function analyzeEmail(email) {
    let riskScore = 0;
    const reasons = [];

    const suspiciousPatterns = [
        { phrase: "urgent", score: 5 },
        { phrase: "verify", score: 10 },
        { phrase: "verification", score: 10 },
        { phrase: "password", score: 15 },
        { phrase: "click here", score: 15 },
        { phrase: "confirm", score: 10 },
        { phrase: "security alert", score: 10 },
        { phrase: "account suspended", score: 20 }
    ];

    const text = `${email.subject} ${email.body}`.toLowerCase();

    // Check suspicious language
    suspiciousPatterns.forEach((pattern) => {
        if (text.includes(pattern.phrase)) {
            riskScore += pattern.score;

            reasons.push(
                `Suspicious phrase detected: "${pattern.phrase}" (+${pattern.score})`
            );
        }
    });

    // Check From vs Reply-To mismatch
    if (email.headers && email.headers["reply-to"]) {
        const sender = email.sender.toLowerCase();
        const replyTo = email.headers["reply-to"].text
            ? email.headers["reply-to"].text.toLowerCase()
            : email.headers["reply-to"].toLowerCase();

        if (!sender.includes(replyTo)) {
            riskScore += 20;

            reasons.push(
                `From and Reply-To addresses are different (+20)`
            );
        }
    }

    // Maximum score is 100
    riskScore = Math.min(riskScore, 100);

    let threatType;

    if (riskScore >= 70) {
        threatType = "High Risk";
    } else if (riskScore >= 40) {
        threatType = "Suspicious";
    } else {
        threatType = "Low Risk";
    }

    return {
        threatType,
        riskScore,
        reasons
    };
}

module.exports = analyzeEmail;