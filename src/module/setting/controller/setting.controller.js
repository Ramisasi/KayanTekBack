import { settingModel } from "../../../DB/model/setting.js";
import { apiError, asyncHandle } from "../../../middleware/errorHandle.js";
export const getSetting = asyncHandle(async (req, res, next) => {
  const setting = await settingModel.findOne();
  if (!setting) return next(new apiError("empty setting", 404));
  else
    res.status(200).json({
      message: "setting",
      setting: {
        systemName: setting.systemName,
        mainColor: setting.mainColor,
        secondaryColor: setting.secondaryColor,
      },
    });
});
export const createSetting = asyncHandle(async (req, res, next) => {
  const { systemName, mainColor, secondaryColor } = req.body;
  const setting = await settingModel.findOne({ systemName });
  const { userId } = req.user;
  if (setting) return next(new apiError("this setting is rally exist", 400));
  const addSetting = new settingModel({
    systemName,
    mainColor,
    secondaryColor,
    createdBy: userId,
    updatedBy: userId,
  });
  const saveSetting = await addSetting.save();
  if (!saveSetting) return next(new apiError("in-valid to save setting"));
  else
    res.status(200).json({
      message: "save setting successfully",
      setting: {
        systemName: saveSetting.systemName,
        mainColor: saveSetting.mainColor,
        secondaryColor: saveSetting.secondaryColor,
      },
    });
});
export const updateSetting = asyncHandle(async (req, res, next) => {
  const { systemName, mainColor, secondaryColor } = req.body;
  const { id } = req.params;
  const { userId } = req.user;
  const setting = await settingModel.findOneAndUpdate(
    { _id: id },
    {
      systemName,
      mainColor,
      secondaryColor,
      updatedBy: userId,
    },
    { new: true }
  );
  if (!setting) return next(new apiError("this setting is not exist", 404));
  else
    res.status(200).json({
      message: "update setting successfully",
      setting: {
        systemName: setting.systemName,
        mainColor: setting.mainColor,
        secondaryColor: setting.secondaryColor,
      },
    });
});
export const addSettingPic = asyncHandle(async (req, res, next) => {
  const { filename } = req.file;
  const { id } = req.params;
  const { userId } = req.user;
  const setting = await settingModel.findByIdAndUpdate(
    { _id: id },
    { logoPicture: filename, updatedBy: userId },
    { new: true }
  );
  if (!setting) return next(new apiError("in-valid setting id", 404));
  res.status(200).json({
    message: "add setting successfully",
    setting: {
      systemName: setting.systemName,
      mainColor: setting.mainColor,
      secondaryColor: setting.secondaryColor,
      logoPicture: setting.logoPicture,
    },
  });
});
