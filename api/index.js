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

// Root API endpoint
app.get('/api', (req, res) => {
    res.json({ 
        message: 'SmartNotes API',
        endpoints: {
            health: '/api/health',
            ai: {
                summarize: '/api/ai/summarize',
                explain: '/api/ai/explain',
                quiz: '/api/ai/quiz',
                enhance: '/api/ai/enhance',
                studyTips: '/api/ai/study-tips'
            }
        }
    });
});

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.path,
        method: req.method,
        message: 'The requested API endpoint does not exist. Check /api for available endpoints.'
    });
});

// Vercel serverless function handler
// This is the correct export format for Vercel serverless functions
// The handler receives requests and passes them to Express
export default function handler(req, res) {
    return app(req, res);
}
