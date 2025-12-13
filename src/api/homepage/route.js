const express = require("express");
const controller = require("./controllers")
const uploadImage = require("../../../service/multer");
const router = express.Router();

// Hero
router.get("/hero", controller.getHeroSection);
router.put("/hero", controller.updateHeroSection);

// How it works
router.get("/how-it-works", controller.getHowItWorks);
router.put("/how-it-works", controller.updateHowItWorks);

// Articles
router.get("/articles-heading", controller.getArticlesHeading);
router.put("/articles-heading", controller.updateArticlesHeading);


// category
router.get("/category-heading", controller.getCategoryHeading);
router.put("/category-heading", controller.updateCategoryHeading);

// Why Choose
router.get("/why-choose", controller.getWhyChoose);
router.put("/why-choose", controller.updateWhyChoose);

// City
router.get("/city", controller.getCitySection);
router.put("/city", controller.updateCitySection);

router.get("/faq", controller.getFaqSection);
router.put("/faq", controller.updateFaqSection);


router.get("/seo", controller.getSeoSection);
router.put("/seo", controller.updateSeoSection);


// Pros
router.get("/pros", controller.getProsSection);
router.put("/pros", controller.updateProsSection);

router.get("/locations", controller.getLocations);



module.exports = router;
