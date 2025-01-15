import type { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof Error) {
    console.error('Error Message:', err.message);
  } else {
    console.error('Unknown Error:', err);
  }

  res.status(500).json({ error: 'Internal server error.' });
};
