const { parse } = require("tldts");

function analyzeURLs(text) {
    const results = {
        urls: [],
        suspiciousURLs: [],
        reasons: []
    };

    const urlPattern = /https?:\/\/[^\s<>"']+/gi;

    const matches = text.match(urlPattern) || [];

    results.urls = [...new Set(matches)];

    results.urls.forEach((url) => {
        try {
            const parsed = parse(url);

            if (!parsed.domain) {
                return;
            }

            const hostname = parsed.hostname || "";

            // Check for IP address used directly as a URL
            if (parsed.isIp) {
                results.suspiciousURLs.push(url);
                results.reasons.push(
                    `URL uses an IP address instead of a domain: ${url}`
                );
            }

            // Check for punycode domains
            if (hostname.includes("xn--")) {
                results.suspiciousURLs.push(url);
                results.reasons.push(
                    `URL contains a punycode domain: ${url}`
                );
            }

            // Check for excessive subdomains
            const subdomainParts = parsed.subdomain
                ? parsed.subdomain.split(".").length
                : 0;

            if (subdomainParts >= 3) {
                results.suspiciousURLs.push(url);
                results.reasons.push(
                    `URL contains an unusually deep subdomain structure: ${url}`
                );
            }

        } catch (error) {
            results.reasons.push(
                `Could not analyze URL: ${url}`
            );
        }
    });

    results.suspiciousURLs = [
        ...new Set(results.suspiciousURLs)
    ];

    return results;
}

module.exports = analyzeURLs;