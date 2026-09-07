const analyzeRelayChain = require("./services/relayAnalyzer");

const headers = {
    received: [
        "from mail1.example.com [203.0.113.25] by relay1.example.com",
        "from relay1.example.com [198.51.100.10] by mail.example.net"
    ]
};

const result = analyzeRelayChain(headers);

console.log("Relay Count:", result.relayCount);

console.log("\nRelay Chain:");
console.log(result.relays);

console.log("\nIP Addresses:");
console.log(result.ipAddresses);