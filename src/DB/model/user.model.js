// import section
import { Schema, Types, model } from "mongoose";
// in schema everting about fields in database
const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, "can't be blank"],
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
    },
    city: String,
    phone: String,
    email: String,
    isLogin: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// in model tables name and integration with schema
export const userModel = model("user", userSchema);
