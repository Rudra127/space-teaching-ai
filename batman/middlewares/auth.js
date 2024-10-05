import { ValidateSignature } from "../../utils/index.js";

const auth = async (req, res, next) => {
  const userAuthToken = req.cookies?.userAuthToken;

  const isAuthorized = await ValidateSignature(req, userAuthToken);

  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({ message: "Not Authorized" });
};

export default auth;
