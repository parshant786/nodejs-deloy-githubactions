const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Node.js app running on EC2 🚀 wih changes");
});

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server running on port "+port);
});