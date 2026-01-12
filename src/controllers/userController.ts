import bcrypt from 'bcrypt';
import { signinToken } from '../middleware/jwt';
import * as users from '../models/userModel';
import { NextFunction, Request, Response } from 'express';
import { loginSchema, signupSchema, updateUserSchema } from '../schemas/user.schema';

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
    const list = await users.getAllUsersModel();
    return res.status(200).json(list)
}

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = signupSchema.parse(req.body);
        if (await users.findUserByEmailModel(data.email)) {
            return res.status(400).json({ error: 'Email already registered' });
        };
        const user = await users.signupUserModel(data);
        return res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }, token: signinToken(user.id, user.role)
        });
    } catch (err) {
        next(err);
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await users.findUserByEmailModel(data.email);
        if (!user || !(await bcrypt.compare(data.password, user.password_hash))) {
            return res.status(400).json({ error: 'Invalid user' });
        }
        return res.json({ token: signinToken(user.id, user.role)})
    } catch (err) {
        next(err);
    }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = updateUserSchema.parse(req.body);
        const updatedUser = await users.updateUserModel(req.user!.id, data);
        return res.json(updatedUser);
    } catch (err) {
        next(err);
    }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await users.deleteUserModel(req.user!.id);
        return res.status(204).end();
    } catch (err) {
        next(err);
    }
}