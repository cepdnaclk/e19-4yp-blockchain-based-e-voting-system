import dotenv from "dotenv";
dotenv.config();

const jwt = require("jsonwebtoken");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    return res.status(403).json({ message: "Invalid token" });
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
