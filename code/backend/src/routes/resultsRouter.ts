import { Router } from "express";
import { resultTallyController } from "../controllers/result/resultTally";

const router: Router = Router();

router.get("/", resultTallyController);

export default router;
