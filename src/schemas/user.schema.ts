import { z } from 'zod';

export const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().refine(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: 'Invalid email'
  }),
    password: z.string().min(4)
});

export const loginSchema = z.object({
    email: z.string().refine(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: 'Invalid email'
  }),
    password: z.string().min(4)
});

export const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().refine(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: 'Invalid email'
  }).optional(),
    password: z.string().min(4).optional()
})

export const tokenPayloadSchema = z.object({
    sub: z.number(),
    role: z.enum(['user', 'admin'])
});