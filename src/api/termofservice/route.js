const express = require("express");
const router = express.Router();
const {
  createTermOfService,
  getAllTermOfService,
  getTermOfServiceId,
  updateTermOfService,
  deleteTermOfService,
} = require("../termofservice/controller");

router.post("/create", createTermOfService);
router.get("/", getAllTermOfService);
router.get("/:id", getTermOfServiceId);
router.put("/update/:id", updateTermOfService);
router.delete("/delete/:id", deleteTermOfService);

module.exports = router;
