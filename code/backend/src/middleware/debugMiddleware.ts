import { Express, NextFunction, Request, Response } from "express";

const debugMiddleware = (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
};

export default debugMiddleware;
