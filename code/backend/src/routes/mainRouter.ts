import { Request, Response, Router } from "express";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  res.status(200).json();
});
export default router;
