/**
 * Express Server
 * Main entry point for the Research Space Backend API
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import storageRoutes from './routes/storage.routes.js';
import filesRoutes from './routes/files.routes.js';
import foldersRoutes from './routes/folders.routes.js';
import type { ApiResponse } from './types/storage.types.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    timestamp: new Date()
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime()
    },
    timestamp: new Date()
  } as ApiResponse);
});

// API routes
app.use('/api/storage', storageRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/folders', foldersRoutes);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Research Space Backend API',
    data: {
      version: '1.0.0',
      endpoints: {
        health: '/health',
        storage: '/api/storage',
        files: '/api/files',
        folders: '/api/folders'
      }
    },
    timestamp: new Date()
  } as ApiResponse);
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found',
    timestamp: new Date()
  } as ApiResponse);
});

// Global error handler
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'An unexpected error occurred',
    timestamp: new Date()
  } as ApiResponse);
});

// Start server
app.listen(PORT, () => {
  console.log('\n╭──────────────────────────────────────────────╮');
  console.log('│  🚀 Research Space Backend API Started      │');
  console.log('├──────────────────────────────────────────────┤');
  console.log(`│  📍 Server URL: http://localhost:${PORT}       │`);
  console.log(`│  🌍 Environment: ${process.env.NODE_ENV || 'development'}              │`);
  console.log('│  📚 Endpoints:                               │');
  console.log(`│     GET  /health                             │`);
  console.log(`│     GET  /api/storage/status                 │`);
  console.log(`│     POST /api/storage/configure              │`);
  console.log(`│     POST /api/storage/test                   │`);
  console.log(`│     DEL  /api/storage/lock                   │`);
  console.log('╰──────────────────────────────────────────────╯\n');
});

export default app;
