import { Router } from "express";
import { getAllEventsByVenueController, getAllVenuesController, getVenueByIdController } from "../controllers/venueController";

const router = Router();

router.get('/', getAllVenuesController);
router.get('/:id', getVenueByIdController);
router.get('/:id/events', getAllEventsByVenueController);

export default router;