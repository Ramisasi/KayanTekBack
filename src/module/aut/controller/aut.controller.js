import { userModel } from "../../../DB/model/user.model.js";
import { apiError, asyncHandle } from "../../../middleware/errorHandle.js";
import { customerModel } from "../../../DB/model/customer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../utils/sendEmail.js";
import { customAlphabet } from "nanoid";

export const loginUser = asyncHandle(async (req, res, next) => {
  const { userName, password } = req.body;
  const user = await userModel.findOne({ userName });
  if (!user) return next(new apiError("in-valid user name", 404));
  else {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) return next(new apiError("password mis match", 400));
      else {
        jwt.sign(
          {
            id: user._id,
            userName,
            isLogin: true,
          },
          process.env.tokenSignature,
          { expiresIn: process.env.tokenExpires },
          async (tokenErr, decoded) => {
            if (tokenErr) return next(new apiError("in-valid token", 400));
            else {
              await userModel.findByIdAndUpdate(
                { _id: user._id },
                { isLogin: true }
              );
              res.status(200).json({ message: "don", token: decoded });
            }
          }
        );
      }
    });
  }
});
// Signup user
export const signUp = async (req, res, next) => {
  const { userName, email, phone, city, password } = req.body;
  const findCustomer = await customerModel.findOne({
    $or: [{ email }, { userName }, { phone }],
    isDeleted: false,
  });

  if (findCustomer) {
    if (findCustomer.isBlocked) {
      return next(new apiError("User account is blocked", 400));
    } else if (findCustomer.email == email) {
      return next(new apiError("Email already exists", 409));
    } else if (findCustomer.phoneNumber == phone) {
      return next(new apiError("phone number already exists", 409));
    } else if (findCustomer.userName == userName) {
      return next(new apiError("userName already exists", 409));
    }
  } else {
    bcrypt.hash(
      password,
      parseInt(process.env.saltRand),
      async (err, result) => {
        if (err || !result) {
          return next(new apiError("Invalid hashed password", 402));
        } else {
          // Create user
          const nanoid = customAlphabet(
            process.env.nanoidAlphabet,
            parseInt(process.env.nanoidSize)
          );
          const code = nanoid(parseInt(process.env.codeCount));
          let saveCustomer;
          const customer = new customerModel({
            userName,
            email,
            password: result,
          });
          const subject = `confirm email`;
          const message = `your code is ${code}`;
          const checkSendEmail = await sendEmail(email, subject, message);
          if (!checkSendEmail) {
            return next(new apiError("felid to create customer", 403));
          } else {
            saveCustomer = await customer.save();
          }
          if (saveCustomer) {
            const data = new Date();
            await customerModel.findByIdAndUpdate(
              { _id: saveCustomer._id },
              { code, codeTime: data }
            );
            jwt.sign(
              { id: saveCustomer._id },
              process.env.tokenSignature,
              async (err, result) => {
                if (err || !result)
                  return next(new apiError("in-valid token", 401));
                else {
                  res.status(201).json({
                    message:
                      "created account successfully please confirm your email",
                    token: result,
                  });
                }
              }
            );
          } else {
            return next(new apiError("filed to create account", 401));
          }
        }
      }
    );
  }
};
//signIn user
export const signIn = asyncHandle(async (req, res, next) => {
  const { userName, password } = req.body;
  const user = await customerModel.findOne({ userName, isDeleted: false });
  if (!user) return next(new apiError("in-valid user name", 404));
  else {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) return next(new apiError("incorrect password", 400));
      else {
        jwt.sign(
          {
            id: user._id,
            userName: user.userName,
            isLogin: true,
          },
          process.env.tokenSignature,
          { expiresIn: process.env.tokenExpires },
          async (tokenErr, decoded) => {
            if (tokenErr) return next(new apiError("in-valid token", 400));
            else {
              await customerModel.findByIdAndUpdate(
                { _id: user._id },
                { isLogin: true }
              );
              res.status(200).json({ message: "done", token: decoded });
            }
          }
        );
      }
    });
  }
});
export const confirmEmail = asyncHandle(async (req, res, next) => {
  const { id, confirmCode } = req.body;
  const customer = await customerModel.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!customer) return next(new apiError("in-valid customer", 400));
  else if (customer.isBlocked)
    return next(new apiError("your account is blocked", 400));
  else {
    const { code, codeTime } = customer;
    if (!code && !codeTime)
      return next(new apiError("your account is confirmed", 400));
    else {
      const currentDate = new Date();
      const diffHours = currentDate.getHours() - codeTime.getHours();
      const diffMinutes = currentDate.getMinutes() - codeTime.getMinutes();
      if (
        code !== confirmCode ||
        currentDate.toLocaleDateString() > codeTime.toLocaleDateString() ||
        diffHours > parseInt(process.env.codeEndHours) ||
        diffMinutes > parseInt(process.env.codeEndMinutes)
      )
        return next(new apiError("in-valid confirm Code", 400));
      else {
        const updateConfirm = await customerModel.findByIdAndUpdate(id, {
          isConfirm: true,
          $unset: { code: "", codeTime: "" },
        });
        if (!updateConfirm)
          return next(new apiError("filed to confirm email", 400));
        else res.status(200).send({ message: "confirm email successfully" });
      }
    }
  }
});
export const rfSendEmail = asyncHandle(async (req, res, next) => {
  const { id } = req.body;
  const customer = await customerModel.findOne({ _id: id, isDeleted: false });
  if (!customer) return next(new apiError("in-valid customer id", 403));
  else if (customer.isConfirm)
    return next(new apiError("your account is confirmed", 400));
  else if (customer.isBlocked)
    return next(new apiError("your account is blocked", 400));
  else {
    const nanoid = customAlphabet(
      process.env.nanoidAlphabet,
      parseInt(process.env.nanoidSize)
    );
    const code = nanoid(parseInt(process.env.codeCount));
    const subject = `resend confirm email`;
    const message = `resend your code is ${code}`;
    sendEmail(customer.email, subject, message);
    const data = new Date();
    await customerModel.findByIdAndUpdate(
      { _id: customer._id },
      { code, codeTime: data }
    );
    res.status(201).json({
      message: "resend code successfully please confirm your email",
    });
  }
});
export const forgetPassword = asyncHandle(async (req, res, next) => {
  const { email } = req.body;
  const customer = await customerModel.findOne({ email, isDeleted: false });

  if (!customer) {
    return next(new apiError("Invalid customer email", 403));
  } else if (customer.isBlocked) {
    return next(new apiError("Your account is blocked", 400));
  } else {
    const nanoid = customAlphabet(
      process.env.nanoidAlphabet,
      parseInt(process.env.nanoidSize)
    );

    const forgetCode = nanoid(parseInt(process.env.codeCount));
    const subject = "Forget Password Code";
    const message = `Use this code to update your password: ${forgetCode}`;

    // Assuming sendEmail is an asynchronous function, make sure to await it.
    await sendEmail(customer.email, subject, message);

    const data = new Date();
    await customerModel.findByIdAndUpdate(
      { _id: customer._id },
      { forgetCode, forgetCodeTime: data }
    );

    res.status(201).json({
      message: `Forget password code sent successfully to customer with ID: ${customer._id}`,
    });
  }
});
export const checkForgetPasswordCode = asyncHandle(async (req, res, next) => {
  const { id, confirmCode } = req.body;
  const customer = await customerModel.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!customer) return next(new apiError("in-valid customer", 400));
  else if (!customer.isConfirm)
    return next(new apiError("your account is not confirmed", 400));
  else if (customer.isBlocked)
    return next(new apiError("your account is blocked", 400));
  else {
    const { forgetCode, forgetCodeTime } = customer;
    if (!forgetCode && !forgetCodeTime)
      return next(new apiError("in-valid update Forget Password", 400));
    else {
      const currentDate = new Date();
      const diffHours = currentDate.getHours() - forgetCodeTime.getHours();
      const diffMinutes =
        currentDate.getMinutes() - forgetCodeTime.getMinutes();
      if (
        forgetCode !== confirmCode ||
        currentDate.toLocaleDateString() >
          forgetCodeTime.toLocaleDateString() ||
        diffHours > parseInt(process.env.codeEndHours) ||
        diffMinutes > parseInt(process.env.codeEndMinutes)
      )
        return next(new apiError("in-valid Forget Password Code", 400));
      else {
        res.status(200).send({ message: "Code is success" });
      }
    }
  }
});
export const updateForgetPassword = asyncHandle(async (req, res, next) => {
  const { id, confirmCode, password } = req.body;
  const customer = await customerModel.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!customer) return next(new apiError("in-valid customer", 400));
  else if (!customer.isConfirm)
    return next(new apiError("your account is not confirmed", 400));
  else if (customer.isBlocked)
    return next(new apiError("your account is blocked", 400));
  else {
    const { forgetCode, forgetCodeTime } = customer;
    if (!forgetCode && !forgetCodeTime)
      return next(new apiError("in-valid update Forget Password", 400));
    else {
      const currentDate = new Date();
      const diffHours = currentDate.getHours() - forgetCodeTime.getHours();
      const diffMinutes =
        currentDate.getMinutes() - forgetCodeTime.getMinutes();
      if (
        forgetCode !== confirmCode ||
        currentDate.toLocaleDateString() >
          forgetCodeTime.toLocaleDateString() ||
        diffHours > parseInt(process.env.codeEndHours) ||
        diffMinutes > parseInt(process.env.codeEndMinutes)
      )
        return next(new apiError("in-valid Forget Password Code", 400));
      else {
        bcrypt.hash(
          password,
          parseInt(process.env.saltRand),
          async (error, result) => {
            if (error || !result)
              return next(new apiError("filed to has password", 400));
            else {
              const updateForgetPassword =
                await customerModel.findByIdAndUpdate(id, {
                  password: result,
                  $unset: { forgetCode: "", forgetCodeTime: "" },
                });
              if (!updateForgetPassword)
                return next(new apiError("filed to update password", 400));
              else
                res
                  .status(200)
                  .send({ message: "update password successfully" });
            }
          }
        );
      }
    }
  }
});
