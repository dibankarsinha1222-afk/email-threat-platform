const { simpleParser } = require("mailparser");

async function parseEmail(rawEmail) {
    try {
        const parsed = await simpleParser(rawEmail);

        return {
            sender: parsed.from?.text || "Unknown",
            recipient: parsed.to?.text || "Unknown",
            subject: parsed.subject || "No Subject",
            body: parsed.text || "",
            headers: Object.fromEntries(parsed.headers),
            messageId: parsed.messageId || "Unknown",
            date: parsed.date || null
        };

    } catch (error) {
        throw new Error(`Email parsing failed: ${error.message}`);
    }
}

module.exports = parseEmail;