const analyzeURLs = require("./services/urlAnalyzer");

const emailText = `
Your account has been suspended.

Click here to verify:
https://example.com/login

Another suspicious link:
http://192.168.1.10/login
`;

const result = analyzeURLs(emailText);

console.log("URLs found:");
console.log(result.urls);

console.log("\nSuspicious URLs:");
console.log(result.suspiciousURLs);

console.log("\nReasons:");
console.log(result.reasons);