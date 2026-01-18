import { Router } from "express";
import { getEventByIdController, getFilteredEventsController } from "../controllers/eventController";
import { validateQuery } from "../middleware/zodSchemas";
import { eventsQuerySchema } from "../schemas/event.schema";

const router = Router();

router.get(
    '/', 
    validateQuery(eventsQuerySchema), 
    getFilteredEventsController
);
router.get('/:id', getEventByIdController);

export default router;

/*
/router.get('/', getAllEventsController);
router.post('/', createEventController);
router.patch('/:id', updateEventController);
router.get('/group/category', getEventsByCategoryController);
router.get('/group/date', getEventsByDateController);
router.get('/group/city', getEventsByCityController);
router.get('/group/venue', getEventsByVenueController);
*/