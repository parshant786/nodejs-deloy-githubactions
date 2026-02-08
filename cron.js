require('dotenv').config();
const cron = require('node-cron');
const { connectDB, closeDB } = require('./db');

console.log('Cron service started...');

// In production, we usually want DB connection for cron jobs
if (require.main === module) {
    connectDB();
}

const User = require('./models/User');

// Example Job: Runs every minute
// In production, replace this with your actual business logic
const task = cron.schedule('* * * * *', async () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Cron job executed successfully.`);

    try {
        const totalUsers = await User.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });

        console.log(`[${timestamp}] DB Stats -> Total Users: ${totalUsers}, Admins: ${adminCount}`);
    } catch (error) {
        console.error(`[${timestamp}] Job failed logic:`, error.message);
    }
}, {
    scheduled: true,
    timezone: "UTC"
});

// Status checking
console.log('Cron job scheduled: Every minute');

// Graceful shutdown handling
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing cron service');
    task.stop();
    await closeDB();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing cron service');
    task.stop();
    await closeDB();
    process.exit(0);
});
