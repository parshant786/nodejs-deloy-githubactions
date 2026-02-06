require('dotenv').config();
require('apminsight');
const express = require("express");
const { connectDB, closeDB } = require('./db');
const userService = require('./services/userService');

const app = express();

// Middleware
app.use(express.json());

// Database Connection
if (require.main === module) {
    connectDB();
}

app.get("/", (req, res) => {
    res.send("Node.js app running on EC2 🚀 with MongoDB Integration");
});
app.get('/slow', (req, res) => {
    const start = Date.now()
    while (Date.now() - start < 3000) { } // block event loop (bad!)
    res.send('Slow response 🐌')
})
app.get("/health", async (req, res) => {
    const dbStatus = require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: "ok",
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// CRUD Routes for Users
app.post("/users", async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await closeDB();
    process.exit(0);
});


const port = process.env.PORT || 8080;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;