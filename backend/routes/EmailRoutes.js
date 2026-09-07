const express = require("express");
const Email = require("../models/Email");
const analyzeRelayChain = require("../services/relayAnalyzer");
const { predictEmail } = require("../services/mlService");

const analyzeEmail = require("../services/threatAnalyzer");
const analyzeHeaders = require("../services/headerAnalyzer");
const analyzeURLs = require("../services/urlAnalyzer");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        // 1. Analyze email content
        const contentAnalysis = analyzeEmail(req.body);

        // 2. Analyze email headers
        let headerAnalysis = {
            originatingIPs: [],
            spf: "Unknown",
            dkim: "Unknown",
            dmarc: "Unknown",
            replyTo: null
        };

        if (req.body.headers) {
            headerAnalysis = analyzeHeaders(req.body.headers);
        }

        let relayAnalysis = {
        relays: [],
        ipAddresses: [],
        relayCount: 0
        };

if (req.body.headers) {
    relayAnalysis = await analyzeRelayChain(req.body.headers);
}

        // 3. Analyze URLs
        const emailText = `${req.body.subject} ${req.body.body}`;

        const urlAnalysis = analyzeURLs(emailText);

      const headerFeatures = {
    spf_fail: headerAnalysis.spf === "Fail" ? 1 : 0,
    dkim_fail: headerAnalysis.dkim === "Fail" ? 1 : 0,
    dmarc_fail: headerAnalysis.dmarc === "Fail" ? 1 : 0,
    reply_to_mismatch:
        headerAnalysis.replyTo &&
        req.body.sender &&
        headerAnalysis.replyTo.toLowerCase() !==
        req.body.sender.toLowerCase()
            ? 1
            : 0
};

const urlFeatures = {
    ip_based_url:
        urlAnalysis.urls.some(url =>
            /^https?:\/\/(?:\d{1,3}\.){3}\d{1,3}/i.test(url)
        )
            ? 1
            : 0,

    at_symbol_url:
        urlAnalysis.urls.some(url =>
            url.includes("@")
        )
            ? 1
            : 0
};

const ipFeatures = {
    private_ip_count: relayAnalysis.ipAddresses.filter(ip => {
        const parts = ip.split(".").map(Number);

        return (
            parts[0] === 10 ||
            (parts[0] === 192 && parts[1] === 168) ||
            (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
        );
    }).length,

    relay_count: relayAnalysis.relayCount
};

const mlResult = await predictEmail(
    req.body.subject || "",
    req.body.body || "",
    headerFeatures,
    urlFeatures,
    ipFeatures
);


       // 4. Get hybrid risk analysis
const riskAnalysis = mlResult.riskAnalysis;

let finalRiskScore = riskAnalysis
    ? riskAnalysis.riskScore
    : contentAnalysis.riskScore;

let finalThreatType = riskAnalysis
    ? riskAnalysis.threatType
    : (
        finalRiskScore >= 70
            ? "High Risk"
            : finalRiskScore >= 40
                ? "Suspicious"
                : "Low Risk"
    );

        // 6. Save result in MongoDB
        const email = new Email({
            ...req.body,

        threatType: finalThreatType,
        riskScore: finalRiskScore,

        mlPrediction: mlResult.prediction,
        mlProbability: mlResult.probability,

        spf: headerAnalysis.spf,
        dkim: headerAnalysis.dkim,
        dmarc: headerAnalysis.dmarc,

        originatingIP:
        headerAnalysis.originatingIPs[0] || "Unknown"
        });

        const savedEmail = await email.save();

        // 7. Send complete analysis to client
        res.status(201).json({
            message: "Email analyzed and saved successfully",

      finalAnalysis: {
    threatType: finalThreatType,
    riskScore: finalRiskScore,

    ml: {
        prediction: mlResult.prediction,
        probability: mlResult.probability,
        score: riskAnalysis
            ? riskAnalysis.mlScore
            : null
    },

    forensic: {
        score: riskAnalysis
            ? riskAnalysis.forensicScore
            : null,
        evidence: riskAnalysis
            ? riskAnalysis.evidence
            : []
    }
},
            contentAnalysis: contentAnalysis,

            headerAnalysis: headerAnalysis,
            relayAnalysis: relayAnalysis,
            urlAnalysis: urlAnalysis,
            email: savedEmail
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to analyze email",
            error: error.message
        });
    }
});

module.exports = router;