const express = require("express");
const router = express.Router();
const {
  getTransaksis,
  createTransaksi,
  getTransaksi,
  updateTransaksi,
  deleteTransaksi,
} = require("../controllers/transaksiController");

// Routes
router.route("/").get(getTransaksis).post(createTransaksi);

router
  .route("/:id")
  .get(getTransaksi)
  .put(updateTransaksi)
  .delete(deleteTransaksi);

module.exports = router; 
