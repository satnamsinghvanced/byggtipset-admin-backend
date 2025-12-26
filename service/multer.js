const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const baseName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_")       // ✅ remove spaces
      .replace(/[^a-zA-Z0-9_-]/g, ""); // ✅ remove special chars

    const fileName = `${baseName}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "text/csv",
    "image/svg+xml",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPEG, JPG, PNG, WEBP, SVG, CSV, XLS, XLSX files are allowed"
      ),
      false
    );
  }
};

const uploadImage = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter,
});

module.exports = uploadImage;
