import { userModel } from "../DB/model/user.model.js";
import { apiError, asyncHandle } from "../middleware/errorHandle.js";
import bcrypt from "bcryptjs";

export const createAdmin = async () => {
  try {
    const user = await userModel.findOne({
      userName: process.env.adminName,
      isDeleted: false,
    });
    if (!user) {
      bcrypt.hash(
        process.env.userPassword,
        parseInt(process.env.saltRand),
        async (err, result) => {
          if (err || !result) {
            return console.log("in-valid hash Password");
          } else {
            const createUser = new userModel({
              userName: process.env.adminName,
              password: result,
            });
            const createdUser = await createUser.save();
            console.log({
              _id: createdUser._id,
              userName: createdUser.userName,
            });
          }
        }
      );
    }
  } catch (error) {
    return new apiError("catch error", 500);
  }
};
