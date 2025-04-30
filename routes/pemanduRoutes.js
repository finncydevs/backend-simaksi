const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();
const {
  getPemandus,
  createPemandu,
  getPemandu,
  updatePemandu,
  deletePemandu,
  uploadFotoPemandu,
} = require("../controllers/pemanduControllers");

router.route("/").get(getPemandus);
router.route("/").post(createPemandu);
router.route("/:id").get(getPemandu);
router.route("/:id").put(updatePemandu);
router.route("/:id").delete(deletePemandu);
router.post("/upload", upload.single("photo"), uploadFotoPemandu);
module.exports = router;
