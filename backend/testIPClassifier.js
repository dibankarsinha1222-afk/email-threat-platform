const classifyIP = require("./services/ipClassifier");

const testIPs = [
    "8.8.8.8",
    "192.168.1.10",
    "10.0.0.5",
    "172.20.10.4",
    "127.0.0.1",
    "169.254.1.1",
    "0.0.0.0",
    "224.0.0.1",
    "999.999.999.999"
];

testIPs.forEach((ip) => {
    console.log(ip, "→", classifyIP(ip));
});