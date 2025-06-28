import express, { Express, NextFunction, Request, Response } from "express";

const errorHandling = (app: Express) => {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });
};

export default errorHandling;
