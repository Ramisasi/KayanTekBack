import { customerModel } from "../DB/model/customer.js";
import { userModel } from "../DB/model/user.model.js";
import { apiError } from "./errorHandle.js";
import jwt from "jsonwebtoken";

export const userAut = () => {
  return (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split("__")[1];
    jwt.verify(token, process.env.tokenSignature, async (err, result) => {
      if (err || !result) {
        return next(new apiError("in-valid token", 400));
      } else {
        const checkUser = await userModel.findById(result.id);
        if (!checkUser) return next(new apiError("in-valid user", 401));
        else if (!checkUser.isLogin)
          return next(new apiError("user not login", 401));
        else {
          const user = { userId: checkUser._id };
          req.user = user;
          next();
        }
      }
    });
  };
};

export const customerAut = () => {
  return (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split("__")[1];
    jwt.verify(token, process.env.tokenSignature, async (err, result) => {
      if (err || !result) {
        return next(new apiError("in-valid toke", 400));
      } else {
        const checkCustomer = await customerModel.findOne({
          _id: result.id,
          isDeleted: false,
        });
        if (!checkCustomer) return next(new apiError("in-valid customer", 401));
        else if (user.isConfirm)
          return next(new apiError("this account has been not confirm", 401));
        else if (user.isBlocked)
          return next(
            new apiError("this account has been blocked by admin", 403)
          );
        else if (!checkCustomer.isLogin)
          return next(new apiError("customer not login", 401));
        else {
          const customer = {
            customerId: checkCustomer._id,
          };
          req.customer = customer;
          next();
        }
      }
    });
  };
};
