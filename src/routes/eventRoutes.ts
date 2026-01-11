import { Router } from "express";
import { getAllEventsController, createEventController, getEventByIdController } from "../controllers/eventController";

const router = Router();

router.get('/', getAllEventsController);
router.post('/', createEventController);
router.get('/:id', getEventByIdController);

export default router;