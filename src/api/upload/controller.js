const uploadImage = require("../../../service/multer")
const csv = require("csv-parser");
const fs = require("fs");
const Company = require("../../../models/companies");
const Place = require("../../../models/places");
const County = require("../../../models/county");
const xlsx = require("xlsx");

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      fileUrl: req.file.path
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

exports.uploadCompanies = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const filePath = req.file.path;
    let rows = [];

    if (filePath.endsWith(".csv")) {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", async () => {
          await processRows(rows, res, filePath);
        });
    } else {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = xlsx.utils.sheet_to_json(sheet);
      await processRows(rows, res, filePath);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ----------------------------------------------------
async function processRows(rows, res, filePath) {
  try {
    let inserted = [];
    let skipped = [];

    for (const row of rows) {
      const companyName = row["Company name"]?.trim();

      if (!companyName) {
        skipped.push({ reason: "Missing company name", row });
        continue;
      }

      // Avoid duplicates
      const exists = await Company.findOne({ companyName });
      if (exists) {
        skipped.push({ reason: "Duplicate company", row });
        continue;
      }

      // Merge all Extractor columns:
      const extractorColumns = [
        "Extractor 1",
        "Extractor 2",
        "Extractor 3",
        "Extractor 4",
        "Extractor 4 4",
        "Extractor 4 5",
        "Extractor 4 6",
        "Extractor 4 7",
      ];

      const extractorArray = extractorColumns
        .map((col) => row[col])
        .filter((v) => v && v.trim().length > 0);

      // brokerSites as an array
      const brokerSitesArray = row["Meglersider"]
        ? [row["Meglersider"]]
        : [];

      const newCompany = await Company.create({
        companyName,
        companyImage: row["Company image"] || "",
        address: row["Address (competitor)"] || "",
        city: "",
        description: row["Company text"] || "",
        extractor: extractorArray,
        brokerSites: brokerSitesArray,
        websiteAddress: row["Website address"] || "",
      });

      inserted.push(newCompany);
    }

    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: "Company import completed",
      inserted: inserted.length,
      skipped: skipped.length,
      insertedItems: inserted,
      skippedItems: skipped,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


exports.uploadPlaces = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    let insertedPlaces = [];
    let insertedCounties = [];
    let skippedPlaces = [];
    let skippedCounties = [];

    // ------------------------------------------------------------------
    // STEP 1: Insert all Counties first (unique)
    // ------------------------------------------------------------------
    for (const row of rows) {
      const countyName = row["Fylke / County"]?.trim();

      if (!countyName) continue;

      // Check if county exists
      const countyExists = await County.findOne({ name: countyName });

      if (!countyExists) {
        const newCounty = await County.create({
          name: countyName,
          slug: countyName.toLowerCase().replace(/\s+/g, "-"),
          excerpt: "",
        });
        insertedCounties.push(newCounty);
      } else {
        skippedCounties.push({ reason: "Duplicate county", countyName });
      }
    }

    // ------------------------------------------------------------------
    // STEP 2: Insert Places with countyId
    // ------------------------------------------------------------------
    for (const row of rows) {
      const name = row["Actual place name"]?.trim();
      const slug = row["Place in url"]?.trim();
      const countyName = row["Fylke / County"]?.trim();

      if (!name || !slug || !countyName) {
        skippedPlaces.push({ reason: "Missing required fields", row });
        continue;
      }

      // Get countyId
      const county = await County.findOne({ name: countyName });

      if (!county) {
        skippedPlaces.push({ reason: "County not found after insert", row });
        continue;
      }

      // Prevent duplicate place
      const placeExists = await Place.findOne({
        name,
        countyId: county._id,
      });

      if (placeExists) {
        skippedPlaces.push({ reason: "Duplicate place", row });
        continue;
      }

      // Insert Place (City)
      const newPlace = await Place.create({
        name,
        slug,
        countyId: county._id,
        excerpt: row["Ingress"] || "",
        title: row["H1 (Title)"] || "",
        description: row["Rest of content"] || "",
        isRecommended: false,
        rank: 0,
        companiesId: [],
      });

      insertedPlaces.push(newPlace);
    }

    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: "Places + Counties imported successfully",
      countiesInserted: insertedCounties.length,
      countiesSkipped: skippedCounties.length,
      placesInserted: insertedPlaces.length,
      placesSkipped: skippedPlaces.length,
      insertedCounties,
      insertedPlaces,
      skippedCounties,
      skippedPlaces,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
