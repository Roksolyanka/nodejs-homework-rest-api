import fs from "fs/promises";
import Contact from "../models/Contact.js";
import { HttpError, cloudinary } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

// !------------------------------------GET ALL-----------------------------------

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const filter = { owner };

  if (favorite === "true") {
    filter.favorite = true;
  } else if (favorite === "false") {
    filter.favorite = false;
  }

  const result = await Contact.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");
  res.json(result);
};

// !------------------------------------GET BY ID-----------------------------------

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

// !------------------------------------ADD-----------------------------------

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath } = req.file;
  const { url: photoURL } = await cloudinary.uploader.upload(oldPath, {
    folder: "photos",
  });
  await fs.unlink(oldPath);
  const result = await Contact.create({ ...req.body, photoURL, owner });
  res.status(201).json(result);
};

// !------------------------------------DELETE BY ID-----------------------------------

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json({ message: "Contact deleted" });
};

// !------------------------------------UPDATE-----------------------------------

const update = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

// !------------------------------------UPDATE STATUS CONTACT-----------------------------------

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  update: ctrlWrapper(update),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
