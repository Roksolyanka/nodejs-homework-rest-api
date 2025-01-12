import express from "express";
import authController from "../../controllers/auth-controller.js";
import * as userSchemas from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";
import { authenticate, uploadAvatar } from "../../middlewares/index.js";

const authRouter = express.Router();

const userSignUpValidate = validateBody(userSchemas.userSignUpSchema);
const userEmailValidate = validateBody(userSchemas.userEmailSchema);
const userSignInValidate = validateBody(userSchemas.userSignInSchema);
const userUpdateSubscriptionValidate = validateBody(
  userSchemas.userUpdateSubscriptionSchema
);

authRouter.post("/register", userSignUpValidate, authController.signUp);
authRouter.get("/verify/:verificationToken", authController.verify);
authRouter.post("/verify", userEmailValidate, authController.resendVerifyEmail);
authRouter.post("/login", userSignInValidate, authController.signIn);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.patch(
  "/",
  authenticate,
  userUpdateSubscriptionValidate,
  authController.updateSubscription
);
authRouter.patch(
  "/avatars",
  authenticate,
  uploadAvatar.single("avatar"),
  authController.updateAvatar
);
authRouter.post("/logout", authenticate, authController.signOut);

export default authRouter;
