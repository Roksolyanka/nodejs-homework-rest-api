import express from "express";
import authController from "../../controllers/auth-controller.js";
import * as userSchemas from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";
import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

const userSignUpValidate = validateBody(userSchemas.userSignUpSchema);
const userSignInValidate = validateBody(userSchemas.userSignInSchema);
const userUpdateSubscriptionValidate = validateBody(
  userSchemas.userUpdateSubscriptionSchema
);

authRouter.post("/register", userSignUpValidate, authController.signUp);
authRouter.post("/login", userSignInValidate, authController.signIn);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.patch(
  "/",
  authenticate,
  userUpdateSubscriptionValidate,
  authController.updateSubscription
);
authRouter.post("/logout", authenticate, authController.signOut);

export default authRouter;
