import mongoose from "mongoose";
import { v4 as uuid } from "uuid";



const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
      unique: true,
      default: uuid,
    },
    firstName: {
      type: String,
      require: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    DOB: {
      type: Date,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    mobileNo: {
      type: Number,
    },
    password: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
      require: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("userDetails", userSchema);

export default userModel;
