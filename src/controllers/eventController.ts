import { Request, Response, NextFunction } from "express";
import { getAllEventsModel, createEventModel, getEventByIdModel, updateEventModel } from '../models/eventModel';
import { createEventSchema, IdParamSchema, updateEventSchema } from "../schemas/event.schema";

export const getAllEventsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await getAllEventsModel();
        return res.json({
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
        return res.status(201).json(event);
    } catch (err) {
        next(err);
    }
};

export const getEventByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = IdParamSchema.parse(req.params);

        const event = await getEventByIdModel(id);
        if(!event) {
            return res.status(404).json({ error: 'Event Id not found'})
        }

        return res.status(200).json(event);
    } catch (err) {
        next(err);
    }
};

export const updateEventController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = IdParamSchema.parse(req.params);
        const data = updateEventSchema.parse(req.body);
        
        const updatedEvent = await updateEventModel(id, data);

        if(!updatedEvent) {
            return res.status(404).json({ error: 'Event id not found'});
        }
        
        return res.status(200).json(updatedEvent);
    } catch (err) {
        next(err);
    }
};