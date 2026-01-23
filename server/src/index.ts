import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import filesRouter from './routes/files';
import chatRouter from './routes/chat';
import sessionsRouter from './routes/sessions';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads (if needed)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Enterprise NotebookLM API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/files', filesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/sessions', sessionsRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - GET  /api/health`);
  console.log(`  - POST /api/files/upload`);
  console.log(`  - GET  /api/files`);
  console.log(`  - GET  /api/files/:id`);
  console.log(`  - GET  /api/files/:id/content`);
  console.log(`  - DELETE /api/files/:id`);
  console.log(`  - POST /api/chat`);
  console.log(`  - POST /api/chat/export`);
  console.log(`  - POST /api/sessions`);
  console.log(`  - GET  /api/sessions`);
  console.log(`  - GET  /api/sessions/:id`);
});
