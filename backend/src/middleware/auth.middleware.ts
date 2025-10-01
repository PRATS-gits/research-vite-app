/**
 * Authentication Middleware
 * Basic API key authentication
 */

import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/storage.types.js';

/**
 * Simple API key authentication middleware
 * Checks for API key in Authorization header or X-API-Key header
 */
export function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const apiKey = process.env.API_KEY;

  // Skip authentication in development if API_KEY is not set
  if (!apiKey && process.env.NODE_ENV === 'development') {
    next();
    return;
  }

  // Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === apiKey) {
      next();
      return;
    }
  }

  // Check X-API-Key header
  const apiKeyHeader = req.headers['x-api-key'];
  if (apiKeyHeader === apiKey) {
    next();
    return;
  }

  res.status(401).json({
    success: false,
    error: 'Unauthorized',
    message: 'Valid API key required',
    timestamp: new Date()
  } as ApiResponse);
}

/**
 * Admin authentication middleware
 * Requires higher privileges for sensitive operations
 */
export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // For now, use same API key but could be extended with role-based auth
  authenticateRequest(req, res, next);
}
