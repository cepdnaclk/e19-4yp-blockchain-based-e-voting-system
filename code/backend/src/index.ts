import mainRouter from "./routes/mainRouter";
// import loginRoutes from "./routes/loginRouter";
// import logoutRoutes from "./routes/logoutRouter";
// import registerRouter from "./routes/registerRouter";
// import voterLoginRoutes from "./routes/voterLoginRoutes";
// import voteRoutes from "./routes/voteRoutes";
// import { authMiddleware } from "./middlewear/authMiddlewear";
import express, { Express } from "express";
import dotenv from "dotenv";
import setupMiddleware from "./middleware/setupMiddleware";
import debugMiddleware from "./middleware/debugMiddleware";
import errorHandling from "./middleware/errorHandlingMiddleware";

dotenv.config();

const app: Express = express();

// Setup Middleware
setupMiddleware(app);

// Debug middleware
debugMiddleware(app);

// Routes
app.use("/api", mainRouter);

// // Logout router
// app.use("/api/admin/logout", authMiddleware, logoutRoutes);

// // Token Refresh routes
// app.use("/api/auth/refresh-token", authRouter);

// // Voting router
// app.use("/api/votes", voteRoutes);

// // Voter login router
// app.use("/api/voter", voterLoginRoutes);

// // Voter login router
// app.use("/api/voter", voterLoginRoutes);

// // System status test route
// app.get("/api/system-status", authMiddleware, (req, res) => {
//   res.status(200).json({ message: "Server is working" });
// });

// // Error handling middleware
errorHandling(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/api/test`);
});

export default app;
