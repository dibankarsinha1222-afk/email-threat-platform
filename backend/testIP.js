const getIPIntelligence = require("./services/ipIntelligence");

async function testIP() {
    const result = await getIPIntelligence("8.8.8.8");

    console.log("IP Intelligence:");
    console.log(result);
}

testIP();