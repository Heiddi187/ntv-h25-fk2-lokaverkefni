import { Router } from "express";
import { getAllEventsController, createEventController } from "../controllers/eventController";

const router = Router();

router.get('/', getAllEventsController);
router.post('/', createEventController);

export default router;