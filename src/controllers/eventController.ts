import { Request, Response, NextFunction } from "express";
import { getAllEventsModel, createEventModel } from '../models/eventModel';
import { createEventSchema } from "../schemas/event.schema";

export const getAllEventsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await getAllEventsModel();
        res.json({
            count: events.length,
            items: events
        });
    } catch (err) {
        next(err);
    }
};

export const createEventController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createEventSchema.parse(req.body);
        const event = await createEventModel(data);
        res.status(201).json(event);
    } catch (err) {
        next(err);
    }
};