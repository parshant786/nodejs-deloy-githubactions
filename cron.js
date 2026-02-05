const cron = require('node-cron');

console.log('Cron service started...');

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
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing cron service');
    task.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing cron service');
    task.stop();
    process.exit(0);
});
