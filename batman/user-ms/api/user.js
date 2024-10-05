import userService from "../services/user-service.js";
import userModel from "../database/models/user.js";
const user = (app) => {
  const service = new userService();

  app.get("/", async (req, res, next) => {
    res
      .status(200)
      .json({ message: "Welcome to user microservice" });
  });

  app.post("/api/v1/auth/register", async (req, res, next) => {
    try {
      const { email } = req.body;

      const alreadyUser = await userModel.findOne({
        email
      });
      if (!alreadyUser) {
        const { data } = await service.SignUp(req.body);
        return res.json(data);
      } else {
        return res.status(400).json({ message: "user already registered" });
      }
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/v1/auth/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { data } = await service.SignIn({ email, password });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/v1/auth/forgotPassword", async (req, res, next) => {
    try {
      const { email } = req.body;
      const { data } = await service.forgotPasswordRequestUrl({ email });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post(
    "/api/v1/auth/forgotPassword/verify/:emailId/:token",
    async (req, res, next) => {
      try {
        const { emailId, token } = req.params;
        const { newPassword } = req.body;
        const { data } = await service.forgotUserPassword(
          req,
          token,
          emailId,
          newPassword
        );
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
  app.get("/api/v1/auth/verify/:token", async (req, res, next) => {
    try {
      const { token } = req.params;
      const { data } = await service.Verify(req, token);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/v1/auth/verifyUser", async (req, res, next) => {
    try {
      const { userAuthToken: token } = req.cookies;
      if (!token) return res.json({ message: "token is required" });
      const { data } = await service.VerifyToken(req, token);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};

export default user;
