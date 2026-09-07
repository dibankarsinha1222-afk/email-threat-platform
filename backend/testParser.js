const fs = require("fs");
const parseEmail = require("./services/emailParser");

async function testParser() {
    try {
        const rawEmail = fs.readFileSync(
            "./samples/suspicious.eml",
            "utf-8"
        );

        const email = await parseEmail(rawEmail);

        console.log("Sender:", email.sender);
        console.log("Recipient:", email.recipient);
        console.log("Subject:", email.subject);
        console.log("Message ID:", email.messageId);
        console.log("Date:", email.date);

        console.log("\nHeaders:");
        console.log(email.headers);

    } catch (error) {
        console.log("Error:", error.message);
    }
}

testParser();