// imports section
import { Router } from "express";
import * as settingController from "./controller/setting.controller.js";
import { myMulter, HME, multerValidation } from "../../utils/multer.js";
import { deleteFile } from "../../utils/deletefile.js";
import { validation } from "../../middleware/validationMiddleware.js";
import * as settingValidators from "./setting.validation.js";
import { userAut } from "../../middleware/aut.js";
// create express router
const router = Router();

// get router section
// get All Setting
router.get("/getSetting", userAut(), settingController.getSetting);

router.post(
  "/createSetting",
  validation(settingValidators.createSetting),
  userAut(),
  settingController.createSetting
);
router.patch(
  "/updateSetting/:id",
  validation(settingValidators.updateSetting),
  userAut(),
  settingController.updateSetting
);
router.patch(
  "/addSettingPic/:id",
  myMulter(multerValidation.image).single("file"),
  HME(),
  deleteFile(),
  userAut(),
  validation(settingValidators.addSettingPic),
  settingController.addSettingPic
);

// export express router
export default router;
