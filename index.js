const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Node.js app running on EC2 🚀 with changes new");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});


const port = process.env.PORT || 8080;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;