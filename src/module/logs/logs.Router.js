import { Router } from "express";

import * as logsController from "./controller/Logs.Controller.js";
import { userAut } from "../../middleware/aut.js";
const router = Router();

router.get("/getAllLogs", userAut(), logsController.getAllLogs);
router.get("/getLogsCount", userAut(), logsController.getLogsCount);
router.get("/getLogsDataCount", userAut(), logsController.getLogsDataCount);
router.get("/getDataLogs", userAut(), logsController.getDataLogs);

export default router;
