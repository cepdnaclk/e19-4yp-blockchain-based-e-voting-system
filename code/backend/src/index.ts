// Entry point for the backend server
import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";

import mainRouter from "./routes/mainRouter";
import voterLoginRoutes from "./routes/voterRoutes";
import voteRoutes from "./routes/voteRoutes";
import resultRouter from "./routes/resultsRouter";
import setupMiddleware from "./middleware/setupMiddleware";
import debugMiddleware from "./middleware/debugMiddleware";
import errorHandling from "./middleware/errorHandlingMiddleware";

const app: Express = express();

// Setup global middleware (body parsing, CORS, etc.)
setupMiddleware(app);

// Debug middleware for logging requests
debugMiddleware(app);

// Main API routes (admin, auth, etc.)
app.use("/api", mainRouter);

// Voting-related routes (vote casting, candidate listing, etc.)
app.use("/api/votes", voteRoutes);

// Voter login and registration routes
app.use("/api/voter", voterLoginRoutes);

// Election results routes
app.use("/api/results", resultRouter);

// Global error handling middleware
errorHandling(app);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/api/test`);
});

export default app;
