import express, { Router } from "express";
import { validatePasswrd } from "../services/authService";
import { dbQuery } from "../services/dbService";

const router: Router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user: {
    id: string;
    user_name: string;
    password: string;
    created_at: Date;
  }[] = (
    await dbQuery({
      query: "SELECT * FROM admin_data WHERE user_name = $1",
      params: [username],
    })
  ).rows;

  if (user.length === 0) {
    res.status(400).json({ message: "User not found", userName: username });
    return;
  }

  const isPasswordMatch = await validatePasswrd(password, user[0].password);
  if (isPasswordMatch) {
    res.status(200).json({ message: "Authenticated", userName: username });
  } else {
    res
      .status(200)
      .json({ message: "Password does not match", userName: username });
  }
});

export default router;
