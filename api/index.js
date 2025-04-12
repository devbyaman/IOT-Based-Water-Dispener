import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Import cors
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import reportRoutes from "./routes/report.route.js";
import recordRoutes from "./routes/record.route.js";
import otpRoutes from "./routes/otp.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { sanitizeResponse, rateLimiter } from './middleware/security.middleware.js';

const mongodbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/data';
const jwtSecret = process.env.JWT_SECRET || '6f9e76f86d325b506e891130ad7fb84f81a263c44a1d0b3bceb6b28ea53c9334';

if (!jwtSecret) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
}

// Configure time series collection for live data
const timeSeriesOptions = {
    timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
        granularity: 'seconds'
    },
    expireAfterSeconds: 86400 // 24 hours in seconds
};

mongoose.connect(mongodbUri)
    .then(() => {
        console.log("Succeeded to connect to MongoDB 🚀");
        // Create time series collection if it doesn't exist
        mongoose.connection.db.createCollection('liveData', timeSeriesOptions)
            .then(() => console.log('Time series collection created'))
            .catch(err => {
                if (err.code !== 48) { // Ignore collection already exists error
                    console.error('Error creating time series collection:', err);
                }
            });
    })
    .catch((err) => console.log('MongoDB connection error:', err));

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the client build directory
const clientBuildPath = path.join(__dirname, '../client/dist');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Add security middlewares
app.use(sanitizeResponse);
app.use(rateLimiter);

// Add CORS middleware with more secure configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || 'https://iotdevice.apdp.co.in', /\.vercel\.app$/]
        : ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/otp', otpRoutes);

// Serve static files from the client build directory
app.use(express.static(clientBuildPath));

// Serve the index.html file for all other routes (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`Error: ${message}, Status Code: ${statusCode}`);
    console.error(err.stack);
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on PORT http://localhost:${PORT}`);
});
