const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const emailRoutes = require("./routes/EmailRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/emails", emailRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Email Threat Detection API is running"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});