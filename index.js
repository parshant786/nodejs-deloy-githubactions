// Triggering deployment with environment-specific APM configuration
require('apminsight');
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Node.js app running on EC2 🚀 with changes today");
});
app.get('/slow', (req, res) => {
  const start = Date.now()
  while (Date.now() - start < 3000) {} // block event loop (bad!)
  res.send('Slow response 🐌')
})
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