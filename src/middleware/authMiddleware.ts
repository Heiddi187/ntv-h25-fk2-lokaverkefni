// import { NextFunction, Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { UserTokenPayload } from '../models/userModel';

// const JWT_SECRET = process.env.JWT_SECRET;

// if (!JWT_SECRET) {
//   throw Error('Missing JWT_SECRET in environment');
// }

// export const authMiddleware = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const authHeader = request.headers['authorization'];
//     const token = authHeader && authHeader.split('Bearer ')[1];
//     if (!token) {
//       response.status(400).json({ error: 'Aðgangur óheimill. Ekkert token fannst.' });
//       return;
//     }

//     const decodedToken = jwt.verify(token, JWT_SECRET) as unknown as UserTokenPayload;

//     request.user = {
//       id: decodedToken.sub,
//       role: decodedToken.role,
//     };

//     next();
//   } catch (error) {
//     if (error instanceof jwt.JsonWebTokenError) {
//       response.status(403).json({ error: 'Aðgangur óheimill: Ógilt token...' });
//       return;
//     }
//     throw error;
//   }
// };