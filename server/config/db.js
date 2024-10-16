import connectDB from './config/db.js'; // For default export
import mongoose from 'mongoose';

export const connectDB = async () => { // Named export
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
