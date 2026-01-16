import { z } from 'zod';

export const buyTicketSchema = z.object({
    event_id: z.number().int().positive(),
    quantity: z.number().int().positive()
});

export const ticketIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, 'Need a ticket id and it should be a number')
});

export const getUserDataSchema = z.object({
    event_count: z.number(),
    total_spent: z.number()
});

export const ticketSchema = z.object({
    ticket_id: z.number(),
    title: z.string(),
    quantity: z.number(),
    total_price: z.number(),
    ticket_status: z.enum(['bought', 'refunded', 'used', 'expired']),
    event_date: z.string(),
    event_time: z.string(),
    purchased_at: z.string(),
    venue_id: z.number(),
    venue: z.string(),
});

export const getUserTicketSchema = z.object({
    data: getUserDataSchema,
    tickets: z.array(ticketSchema)
})