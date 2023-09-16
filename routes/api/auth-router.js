import express from "express";
import authController from "../../controllers/auth-controller.js";
import * as userSchemas from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";

const authRouter = express.Router();

const userSignUpValidate = validateBody(userSchemas.userSignUpSchema)
const userSignInValidate = validateBody(userSchemas.userSignInSchema);

authRouter.post("/register", userSignUpValidate, authController.signUp);
authRouter.post("/login", userSignInValidate, authController.signIn);

export default authRouter;