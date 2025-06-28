import { Request, Response, Router } from "express";
import { sendSuccess } from "../utils/responseHandler";
import messages from "../common/constants/messages";
import adminRouter from "./adminRouter";
import authRouter from "./authRouter";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  sendSuccess(res, 200, { message: messages.common.success });
});

router.use("/admin", adminRouter);

router.use("/auth", authRouter);

export default router;
