
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars at the top of the file just in case it's imported before server.ts
dotenv.config();

const connectDB = async (retries = 5) => {
    const uri = process.env.MONGODB_URI;

    // Debugging (Masked for security)
    if (!uri) {
        console.error('❌ MONGODB_URI is undefined! Check your .env file or Render Environment Variables.');
    } else {
        const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
        console.log(`📡 Attempting to connect to: ${maskedUri}`);
    }

    try {
        await mongoose.connect(uri as string);
        console.log('✅ MongoDB Connected successfully!');
    } catch (error: any) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);

        if (retries === 0) {
            console.error('💥 Could not connect to MongoDB after multiple retries. Exiting.');
            process.exit(1);
        }

        console.log(`🔄 Retrying connection in 5 seconds... (${retries} attempts left)`);
        setTimeout(() => connectDB(retries - 1), 5000);
    }
};

export { connectDB };
