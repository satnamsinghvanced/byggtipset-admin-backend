const express = require("express")
const { getFooter, saveFooter ,updateFooterSettings} = require( "./controller");

const router = express.Router();

router.get("/", getFooter);     
router.post("/", saveFooter);    
router.put("/update", updateFooterSettings);    

module.exports = router;
