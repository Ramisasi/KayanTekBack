// imports section
import { Router } from "express";
import * as customerController from "./controller/customer.controller.js";

// create express router
const router = Router();

// get router section
// get All customer
router.put("/updateCustomer/:id", customerController.updateCustomer);

// get router section
// get All customer
router.put("/deleteCustomer/:id", customerController.deleteCustomer);

// get router section
// get All customer
router.put(
  "/changeCustomerPassword/:id",
  customerController.changeCustomerPassword
);
router.get("/getCustomer/:id", customerController.getCustomer);

// export express router
export default router;
