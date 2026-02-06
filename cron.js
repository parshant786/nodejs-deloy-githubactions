require('dotenv').config();
const cron = require('node-cron');
const { connectDB, closeDB } = require('./db');

console.log('Cron service started...');

// In production, we usually want DB connection for cron jobs
if (require.main === module) {
    connectDB();
}

// Example Job: Runs every minute
// In production, replace this with your actual business logic
const task = cron.schedule('* * * * *', () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Cron job executed successfully.`);

    // Logic goes here...
    // try {
    //   await performCalculations();
    // } catch (error) {
    //   console.error('Job failed:', error);
    // }
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
