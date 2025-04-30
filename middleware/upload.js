const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    if (!req.params.id) {
      return cb(new Error("ID pendaki tidak ditemukan"), null);
    }
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.id}${ext}`); // Rename file dengan ID pendaki
  },
});

const upload = multer({ storage });

module.exports = upload;
