const express = require("express");
const router = express.Router();
const controller = require("./controller")

router.post("/", controller.createForm); 


router.put("/update", controller.updateForm); 


router.get("/", controller.getFormById); 

router.get("/details", controller.getForm) 


router.post("/form-steps/:formId", controller.addStepToForm);
router.get("/form-steps/:formId", controller.getStepsOfForm);
router.put("/form-steps/:formId/:stepId", controller.updateStep);
router.delete("/form-steps/:formId/:stepId", controller.deleteStep);
module.exports = router;
