import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import voteRoutes from "./routes/voteRoutes";
import loginRoutes from "./routes/loginRouter";

dotenv.config();

const db = require("./models/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes

// Login routes
app.use("/api", loginRoutes);

// Voting router
app.use("/api/votes", voteRoutes);

// Database connection test
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await db.query(
      "INSERT INTO admin_data (user_name, password) VALUES ($1, $2) RETURNING *",
      ["testUser", "testPassword"]
    );
    res
      .status(200)
      .json({ message: "Database connection successful", result: result.rows });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

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
