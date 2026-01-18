import { ZodTypeAny } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateQuery =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.query = schema.parse(req.query);
    next();
  };

// ZodTypeAny er deprecated en þetta er það eina sem ég fann sem virkaði fyrir mig