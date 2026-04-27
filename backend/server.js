import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import './Config/passport.js';
import authRoutes from './Routes/authRoutes.js';    
import interactionRoutes from './Routes/interactionRoutes.js';
import progressRoutes from './Routes/progressRoutes.js';
import sessionRoutes from './Routes/sessionRoutes.js';
import connectDB from './Config/database.js';    

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/sessions', sessionRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
