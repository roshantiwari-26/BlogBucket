const multer = require("multer");
const path = require("path");
const AppError = require("../config/AppError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileDest = path.join(__dirname, "..", "uploads", "profiles");
    cb(null, fileDest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const profileUpload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg")
      cb(null, true);
    else cb(new AppError("File type not allowed", 400), false);
  },
});

module.exports = profileUpload;
