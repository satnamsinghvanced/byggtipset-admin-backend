const express = require("express");
const router = express.Router();
const {
  CreateFormSelect,
  GetAllForms,
  GetSingleForm,
  UpdateFormSelect,
  DeleteForm,
} = require("./controller");

router.post("/", CreateFormSelect);
router.get("/", GetAllForms);
router.get("/:id", GetSingleForm);
router.put("/:id", UpdateFormSelect);
router.delete("/:id", DeleteForm);

module.exports = router;
