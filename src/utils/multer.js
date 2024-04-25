import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { apiError } from "../middleware/errorHandle.js";

export const multerValidation = {
  image: ["image/png", "image/jpeg", "image/jif"],
  pdf: ["application/pdf"],
};

export const HME = () => {
  return (err, req, res, nex) => {
    if (err) nex(new apiError("multer error", 500));
  };
};
export const myMulter = (customValidation) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const pathName = path.join(__dirname, "../upload");
      if (!fs.existsSync(pathName)) {
        fs.mkdirSync(pathName, { recursive: true });
      }
      cb(null, pathName);
    },
    filename: (req, file, cb) => {
      const imageType = file.mimetype.split("/")[1];
      cb(null, `${Date.now()}-.${imageType}`);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) cb(null, true);
    else cb("in-valid format", false);
  };
  const upload = multer({ dest: "upload", fileFilter, storage });
  return upload;
};
