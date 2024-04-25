import fs from "fs";
import { apiError } from "../middleware/errorHandle.js";

export const deleteFile = () => {
  return (req, res, next) => {
    let deleted = false;
    const { destination } = req?.file;
    fs.readdir(destination, (err, result) => {
      if (err) {
        // deleted = false;
      } else {
        // deleted = true;
        for (const iterator of result) {
          if (iterator != req.file.filename)
            fs.unlinkSync(req.file.destination + "\\" + iterator);
        }
      }
    });
    // console.log(deleted);
    // if (!deleted) next(new apiError("delete file error"));
    // else
    next();
  };
};
