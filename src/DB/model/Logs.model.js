import { Schema, Types, model } from "mongoose";
const logsSchema = new Schema(
  {
    logTitle: {
      type: String,
      allowNull: false,
    },
    logDescription: {
      type: String,
      allowNull: false,
    },
    userID: {
      type: Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);
export const logsModel = model("log", logsSchema);
