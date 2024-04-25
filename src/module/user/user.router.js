// imports section
import { Router } from "express";
import * as userController from "./controller/user.controller.js";
import { validation } from "../../middleware/validationMiddleware.js";
import * as validators from "./user.validation.js";
import { userAut } from "../../middleware/aut.js";
import { endPint } from "./user.endPoint.js";

// create express router
const router = Router();
// start get router section
// start post create user
router.post(
  "/createUser",
  validation(validators.createUser),
  userAut(),
  userController.createUser
);
// end post create user
// start patch update user
router.patch(
  "/updateUser/:id",
  validation(validators.updateUser),
  userAut(),
  userController.updateUser
);
// end patch update user
// start delete user
router.delete(
  "/deleteUser/:id",
  validation(validators.deleteUser),
  userAut(),
  userController.deleteUser
);
// end delete user
// start  get User Count
router.get("/getUserCount", userAut(), userController.getUserCount);
// end get User Count
// start get all user user
router.get(
  "/getAllUser",
  // validation(validators.getAllUser),
  userAut(),
  userController.getAllUser
);
// end get all user user
// end get router section
// export express router
export default router;
