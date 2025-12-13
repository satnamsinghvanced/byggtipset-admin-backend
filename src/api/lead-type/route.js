const express = require("express");
const router = express.Router();
const leadTypeController = require("./controller");

router.get("/", leadTypeController.getAllLeadTypes); 
router.get("/:id", leadTypeController.getLeadTypeById); 
router.post("/", leadTypeController.createLeadType); 
router.put("/:id", leadTypeController.updateLeadType);
router.delete("/:id", leadTypeController.deleteLeadType); 

module.exports = router;
