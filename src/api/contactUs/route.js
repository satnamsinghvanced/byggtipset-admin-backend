const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("./controller");

router.get("/", getContacts);
router.get("/:id", getContactById);
router.put("/update/:id", updateContact);
router.delete("/delete/:id", deleteContact);

module.exports = router;
