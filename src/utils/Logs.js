import { logsModel } from "../DB/model/Logs.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const createLog = async (name, userID, desc) => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const fullPath = path.join(__dirname, "./LogsCases.json");

    const jsonLog = JSON.parse(fs.readFileSync(fullPath, "utf8"));

    const Logs = await logsModel.create({
      logTitle: jsonLog[name].title,
      logDescription: jsonLog[name].description + desc,
      userID,
    });
  } catch (error) {}
};
