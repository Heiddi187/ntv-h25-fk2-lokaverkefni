import type {Request, Response, NextFunction} from 'express';

interface AppError extends Error {
    statusCode?: number
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response, 
    next: NextFunction
): void => {
    console.error(' Error: ', err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Something went wrong on the server'
    });
};

// export const errorHandlerFromUdemy = (
//     err,
//     req,
//     res, 
//     next: 
// )=> {
//     err.status = err.statusCode || 500;
//     err.status = err.status || 'error';

//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//     })
// }