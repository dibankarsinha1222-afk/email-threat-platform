const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },

    recipient: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    threatType: {
        type: String,
        default: "Unknown"
    },

    riskScore: {
        type: Number,
        default: 0
    },

    mlPrediction: {
    type: Number,
    default: null
},

    mlProbability: {
    type: Number,
    default: null
},

    spf: {
        type: String,
        default: "Unknown"
    },

    dkim: {
        type: String,
        default: "Unknown"
    },

    dmarc: {
        type: String,
        default: "Unknown"
    },

    originatingIP: {
        type: String,
        default: "Unknown"
    },

    analyzedAt: {
        type: Date,
        default: Date.now
    }
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;