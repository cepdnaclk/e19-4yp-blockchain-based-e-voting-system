import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/authRouter";
import loginRoutes from "./routes/loginRouter";
import registerRouter from "./routes/registerRouter";
import voterLoginRoutes from './routes/voterLoginRoutes';
import voteRoutes from "./routes/voteRoutes";

dotenv.config();

const db = require("./models/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes

// Register routes
app.use("/api/admin/register", registerRouter);

// Login routes
app.use("/api/admin", loginRoutes);

// Token Refresh routes
app.use("/api/auth/refresh-token", authRouter);

// Voting router
app.use("/api/votes", voteRoutes);

// Voter login router
app.use("/api/voter", voterLoginRoutes);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working" });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/test`);
});
