import db from '../config/db.js';
import bcrypt from 'bcrypt';
import { returnTicketsIfUserIsDeletedModel } from './ticketModel.js';

export const getAllUsersModel = () => {
    return db.query('SELECT id, name FROM users')
}

export const findUserByEmailModel = (email: string) => {
    return db.oneOrNone('SELECT * FROM users WHERE email=$1', [email]);
};

export type SignupInput = {
    name: string; 
    email: string;
    password: string;
}

export const signupUserModel = async ({ name, email, password}: SignupInput) => {
    const hash = await bcrypt.hash(password, 12);

    return db.oneOrNone(`
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at, role`, 
        [name, email, hash]);
};

export const updateUserModel = async (id: number, data: any) => {
    if (data.password) {
        data.password_hash = await bcrypt.hash(data.password, 12);
    };
    return db.oneOrNone(`
        UPDATE users SET
            name = COALESCE($2, name),
            email = COALESCE($3, email),
            password_hash = COALESCE($4, password_hash),
            updated_at = NOW()
        WHERE id=$1
        RETURNING id, name, email, updated_at, role`, [id, data.name, data.email, data.password_hash]);
};

export const deleteUserModel = (id: number) => {
    return db.tx(async (t) => {
        await returnTicketsIfUserIsDeletedModel(id);
        
        await t.none(`
            UPDATE tickets
            SET user_id = NULL
            WHERE user_id = $1 
            `, [id]
        );
        
        await t.none('DELETE FROM users WHERE id=$1', [id]);
    });
};



// export type LoginInput = {
//     email: string;
//     password: string;
// }

// login - signup

// create user

// get all users

// get user by id

// update user

// delete user by id

// bókunarsaga
// miðar í eigu notanda


// export type UserRole = 'user' | 'admin';

// export interface User {
//   id: number;
//   email: string;
//   password_hash: string;
//   role: UserRole;
//   created_at: Date;
//   updated_at: Date;
// }

// export type UserTokenPayload = {
//   sub: number;
//   role: UserRole;
// };

// export type CreateUser = Pick<User, 'email' | 'password_hash' | 'role'>;

// export const findUserByEmail = async (email: string): Promise<User | null> => {
//   return await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
// };

// export const findUserById = async (id: number): Promise<User | null> => {
//   return await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
// };

// export const createUser = async (user: CreateUser): Promise<User> => {
//   return await db.one(
//     'INSERT INTO USERS (email, password_hash, role) VALUES($1, $2, $3) RETURNING id, email, role, created_at, updated_at',
//     [user.email, user.password_hash, user.role]
//   );
// };