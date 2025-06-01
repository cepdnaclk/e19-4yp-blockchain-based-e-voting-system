import express, { Router } from "express";

const router: Router = express.Router();

// Login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Dummy authentication logic
  if (username === "admin" && password === "password") {
    res.status(200).json({ message: "Login successful", token: "dummy-token" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

export default router;
