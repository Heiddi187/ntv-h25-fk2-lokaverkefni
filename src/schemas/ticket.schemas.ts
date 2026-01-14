import { z } from 'zod';

export const buyTicketSchema = z.object({
    event_id: z.number().positive(),
    quantity: z.number().positive()
});