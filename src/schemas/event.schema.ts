import { z } from 'zod';

export const createEventSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    city: z.string().min(2),
    category: z.string().min(2),
    event_time: z.string(),
    event_date: z.string(),
    duration: z.number().min(10),
    venue_id: z.number().int(),
    price: z.number().int().min(0),
    tix_available: z.number().int().min(0)
})