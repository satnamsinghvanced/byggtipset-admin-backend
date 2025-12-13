const County = require("../../../models/county");
const HomePage = require("../../../models/homepage");
const Place = require("../../../models/places");

const getOrCreateHomePage = async () => {
  let home = await HomePage.findOne();
  if (!home) {
    home = await HomePage.create({});
  }
  return home;
};

exports.getHeroSection = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.status(200).json({ success: true, data: home.heroSection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateHeroSection = async (req, res) => {
  try {
    console.log(req.body);
    const { title, subtitle, backgroundImage, buttonText, ctaLink } = req.body;
    const home = await getOrCreateHomePage();
    home.heroSection = {
      title,
      subtitle,
      backgroundImage,
      buttonText,
      ctaLink,
    };
    await home.save();
    res
      .status(200)
      .json({ success: true, message: "Hero section updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHowItWorks = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.status(200).json({
      success: true,
      data: {
        heading: home.howDoesItworks?.heading,
        cards: home.howDoesItworksCards,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateHowItWorks = async (req, res) => {
  try {
    const { heading, cards } = req.body; // cards = [{title, icon, description}]
    const home = await getOrCreateHomePage();
    home.howDoesItworks = { heading };
    if (Array.isArray(cards)) home.howDoesItworksCards = cards;
    await home.save();
    res
      .status(200)
      .json({ success: true, message: "How It Works section updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------------
// 3️⃣ Our Articles Heading
// -------------------------------
exports.getArticlesHeading = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.status(200).json({ success: true, data: home.articlesHeading });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateArticlesHeading = async (req, res) => {
  try {
    const { heading, buttonText, ctaLink } = req.body;
    const home = await getOrCreateHomePage();
    home.articlesHeading = { heading, buttonText, ctaLink };
    await home.save();
    res
      .status(200)
      .json({ success: true, message: "Articles heading updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategoryHeading = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.status(200).json({ success: true, data: home.ourArticlesHeading });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCategoryHeading = async (req, res) => {
  try {
    const { heading } = req.body;
    const home = await getOrCreateHomePage();
    home.ourArticlesHeading = { heading };
    await home.save();
    res
      .status(200)
      .json({ success: true, message: "Category heading updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWhyChoose = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.status(200).json({
      success: true,
      data: {
        heading: home.whyChooseMeglertipHeading?.heading,
        cards: home.whyChooseMeglertipCards,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateWhyChoose = async (req, res) => {
  try {
    const { heading, cards } = req.body;
    const home = await getOrCreateHomePage();
    home.whyChooseMeglertipHeading = { heading };
    if (Array.isArray(cards)) home.whyChooseMeglertipCards = cards;
    await home.save();
    res
      .status(200)
      .json({ success: true, message: "Why Choose section updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------------
// 5️⃣ City Section
// -------------------------------
exports.getCitySection = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.status(200).json({ success: true, data: home.citySectionHeading });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCitySection = async (req, res) => {
  try {
    const { title, description, ctaLink, buttonText , locations } = req.body;
    const home = await getOrCreateHomePage();
    home.citySectionHeading = { title, description, ctaLink, buttonText, locations };
    await home.save();
    res.status(200).json({ success: true, message: "City section updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFaqSection = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.status(200).json({ success: true, data: home.faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFaqSection = async (req, res) => {
  try {
    const { title } = req.body;
    const home = await getOrCreateHomePage();
    home.faq = { title };
    await home.save();
    res.status(200).json({ success: true, message: "Faq section updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------------
// 6️⃣ Pros Section
// -------------------------------
exports.getProsSection = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.status(200).json({ success: true, data: home.prosSection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProsSection = async (req, res) => {
  try {
    const { prosSection } = req.body; // array of objects
    const home = await getOrCreateHomePage();
    if (Array.isArray(prosSection)) home.prosSection = prosSection;
    await home.save();
    res.status(200).json({ success: true, message: "Pros section updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSeoSection = async (req, res) => {
  try {
    const home = await getOrCreateHomePage();
    res.status(200).json({ success: true, data: home.seo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSeoSection = async (req, res) => {
  try {
    const { seoSection } = req.body;
    const home = await getOrCreateHomePage();
    home.seo = seoSection;
    await home.save();
    res.status(200).json({ success: true, message: "Seo section updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const [counties, places] = await Promise.all([
      County.find().select("_id name slug").lean(),
      Place.find().select("_id name slug").lean(),
    ]);

    const data = [
      ...counties.map(c => ({
        id: c._id,
        name: c.name,
        slug: c.slug,
        locationType: "County",
      })),
      ...places.map(p => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        locationType: "Place",
      })),
    ];

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
      error: err.message,
    });
  }
};
