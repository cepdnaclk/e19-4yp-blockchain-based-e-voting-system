import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const setupMiddleware = (app: Express) => {
  app.use(cookieParser());
  const corsOptions = {
    origin: process.env.CORS_ORIGIN, // Specify allowed origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify allowed methods
    credentials: true, // Allow cookies and authorization headers
  };
  app.use(cors(corsOptions));
  app.use(express.json());
};

export default setupMiddleware;
