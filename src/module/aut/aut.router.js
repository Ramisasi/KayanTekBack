// imports section
import { Router } from "express";
import * as autController from "./controller/aut.controller.js";
import * as autValidator from "./aut.validation.js";
import { validation } from "../../middleware/validationMiddleware.js";

// create express router
const router = Router();

// start router section
// start post login User
router.post(
  "/loginUser",
  validation(autValidator.loginUser),
  autController.loginUser
);
// end post login User

// start post login customer
router.post("/signUp", autController.signUp);
// end post login customer
// end router section
// start post login customer
router.post("/signIn", autController.signIn);
// end post login customer
// start patch confirm Email
router.patch("/confirmEmail", autController.confirmEmail);
// end patch confirm Email
// start patch resend confirm Email
router.patch("/resendConfirmEmail", autController.rfSendEmail);
// end patch resend confirm Email
// start patch resend confirm Email
router.patch("/forgetPassword", autController.forgetPassword);
// end patch resend confirm Email
// start get check Forget Password Code
router.post("/checkForgetPasswordCode", autController.checkForgetPasswordCode);
// end get check Forget Password Code
// start patch resend confirm Email
router.patch("/updateForgetPassword", autController.updateForgetPassword);
// end patch resend confirm Email
// end router section

// export express router
export default router;

//this is a comment
