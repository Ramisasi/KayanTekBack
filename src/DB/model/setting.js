import { Schema, model, Types } from "mongoose";

export const settingSchema = new Schema(
  {
    systemName: String,
    mainColor: String,
    logoPicture: String,
    secondaryColor: String,
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const settingModel = model("setting", settingSchema);
