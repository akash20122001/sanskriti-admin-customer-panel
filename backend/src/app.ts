import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';
import { seedDatabase } from './controllers/seed.controller';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : true, // Allow all origins in development
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Temporary seed endpoint (remove after initial setup)
app.post('/api/seed', seedDatabase);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: any) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
