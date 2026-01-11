import { Request, Response, NextFunction } from "express";
import { getAllEventsByVenueModel, getAllVenuesModel, getVenueByIdModel } from "../models/venueModel";
import { IdParamSchema } from "../schemas/venue.schema";


export const getAllVenuesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const venues = await getAllVenuesModel();
        return res.status(200).json(venues);
    } catch (err) {
        next(err);
    }
}

export const getVenueByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = IdParamSchema.parse(req.params);

        const event = await getVenueByIdModel(id);
        if(!event) {
            return res.status(404).json({ error: 'Venue Id not found'})
        }

        return res.status(200).json(event);
    } catch (err) {
        next(err);
    }
};

export const getAllEventsByVenueController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = IdParamSchema.parse(req.params);

        const venue = await getVenueByIdModel(id);

        const events = await getAllEventsByVenueModel(id);
        if(!events) {
            return res.status(404).json({ error: 'Venue Id not found'})
        }

        return res.status(200).json({
            venue,
            events
        });
    } catch (err) {
        next(err);
    }
};