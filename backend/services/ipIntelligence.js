const { IP2Location } = require("ip2location-nodejs");
const path = require("path");
const classifyIP = require("./ipClassifier");
const fs = require("fs");

const databasePath = path.join(
    __dirname,
    "../database/IP2LOCATION-LITE-DB5.BIN"
);
console.log("Database path:");
console.log(databasePath);

console.log("Database exists:");
console.log(fs.existsSync(databasePath));

const ip2location = new IP2Location();

// Open our local IP database
ip2location.open(databasePath);

async function getIPIntelligence(ip) {

    // Classify IP locally first
    const classification = classifyIP(ip);

    // Invalid IP
    if (!classification.valid) {
        return {
            ip,
            status: "invalid",
            classification
        };
    }

    // Private / special IP
    if (!classification.public) {
        return {
            ip,
            status: "local",
            classification,
            message: "Private or special-use IP. Database lookup skipped."
        };
    }

    try {
        // Look up IP in local IP2Location database
        const result = ip2location.getAll(ip);

        return {
            ip,
            status: "success",
            classification,

            country: result.countryLong || "Unknown",
            countryCode: result.countryShort || "Unknown",
            region: result.region || "Unknown",
            city: result.city || "Unknown",

            latitude: result.latitude || null,
            longitude: result.longitude || null,

            timezone: result.timezone || "Unknown"
        };

    } catch (error) {
        return {
            ip,
            status: "error",
            classification,
            message: error.message
        };
    }
}

module.exports = getIPIntelligence;