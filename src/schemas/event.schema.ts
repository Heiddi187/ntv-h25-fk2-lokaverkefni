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
    tix_available: z.number().int().min(1).max(5500) // finna út hvernig þú getur ekki sett meira en venue.capacity ?
});

export const IdParamSchema = z.object({
    id: z.coerce.number().int().positive()
});

export const updateEventSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    city: z.string().min(2).optional(),
    category: z.string().min(2).optional(),
    event_time: z.string().optional(),
    event_date: z.string().optional(),
    duration: z.number().min(10).optional(),
    venue_id: z.number().int().optional(),
    price: z.number().int().min(0).optional(),
    tix_available: z.number().int().min(0).optional()
}).strict();