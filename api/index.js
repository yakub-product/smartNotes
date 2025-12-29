import express from 'express';
import cors from 'cors';
import aiRoutes from '../routes/ai.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend running as Vercel Serverless Function' });
});

export default app;
