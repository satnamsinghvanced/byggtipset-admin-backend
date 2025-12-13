const express = require("express");
const router = express.Router();
const {
  create,
  getPartner,
  getPartnerById,
  update,
  deletePartner
} = require("../partner/controller");
const uploadImage = require("../../../service/multer");

router.post("/create", uploadImage.single("image"), create);
router.get("/", getPartner);
router.get("/:id", getPartnerById);
router.put("/update/:id", uploadImage.single("image"), update);
router.delete("/delete/:id", deletePartner )


module.exports = router;
