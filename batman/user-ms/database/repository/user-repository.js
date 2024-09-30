import userModel from "../models/user.js";
import { APIError, STATUS_CODES } from "../../utils/app-errors.js";

//Dealing with data base operations
export default class userRepository {
  async createUser(userInputs) {
    try {
      console.log(userInputs);
      const user = await userModel.create(userInputs);

      return user;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create user"
      );
    }
  }
  async VerifyUser(req) {
    try {
      const user = await userModel.findOneAndUpdate(
        {
          userId: req.user.userId,
        },
        {
          $set: { isVerified: true },
        },
        { new: true }
      );

      return user;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create user"
      );
    }
  }
  async forgotUserPassword(email, newPassword, newSalt) {
    try {
      const user = await userModel.findOneAndUpdate(
        { email: email },
        { $set: { password: newPassword, salt: newSalt } },
        { new: true }
      );

      return user;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to update password"
      );
    }
  }

  async FindUser({ email }) {
    try {
      const existingUser = await userModel.findOne({ email: email });
      return existingUser;
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find user"
      );
    }
  }

  async UpdateUser(req, updateData) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        { userId: req.user.userId },
        updateData,
        { new: true }
      );
      return updatedUser;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find user"
      );
    }
  }

  
}
