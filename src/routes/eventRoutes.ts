import { Router } from "express";
import { getAllEventsController, createEventController, getEventByIdController, updateEventController, getEventsByCategoryController, getEventsByDateController, getEventsByCityController, getEventsByVenueController } from "../controllers/eventController";

const router = Router();

router.get('/', getAllEventsController);
router.post('/', createEventController);
router.get('/:id', getEventByIdController);
router.patch('/:id', updateEventController);
router.get('/group/category', getEventsByCategoryController);
router.get('/group/date', getEventsByDateController);
router.get('/group/city', getEventsByCityController);
router.get('/group/venue', getEventsByVenueController);

export default router;