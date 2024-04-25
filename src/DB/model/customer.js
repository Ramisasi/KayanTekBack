// import section
import { Schema, model } from "mongoose";
// in schema everting about fields in database
const customerSchema = new Schema(
  {
    userName: {
      type: String,
      require: [true, "can't be blank"],
      unique: true,
    },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      require: [true, "can't be blank"],
      unique: true,
    },
    phoneNumber: {
      type: Number,
      require: [true, "can't be blank"],
    },
    password: {
      type: String,
      require: [true, "can't be blank"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dateOfBirth:{
      type: Date,
    },
    placeOfResidence: {
      type: String,
    },
    personalInterests: [],
    isLogin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
    code: String,
    codeTime: {
      type: Date,
    },
    forgetCode: String,
    forgetCodeTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
// in model tables name and integration with schema
export const customerModel = model("customer", customerSchema);
