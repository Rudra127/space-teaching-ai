import { userRepository } from "../database/index.js";
import {
  formateData,
  generateSalt,
  generatePassword,
  validateSignatureAndSendData,
  generateForgotPasswordSignature,
  validatePassword,
  validateSignature,
  generateSignature,
} from "../utils/index.js";
import { APIError } from "../utils/app-errors.js";

// All Business logic will be here
export default class userService {
  constructor() {
    this.repository = new userRepository();
  }
  async SignUp(userInputs) {
    const { email, password } = userInputs;

    try {
      // create salt
      let salt = await generateSalt();
      userInputs.password = await generatePassword(password, salt);

      userInputs.salt = salt;

      const existingUser = await this.repository.createUser(userInputs);

      const token = await generateSignature({
        email: email,
        userId: existingUser.userId,
      });
      const userUrl = `${process.env.MAIN_BACKEND_URL}/api/v1/user/auth/verify/${token}`;
      console.log(userUrl);
      return formateData({
        message: "verify your email address",
        verificationUrl: userUrl,
      });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    try {
      const existingUser = await this.repository.FindUser({ email });

      if (existingUser && existingUser.isVerified) {
        const validPassword = await validatePassword(
          password,
          existingUser.password,
          existingUser.salt
        );

        if (validPassword) {
          const token = await generateSignature({
            email: existingUser.email,
            userId: existingUser.userId,
          });
          return formateData({
            userId: existingUser.userId,
            token,
            loggedIn: true,
          });
        }
      }

      return formateData({
        message: "password is invalid",
        loggedIn: false,
      });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async forgotPasswordRequestUrl(userInputs) {
    const { email } = userInputs;

    try {
      const existingUser = await this.repository.FindUser({ email });

      if (existingUser && existingUser.isVerified) {
        const token = await generateForgotPasswordSignature({
          email: existingUser.email,
        });
        const emailId = existingUser.email;
        const forgotPasswordUrl = `${process.env.MAIN_BACKEND_URL}/auth/forgotPassword/${emailId}/${token}`;
        console.log(forgotPasswordUrl);
        sendUserForgotPasswordLink(email, forgotPasswordUrl);
        return formateData({
          message: "you will be able to forgot your password using this link",
          forgotPasswordUrl,
        });
      }

      return formateData({
        message: "please verify your email first",
      });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async forgotUserPassword(req, token, emailId, newPassword) {
    try {
      const ValidatedSignature = await validateSignatureAndSendData(req, token);
      console.log(emailId);
      if (
        ValidatedSignature.isValid == true &&
        ValidatedSignature.data.email == emailId
      ) {
        const newSalt = await generateSalt();
        const password = await generatePassword(newPassword, newSalt);
        const user = await this.repository.forgotUserPassword(
          emailId,
          password,
          newSalt
        );
        if (user) {
          return formateData({
            message: "Password updated successfully.",
          });
        } else {
          return formateData({
            message: "User not found.",
          });
        }
      } else {
        return formateData({
          message: "Invalid or expired token.",
        });
      }
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
  async Verify(req, token) {
    try {
      // console.log("token", token);
      const ValidatedSignature = await validateSignature(req, token);
      if (ValidatedSignature) {
        const data = await this.repository.VerifyUser(req);
        return formateData({
          message: "user verified successfully.",
        });
      }
      return formateData({
        message: "please verify your email first",
      });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async VerifyToken(req, token) {
    try {
      // console.log("token", token);
      const ValidatedSignature = await validateSignature(req, token);

      if (ValidatedSignature) {
        const user = await this.repository.FindUser({
          email: req.user.email,
        });
        console.log("user form here", user);
        return formateData({
          message: "user is authenticated",
          status: "authenticated",
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userId: user.userId,
          profileImagePath: user.profileImagePath,
          loggedIn: true,
        });
      }
      return formateData({
        message: "please verify your email first",
      });
    } catch (err) {
      throw new APIError("Data Not found ok ok ", err);
    }
  }
}
