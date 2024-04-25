import { userModel } from "../../../DB/model/user.model.js";
import { io } from "../../../index.js";
import { apiError, asyncHandle } from "../../../middleware/errorHandle.js";
import ApiFeatures from "../../../utils/ApiFeatures.js";
import { createLog } from "../../../utils/Logs.js";

export const createUser = asyncHandle(async (req, res, next) => {
  const { userName, password, email, phone, city } = req.body;
  const { userId } = req.user;
  const user = await userModel.findOne({
    $or: [{ email }, { userName }, { phone }],
    isDeleted: false,
  });
  if (user) {
    if (user.userName == userName)
      return next(new apiError("this name is exist", 409));
    else if (user.email == email)
      return next(new apiError("this email is exist", 409));
    else return next(new apiError("this phone is exist", 409));
  } else {
    console.log({ userName, password, email, phone, city });
    const newUser = new userModel({ userName, password, email, phone, city });
    const saveUser = await newUser.save();
    if (!saveUser) return next(new apiError("filed to create user", 400));
    else {
      createLog("createdUser", userId, userName);
      res.status(200).json({
        message: "created user successfully",
        user: {
          id: saveUser._id,
          userName: saveUser.userName,
          email: saveUser.email,
          phone: saveUser.phone,
          city: saveUser.city,
        },
      });
    }
  }
});
export const updateUser = asyncHandle(async (req, res, next) => {
  const { userName, password, email, phone, city } = req.body;
  const { id } = req.params;
  const { userId } = req.user;

  const findExistName = await userModel.findOne({
    _id: { $ne: id },
    $or: [{ email }, { userName }, { phone }],
    isDeleted: false,
  });
  if (findExistName) {
    if (findExistName.userName == userName)
      return next(new apiError("this name is exist", 409));
    else if (findExistName.email == email)
      return next(new apiError("this email is exist", 409));
    else return next(new apiError("this phone is exist", 409));
  }
  const user = await userModel.findByIdAndUpdate(
    { _id: id },
    { userName, password, email, phone, city },
    { new: true }
  );
  if (!user) {
    createLog("deletedUserUnsuccessfully", userId, userName);
    return next(new apiError("in-valid update user", 404));
  } else {
    createLog("updateUserSuccessfully", userId, userName);
    res.status(200).json({
      message: "update user successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        city: user.city,
      },
    });
  }
});
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  const user = await userModel.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
  );
  if (!user) {
    createLog("deletedUserUnsuccessfully", userId, "");
    return next(new apiError("in-valid delete Id", 404));
  } else {
    createLog("deletedUserSuccessfully", userId, "");

    res.status(200).json({
      message: "delete user successfully",
    });
  }
};
export const getUserCount = asyncHandle(async (req, res, nex) => {
  let users = await userModel.find({ isDeleted: false }).count();
  res.status(200).json(users);
});
export const getAllUser = asyncHandle(async (req, res, nex) => {
  const { userId } = req.user;
  const apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();
  let users = await apiFeatures.mongooseQuery;
  createLog("searchUserAndFind", userId, "");

  res.status(200).json(users);
});
export const getOnlineUserSocket = async (data) => {
  const apiFeatures = new ApiFeatures(userModel.find(), data).search().fields();
  let onlineUser = await apiFeatures.mongooseQuery;
  return io.emit("onlineUser", onlineUser);
};
