import { Request, Response, NextFunction } from "express";
import { buyTicketModel, getUserDataModel, getUsersTicketsModel, oldTicketsExpireModel, returnTicketModel, ticketToReturnModel } from "../models/ticketModel";

export const buyTicketsController = async (req: Request, res: Response, next: NextFunction) => {
    await oldTicketsExpireModel();
    try {
        const { event_id, quantity } = req.body;
        const ticket = await buyTicketModel(
            req.user!.id,
            event_id,
            quantity
        );
        return res.status(201).json(ticket)
    } catch (err: any) {
        if (err.message === 'EVENT_NOT_FOUND') return res.status(404).json({ error: 'Event not found' });
        if (err.message === 'EVENT_HAS_PASSED') return res.status(400).json({ error: 'Event has passed' });
        if (err.message === 'NOT_ENOUGH_TICKETS') return res.status(400).json({ error: 'Not enough tickets available' })
        next(err)
    }
};

export const getUsersTicketsController = async (req: Request, res: Response, next: NextFunction) => {
    await oldTicketsExpireModel();
    try {
        const tickets = await getUsersTicketsModel(req.user!.id);
        const rawData = await getUserDataModel(req.user!.id);

        const data = {
            event_count: Number(rawData.event_count),
            total_spent: Number(rawData.total_spent)
        };
        
        return res.status(200).json({
            data, 
            tickets
        });
    } catch (err) {
        next(err);
    }
};

export const returnTicketController = async (req: Request, res: Response, next: NextFunction) => {
    await oldTicketsExpireModel();
    try {
        const ticketId = Number(req.params.id);
        const ticket = await ticketToReturnModel(ticketId, req.user!.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        };
       
        const eventTime = new Date(ticket.event_ts);
        const now = new Date();
        if (eventTime <= now) {
        return res.status(400).json({ error: 'Ticket has expired' });
        }

        const hoursLeft = (eventTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursLeft < 24) {
        return res.status(400).json({ error: 'Cannot return tickets with less than 24h to event' });
        }

        const returnedTicket = await returnTicketModel(ticketId, req.user!.id);
        if (!returnedTicket) {
            return res.status(400).json({ error: 'Ticket has been returned' });
        }
        return res.status(200).json(returnedTicket);

    } catch (err) {
        next(err)
    }
}
//           