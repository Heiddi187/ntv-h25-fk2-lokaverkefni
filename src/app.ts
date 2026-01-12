import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import eventRoutes from './routes/eventRoutes';
import venueRoutes from './routes/venueRoutes';
import userRoutes from './routes/userRoutes';

export const createApp = () => {
    const app = express();
    app.use(express.json());

    app.use('/api/events', eventRoutes); // validation fyrir ranga slóð ??
    app.use('/api/venues', venueRoutes);
    app.use('/api/users', userRoutes);

    app.use(errorHandler)

    return app;
}