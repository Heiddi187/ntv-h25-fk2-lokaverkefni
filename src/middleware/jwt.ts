import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { tokenPayloadSchema } from '../schemas/user.schema';

const JWT_SECRET = process.env.JWT_SECRET!;

export const signinToken = (id: number, role: string) => {
    return jwt.sign({ sub: id, role }, JWT_SECRET, { expiresIn: '4h' });
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid token' });
        }

        const token = auth.slice(7);
        const raw = jwt.verify(token, JWT_SECRET);
        const payload = tokenPayloadSchema.parse(raw);

        req.user = {
            id: payload.sub,
            role: payload.role
        };

        next();
    } catch {
        return res.status(403).json({ error: 'Invalid or expired token' })
    };
};