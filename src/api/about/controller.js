const About = require("../../../models/about");
const slugify = require("slugify");

exports.createAbout = async (req, res) => {
  try {
    const data = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : data.image;

    const about = await About.create({
      ...data,
      image: imagePath,

      slug: data.slug || slugify(data.heading || "about", { lower: true, strict: true }),
    });

    res.status(201).json({
      success: true,
      message: "About page created successfully",
      data: about,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne() || {};
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getSingleAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about)
      return res.status(404).json({ success: false, message: "Record not found" });

    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateAbout = async (req, res) => {
  try {
    const data = req.body;

    let about = await About.findOne();

    const imagePath = req.file ? `/uploads/${req.file.filename}` : data.image;

    if (!about) {
      about = new About({
        ...data,
        image: imagePath,
        slug: data.slug || slugify(data.heading || "about", { lower: true, strict: true }),
      });
    } else {
      Object.assign(about, {
        ...data,
        image: imagePath,
      });

      if (data.heading) {
        about.slug = slugify(data.heading, { lower: true, strict: true });
      }
    }

    await about.save();

    res.json({
      success: true,
      message: "About page updated successfully",
      data: about,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);
    if (!about)
      return res.status(404).json({ success: false, message: "Record not found" });

    res.json({
      success: true,
      message: "About deleted successfully",
      data: about,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
