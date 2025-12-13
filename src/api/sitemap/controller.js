
const article = require("../../../models/article");
const companies = require("../../../models/companies");
const county = require("../../../models/county");
const places = require("../../../models/places");


exports.getCompanies = async (req, res) => {
  try {
    const listOfCompanies = await companies.find().select("slug");
    res.json({data:listOfCompanies});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getPlaces = async (req, res) => {
  try {
    const listOfPlaces = await places.find().select("slug");
    res.json({data:listOfPlaces});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getArticles = async (req, res) => {
  try {
    const listOfArticles = await article.find().populate("categoryId", "title slug").select("slug");
    res.json({data:listOfArticles});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getCounties = async (req, res) => {
  try {
    const listOfCounties = await county.find().select("slug");
    res.json({data:listOfCounties});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
// exports.getCompanies = async (req, res) => {
//   try {
//     const companies = await companies.find();
//     res.json(companies);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
