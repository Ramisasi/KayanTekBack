import { logsModel } from "../../../DB/model/Logs.model.js";
import { apiError, asyncHandle } from "../../../middleware/errorHandle.js";
import ApiFeatures from "../../../utils/ApiFeatures.js";

export const getAllLogs = asyncHandle(async (req, res) => {
  const apiFeatures = new ApiFeatures(logsModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields()
    .populate("userID", "-_id userName");
  let logs = await apiFeatures.mongooseQuery;
  if (logs) res.status(200).json({ Logs: logs });
  else next(new apiError("filed logs", 403));
});
export const getLogsCount = asyncHandle(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(logsModel.find(), req.query).count();
  let logCount = await apiFeatures.mongooseQuery;
  if (logCount) res.status(200).json({ message: "log count", logCount });
  else next(new apiError("filed count", 403));
});
export const getLogsDataCount = asyncHandle(async (req, res) => {
  const apiFeatures = new ApiFeatures(logsModel.find(), req.query).filter();
  let dataLogCount = await apiFeatures.mongooseQuery;
  if (dataLogCount)
    res
      .status(200)
      .json({ message: "user log count", dataLogCount: dataLogCount?.length });
  else next(new apiError("filed count", 204));
});
export const getDataLogs = asyncHandle(async (req, res) => {
  console.log(req.query);
  const apiFeatures = new ApiFeatures(logsModel.find(), req.query)
    .filter()
    .populate("userID", "-_id UserName");
  let logs = await apiFeatures.mongooseQuery;
  if (logs) res.status(200).json({ Logs: logs });
  else next(new apiError("filed logs", 204));
});
