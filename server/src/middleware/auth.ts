import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    email: string;
  }
}

export const authenticateSession = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
};
