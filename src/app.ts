import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import eventRoutes from './routes/eventRoutes';
import venueRoutes from './routes/venueRoutes';

export const createApp = () => {
    const app = express();
    app.use(express.json());

    app.use('/api/events', eventRoutes); // validation fyrir ranga slóð ??
    app.use('/api/venues', venueRoutes);

    app.use(errorHandler)

    return app;
}