function analyzeHeaders(headers) {
    const results = {
        originatingIPs: [],
        spf: "Unknown",
        dkim: "Unknown",
        dmarc: "Unknown",
        replyTo: null
    };

    // Extract IP addresses from Received headers
    const receivedHeaders = headers.received;

    if (receivedHeaders) {
        const receivedText = Array.isArray(receivedHeaders)
            ? receivedHeaders.join(" ")
            : receivedHeaders;

        const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

        const ips = receivedText.match(ipPattern);

        if (ips) {
            results.originatingIPs = [...new Set(ips)];
        }
    }

    // Analyze SPF, DKIM and DMARC
    const authResults = headers["authentication-results"];

    if (authResults) {
        const authText = authResults.toLowerCase();

        if (authText.includes("spf=pass")) {
            results.spf = "Pass";
        } else if (authText.includes("spf=fail")) {
            results.spf = "Fail";
        }

        if (authText.includes("dkim=pass")) {
            results.dkim = "Pass";
        } else if (authText.includes("dkim=fail")) {
            results.dkim = "Fail";
        }

        if (authText.includes("dmarc=pass")) {
            results.dmarc = "Pass";
        } else if (authText.includes("dmarc=fail")) {
            results.dmarc = "Fail";
        }
    }

    // Extract Reply-To address
    if (headers["reply-to"]) {
        if (typeof headers["reply-to"] === "object") {
            results.replyTo = headers["reply-to"].text || null;
        } else {
            results.replyTo = headers["reply-to"];
        }
    }

    return results;
}

module.exports = analyzeHeaders;