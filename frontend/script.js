const senderList = "savedSenders";
const recipientList = "savedRecipients";


function getSavedList(key) {
    return JSON.parse(
        localStorage.getItem(key) || "[]"
    );
}


function saveToList(key, value) {

    if (!value) return;

    let list = getSavedList(key);

    if (!list.includes(value)) {
        list.push(value);
    }

    localStorage.setItem(
        key,
        JSON.stringify(list)
    );
}


function loadSuggestions(key, elementId) {

    const list =
        document.getElementById(elementId);

    list.innerHTML = "";

    getSavedList(key).forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;

        list.appendChild(option);
    });
}

async function analyzeEmail() {

    const sender = document.getElementById("sender").value;
    const recipient = document.getElementById("recipient").value;
    const subject = document.getElementById("subject").value;
    const body = document.getElementById("emailBody").value;

    if (!sender || !recipient || !subject || !body) {
        alert("Please fill in all fields.");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/emails",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    sender: sender,
                    recipient: recipient,
                    subject: subject,
                    body: body
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Analysis failed"
            );
        }

        displayResult(data);

        saveToList(senderList, sender);
        saveToList(recipientList, recipient);

        loadSuggestions(
            senderList,
            "senderSuggestions"
        );

        loadSuggestions(
            recipientList,
            "recipientSuggestions"
);

    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the backend. " +
            "Make sure the Node.js server is running."
        );
    }
}


function displayResult(data) {

    const analysis = data.finalAnalysis;

    document.getElementById("result")
        .classList.remove("hidden");

    document.getElementById("riskScore")
        .textContent = analysis.riskScore + " / 100";

    document.getElementById("threatType")
        .textContent = analysis.threatType;

    document.getElementById("mlPrediction")
        .textContent =
        analysis.ml.prediction === 1
            ? "Malicious"
            : "Legitimate";

    document.getElementById("mlProbability")
        .textContent =
        (analysis.ml.probability * 100).toFixed(2) + "%";

    document.getElementById("mlScore")
        .textContent =
        analysis.ml.score;

    document.getElementById("forensicScore")
        .textContent =
        analysis.forensic.score;

        document.getElementById("spf")
        .textContent =
        data.headerAnalysis.spf;

    document.getElementById("dkim")
        .textContent =
        data.headerAnalysis.dkim;

    document.getElementById("dmarc")
        .textContent =
        data.headerAnalysis.dmarc;

    document.getElementById("replyTo")
        .textContent =
        data.headerAnalysis.replyTo || "None";

    const evidenceList =
        document.getElementById("evidenceList");

    evidenceList.innerHTML = "";

    analysis.forensic.evidence.forEach(item => {

        const li = document.createElement("li");

        li.textContent =
            item.signal +
            " - " +
            item.result +
            " (+" +
            item.score +
            ")";

        evidenceList.appendChild(li);
    });
}
loadSuggestions(
    senderList,
    "senderSuggestions"
);

loadSuggestions(
    recipientList,
    "recipientSuggestions"
);