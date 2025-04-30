const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // Import multer upload
const {
  getPendakis,
  createPendaki,
  getPendaki,
  updatePendaki,
  deletePendaki,
  uploadFotoPendaki,
} = require("../controllers/pendakiControllers");

// Routes
router.route("/").get(getPendakis);
router.route("/").post(createPendaki);
router.route("/:id").get(getPendaki);
router.route("/:id").put(updatePendaki);
router.route("/:id").delete(deletePendaki);

// Route untuk upload foto
router.post("/upload/:id", upload.single("ktpKartuPelajar"), uploadFotoPendaki);

module.exports = router;
