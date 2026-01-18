import { Request, Response, NextFunction } from "express";
import { getAllEventsModel, getEventByIdModel, getFilteredEventsModel } from '../models/eventModel';
import { EventsQuery, IdParamSchema } from "../schemas/event.schema";

export const getAllEventsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await getAllEventsModel();
        return res.json({
            count: events.length,
            events: events
        });
    } catch (err) {
        next(err);
    };
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
    };
};

export const getFilteredEventsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryLine = res.locals.query as EventsQuery;
        
        const filterCheck = 
            queryLine.category ||
            queryLine.city ||
            queryLine.venue ||
            queryLine.event_date ||
            queryLine.date_from ||
            queryLine.date_to ||
            queryLine.sort || 
            queryLine.page ||
            queryLine.limit ||
            queryLine.order;

        if (!filterCheck) {
            const events = await getAllEventsModel();
            return res.status(200).json({
                count: events.length,
                events
            });
        };
        
        const { total, events } = await getFilteredEventsModel(queryLine);

        return res.status(200).json({
            page: queryLine.page ?? 1,
            limit: queryLine.limit ?? 10,
            total,
            events
        })
    } catch (err) {
        next(err);
    };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// .... Óþarfi sem má eyða fyrir skil ....

// export const createEventController = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = createEventSchema.parse(req.body);
//         const event = await createEventModel(data);
//         return res.status(201).json(event);
//     } catch (err) {
//         next(err);
//     }
// };

// export const updateEventController = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = IdParamSchema.parse(req.params);
//         const data = updateEventSchema.parse(req.body);
        
//         const updatedEvent = await updateEventModel(id, data);

//         if(!updatedEvent) {
//             return res.status(404).json({ error: 'Event id not found'});
//         }
        
//         return res.status(200).json(updatedEvent);
//     } catch (err) {
//         next(err);
//     }
// };
/*
export const getEventsByCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await getEventsByCategoryModel();
        return res.status(200).json(events)
    } catch (err) {
        next(err)
    }
}

export const getEventsByDateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await getEventsByDateModel();
        return res.status(200).json(events)
    } catch (err) {
        next(err)
    }
}

export const getEventsByCityController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await getEventsByCityModel();
        return res.status(200).json(events)
    } catch (err) {
        next(err)
    }
}

export const getEventsByVenueController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await getEventsByVenueModel();
        return res.status(200).json(events)
    } catch (err) {
        next(err)
    }
};
*/
// export type EventsQuery = {
//     category?: string;
//     city?: string;
//     venue?: string;
//     event_date?: string;
//     date_from?: string;
//     date_to?: string;
//     sort?: 'price' | 'date' | 'tickets';
//     order?: 'asc' | 'desc';
//     page?: number;
//     limit?: number;
// };