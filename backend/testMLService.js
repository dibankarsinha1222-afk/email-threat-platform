const { predictEmail } = require("./services/mlService");

async function test() {

    const result = await predictEmail(
        "Urgent Account Verification",
        "Your account has been suspended. Click here to verify your password immediately."
    );

    console.log("ML Result:");
    console.log(result);
}

test();