import type { NextFunction, Request, Response } from 'express';
import { Database } from '../database/database.js';

/**
 * Middleware for user authentication.
 *
 * Skips authentication for `POST /user` (user registration).
 * Validates the `Authorization` header and ensures the user exists in the database.
 * Adds `userId` to the `Request` object for downstream handlers on success.
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  // Skip authentication for user registration
  if (req.method === 'POST' && req.path === '/api/user') {
    next();
    return;
  }

  const authHeader = req.headers.authorization;

  // Ensure the request includes an authorization header
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header is missing or invalid.' });
    return;
  }

  // Validate the user exists in the system
  const user = await Database.UserModel.getUser(authHeader);

  // Respond with an error if authentication fails
  if (!user) {
    res.status(401).json({ error: 'Authentication failed.' });
    return;
  }

  res.locals.userId = authHeader;

  next();
};
