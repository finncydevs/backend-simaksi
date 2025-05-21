const express = require("express");
const router = express.Router();
const {
  getTransaksis,
  createTransaksi,
  getTransaksi,
  updateTransaksi,
  deleteTransaksi,
  getTotalProfit,
  getJumlahTransaksi,
} = require("../controllers/transaksiController");

// Routes
router.route("/").get(getTransaksis).post(createTransaksi);
router.route("/total").get(getTotalProfit); // Route untuk mendapatkan total profit
router.route("/jumlah").get(getJumlahTransaksi); // Route untuk mendapatkan jumlah transaksi

router
  .route("/:id")
  .get(getTransaksi)
  .put(updateTransaksi)
  .delete(deleteTransaksi);

module.exports = router; 
