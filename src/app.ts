import express from 'express';
import { errorHandler } from './middleware/errorHandler';


export const createApp = () => {
    const app = express();
    app.use(express.json());

    //... slóðir inn í routes
    // app.use /api/slóð

    app.use(errorHandler)

    return app;
}