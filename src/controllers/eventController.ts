import { Request, Response, NextFunction } from "express";
import * as Event from '../models/eventModel';
import { createEventSchema } from "../schemas/event.schema";

export const getAllEventsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.getAllEvents();
        res.json(events);
    } catch (err) {
        next(err);
    }
};

export const createEventController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createEventSchema.parse(req.body);
        const event = await Event.createEvent(data);
        res.status(201).json(event);
    } catch (err) {
        next(err);
    }
};