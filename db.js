const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('MONGODB_URI is not defined in the environment variables.');
        process.exit(1);
    }

    try {
        const options = {
            // Production-ready defaults for Mongoose 6+ (autoIndex is usually false in prod)
            autoIndex: process.env.NODE_ENV !== 'main',
        };

        await mongoose.connect(uri, options);

        console.log(`MongoDB Connected: ${mongoose.connection.host} [Mode: ${process.env.NODE_ENV || 'dev'}]`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
});

// Graceful shutdown
const closeDB = async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
};

module.exports = { connectDB, closeDB };
