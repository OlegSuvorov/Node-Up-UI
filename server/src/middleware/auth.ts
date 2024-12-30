import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

interface JWTPayload {
    userId: number;
    email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return res.status(401).json({ message: 'Access token not found' })
    }

    try {
        const payload = jwt.verify(
            accessToken,
            process.env.JWT_SECRET || 'your-secret-key'
        ) as JWTPayload
        
        req.user = payload
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
} 
