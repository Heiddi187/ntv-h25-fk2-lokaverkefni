import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import eventRoutes from './routes/eventRoutes';

export const createApp = () => {
    const app = express();
    app.use(express.json());

    app.use('/api/events', eventRoutes);

    app.use(errorHandler)

    return app;
}