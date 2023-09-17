import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { userUpdateSubscriptionSchema } from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
const { JWT_SECRET } = process.env;

// !------------------------------------REGISTER-----------------------------------

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

// !------------------------------------LOG IN-----------------------------------

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
  });
};

// !------------------------------------GET CURRENT-----------------------------------

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

// !------------------------------------LOG OUT-----------------------------------

const signOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204);
};

// !------------------------------------UPDATE SUBSCRIPTION-----------------------------------

const updateSubscription = async (req, res) => {
  const { _id: userId } = req.user;
  const { subscription } = req.body;

  const { error } = userUpdateSubscriptionSchema.validate({ subscription });
  if (error) {
    throw HttpError(400, error.message);
  }

  const userUpdated = await User.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true }
  );

  if (!userUpdated) {
    throw HttpError(404, "User not found");
  }

  res.json(userUpdated);
};

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  updateSubscription: ctrlWrapper(updateSubscription),
};
