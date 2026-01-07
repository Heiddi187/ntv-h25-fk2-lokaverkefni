import type {Request, Response, NextFunction} from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}
/**
 * Handle errors
 * @param error - The error to handle
 * @param request - The request object
 * @param response - The response object
 * @param next - The next function
 */
export const errorHandler = (
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return response.status(400).json({
      error: {
        status: 400,
        message: 'Validation failed',
        details,
      },
    });
  }

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  response.status(status).json({
    error: {
      status: status,
      message,
    },
  });
};

/*
interface AppError extends Error {
    statusCode?: number
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response, 
    next: NextFunction
) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            error: err.message
        })
    }
    

    console.error(' Error: ', err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Something went wrong on the server'
    });
};
*/

//////////////////

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