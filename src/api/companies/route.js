const express = require("express");
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompaniesAll,
} = require("../companies/controller");

const router = express.Router();

router.post("/create", createCompany);
router.get("/", getCompanies);
router.get("/all", getCompaniesAll);
router.get("/detail/:id", getCompanyById);
router.put("/update/:id", updateCompany);
router.delete("/delete/:id", deleteCompany);

module.exports = router;
