import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import * as contactSchemas from "../../models/Contact.js";
import { validateBody } from "../../decorators/index.js";
import { isValidId } from "../../middlewares/index.js";

const contactAddValidate = validateBody(contactSchemas.contactAddSchema);
const contactUpdateFavoriteValidate = validateBody(
  contactSchemas.contactUpdateFavoriteSchema
);

const router = express.Router();

router.get("/", contactsController.getAll);

router.get("/:contactId", isValidId, contactsController.getById);

router.post("/", contactAddValidate, contactsController.add);

router.delete("/:contactId", isValidId, contactsController.deleteById);

router.put(
  "/:contactId",
  isValidId,
  contactAddValidate,
  contactsController.update
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  contactUpdateFavoriteValidate,
  contactsController.updateStatusContact
);

export default router;
