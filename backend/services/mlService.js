const axios = require("axios");

async function predictEmail(
    subject,
    body,
    headerFeatures,
    urlFeatures,
    ipFeatures
) {
    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/predict",
            {
                subject: subject || "",
                body: body || "",

                header_features: headerFeatures || {
                    spf_fail: 0,
                    dkim_fail: 0,
                    dmarc_fail: 0,
                    reply_to_mismatch: 0
                },

                url_features: urlFeatures || {
                    ip_based_url: 0,
                    at_symbol_url: 0
                },

                ip_features: ipFeatures || {
                    private_ip_count: 0,
                    relay_count: 0
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "ML Service Error:",
            error.message
        );

        return {
            prediction: null,
            probability: null,
            riskAnalysis: null,
            error: "ML service unavailable"
        };
    }
}

module.exports = {
    predictEmail
}; 