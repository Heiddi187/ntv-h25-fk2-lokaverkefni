import { Router } from "express";
import { getAllEventsController, createEventController, getEventByIdController, updateEventController } from "../controllers/eventController";

const router = Router();

router.get('/', getAllEventsController);
router.post('/', createEventController);
router.get('/:id', getEventByIdController);
router.patch('/:id', updateEventController);

export default router;