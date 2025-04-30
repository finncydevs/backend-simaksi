const asyncHandler = require("express-async-handler");
const Transaksi = require("../models/Transaksi");

// Get all transaksi
const getTransaksis = asyncHandler(async (req, res) => {
  const transaksi = await Transaksi.find();
  res.status(200).json(transaksi); // Konsisten tanpa wrapper object
});
const createTransaksi = asyncHandler(async (req, res) => {
  const requiredFields = [
    "id_pendaki",
    "jenis_transaksi",
    "jumlah",
    "metode_pembayaran",
    "tanggal_transaksi",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      res.status(400);
      throw new Error(`${field} is required`);
    }
  }

  const transaksi = await Transaksi.create(req.body);

  if (global.sendQRCode && req.body.phone) {
    try {
      await global.sendQRCode(req.body.phone, transaksi._id.toString());
      console.log("QR Code sent to WhatsApp!");
    } catch (err) {
      console.error("Gagal kirim QR Code:", err);
    }
  }

  res.status(201).json(transaksi);
});

// Get single transaksi
const getTransaksi = asyncHandler(async (req, res) => {
  const transaksi = await Transaksi.findById(req.params.id);
  if (!transaksi) {
    res.status(404);
    throw new Error("Transaksi not found");
  }
  res.status(200).json(transaksi);
});

// Update transaksi
const updateTransaksi = asyncHandler(async (req, res) => {
  const updated = await Transaksi.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    res.status(404);
    throw new Error("Transaksi not found");
  }
  res.status(200).json(updated);
});

// Delete transaksi
const deleteTransaksi = asyncHandler(async (req, res) => {
  const transaksi = await Transaksi.findByIdAndDelete(req.params.id);
  if (!transaksi) {
    res.status(404);
    throw new Error("Transaksi not found");
  }
  res.status(200).json(transaksi); 
});

module.exports = {
  getTransaksis,
  createTransaksi,
  getTransaksi,
  updateTransaksi,
  deleteTransaksi,
};
