const asyncHandler = require("express-async-handler");
const Transaksi = require("../models/Transaksi");
const snap = require("../config/midtrans.js");

// Get all transaksi
const getTransaksis = asyncHandler(async (req, res) => {
  const transaksi = await Transaksi.find();
  res.status(200).json(transaksi);
});

// Create transaksi with Midtrans integration
const createTransaksi = asyncHandler(async (req, res) => {
  const requiredFields = [
    "id_pendaki",
    "jenis_transaksi",
    "jumlah",
    "metode_pembayaran",
    "tanggal_transaksi",
  ];

  // Validate required fields
  for (const field of requiredFields) {
    if (!req.body[field]) {
      res.status(400);
      throw new Error(`${field} is required`);
    }
  }

  // Validate jumlah as integer
  const jumlah = parseInt(req.body.jumlah);
  if (isNaN(jumlah) || jumlah <= 0) {
    res.status(400);
    throw new Error("Jumlah must be a positive integer");
  }

  try {
    const transaksi = new Transaksi({
      ...req.body,
      jumlah: jumlah,
      status_pembayaran: "PENDING",
    });

    const parameter = {
      transaction_details: {
        order_id: transaksi._id.toString(), // Use _id as order_id
        gross_amount: jumlah,
      },
      customer_details: {
        first_name: req.body.nama || "Customer",
        email: req.body.email || "customer@example.com",
        phone: req.body.phone || "08123456789",
      },
    };

    const snapResponse = await snap.createTransaction(parameter);
    
    transaksi.snap_token = snapResponse.token;
    transaksi.snap_redirect_url = snapResponse.redirect_url;

    await transaksi.save();

    // 6. Send response with payment information
    res.status(201).json({
      _id: transaksi._id,
      snap_token: transaksi.snap_token,
      redirect_url: transaksi.snap_redirect_url,
      status: transaksi.status_pembayaran,
    });

  } catch (error) {
    console.error("Midtrans Error:", error);
    res.status(500).json({
      error: "Payment gateway error",
      message: error.message || "Failed to process payment",
    });
  }
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

const getTotalProfit = async (req, res) => {
  try {
    const transaksi = await Transaksi.find(); 

    const totalJumlah = transaksi.reduce((total, item) => {
      return total + (item.jumlah || 0);
    }, 0);

    res.json({ totalJumlah });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghitung total", error: err });
  }
};
const getJumlahTransaksi = async (req, res) => {
  try {
    const jumlah = await Transaksi.countDocuments();
    res.json({ jumlah });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghitung pendaki" });
  }
};

module.exports = {
  getTransaksis,
  createTransaksi,
  getTransaksi,
  updateTransaksi,
  deleteTransaksi,
  getTotalProfit,
  getJumlahTransaksi,
};