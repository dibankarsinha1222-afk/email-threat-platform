const classifyIP = require("./ipClassifier");
const getIPIntelligence = require("./ipIntelligence");

async function analyzeRelayChain(headers) {
    const result = {
        relays: [],
        ipAddresses: [],
        relayCount: 0
    };

    let receivedHeaders = headers.received;

    if (!receivedHeaders) {
        return result;
    }

    if (!Array.isArray(receivedHeaders)) {
        receivedHeaders = [receivedHeaders];
    }

    const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;

    for (let index = 0; index < receivedHeaders.length; index++) {
        const header = receivedHeaders[index];

        const match = header.match(ipPattern);

        const ip = match ? match[0] : "Unknown";

        const ipClassification =
            ip !== "Unknown"
                ? classifyIP(ip)
                : null;

        let ipIntelligence = null;

        if (ipClassification && ipClassification.public) {
            ipIntelligence = await getIPIntelligence(ip);
        }

        const relay = {
            hop: index + 1,
            header: header,
            ip: ip,
            ipClassification: ipClassification,
            ipIntelligence: ipIntelligence
        };

        result.relays.push(relay);

        if (match) {
            result.ipAddresses.push(ip);
        }
    }

    result.ipAddresses = [
        ...new Set(result.ipAddresses)
    ];

    result.relayCount = result.relays.length;

    return result;
}

module.exports = analyzeRelayChain;