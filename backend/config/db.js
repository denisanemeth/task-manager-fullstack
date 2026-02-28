require('dotenv').config();
const mongoose=require('mongoose');
const connectDB = async () => {
    // if no URI is provided, fall back to local for dev but log a warning
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';

    // sanitize for logging (hide credentials)
    const safeUri = mongoURI.replace(/:\/\/.*@/, '://<credentials>@');
    console.log('Attempting MongoDB connection to', safeUri);

    try {
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // fail fast if unreachable
            socketTimeoutMS: 5000,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        // don't exit; caller may want to retry or keep process alive
    }
};
module.exports=connectDB;