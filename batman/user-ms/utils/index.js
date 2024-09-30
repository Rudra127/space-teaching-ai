import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET, APP_SECRET2 } from "../config/index.js";

//Utility functions
export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generatePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await generatePassword(enteredPassword, salt)) === savedPassword;
};

export const generateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const validateSignature = async (req, signature) => {
  try {
    console.log(signature);
    const payload = await jwt.verify(signature, APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const generateForgotPasswordSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET2, { expiresIn: "1h" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const validateSignatureAndSendData = async (req, signature) => {
  try {
    console.log(signature);
    const payload = await jwt.verify(signature, APP_SECRET2, { expiresIn: "24h" });
    req.user = payload;
    return {
      isValid: true,
      data: payload,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const formateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
