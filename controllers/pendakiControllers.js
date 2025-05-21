const asyncHandler = require("express-async-handler");
const Pendaki = require("../models/Pendaki");

// @desc Get all pendaki
// @route GET /api/pendakis
// @access Public

// @desc Create new pendaki
// @route POST /api/pendakis
// @access Public
const createPendaki = asyncHandler(async (req, res) => {
  const {
    nama,
    email,
    phone,
    alamat,
    umur,
    gender,
    tanggalMasuk,
    tanggalDaki,
    ktpKartuPelajar,
    pemandu,
  } = req.body;

  if (
    !nama ||
    !email ||
    !phone ||
    !alamat ||
    !umur ||
    !gender ||
    !tanggalMasuk ||
    !tanggalDaki ||
    !pemandu
  ) {
    res.status(400);
    throw new Error("Semua field harus diisi");
  }

  const pendaki = await Pendaki.create({
    nama,
    email,
    phone,
    alamat,
    umur,
    gender,
    tanggalMasuk,
    tanggalDaki,
    ktpKartuPelajar: "",
    pemandu,
  });

  res.status(201).json(pendaki);
});

const uploadFotoPendaki = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  try {
    const updatedPendaki = await Pendaki.findByIdAndUpdate(
      req.params.id,
      { ktpKartuPelajar: `/uploads/${req.file.filename}` },
      { new: true }
    );

    if (!updatedPendaki) {
      return res.status(404).json({ message: "Pendaki tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Foto berhasil diupload",
      filePath: updatedPendaki.ktpKartuPelajar,
    });
  } catch (error) {
    res.status(500).json({ message: "Foto gagal diupload", error });
  }
});

const getPendakis = asyncHandler(async (req, res) => {
  const pendakis = await Pendaki.find();
  res.status(200).json({ pendakis });
});
// @desc Get single pendaki
// @route GET /api/pendakis/:id
// @access Public
const getPendaki = asyncHandler(async (req, res) => {
  const pendaki = await Pendaki.findById(req.params.id);
  if (!pendaki) {
    res.status(404);
    throw new Error("Pendaki tidak ditemukan");
  }
  res.status(200).json(pendaki);
});

// @desc Update pendaki
// @route PUT /api/pendakis/:id
// @access Public
const updatePendaki = asyncHandler(async (req, res) => {
  const pendaki = await Pendaki.findById(req.params.id);
  if (!pendaki) {
    res.status(404);
    throw new Error("Pendaki tidak ditemukan");
  }

  const updatedPendaki = await Pendaki.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedPendaki);
});

// @desc Delete pendaki
// @route DELETE /api/pendakis/:id
// @access Public
const deletePendaki = asyncHandler(async (req, res) => {
  const pendaki = await Pendaki.findById(req.params.id);
  if (!pendaki) {
    res.status(404);
    throw new Error("Pendaki tidak ditemukan");
  }

  await Pendaki.deleteOne({ _id: req.params.id });

  res
    .status(200)
    .json({ message: `Pendaki dengan ID ${req.params.id} dihapus` });
});

const getJumlahPendaki = async (req, res) => {
  try {
    const jumlah = await Pendaki.countDocuments();
    res.json({ jumlah });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghitung pendaki" });
  }
};

module.exports = {
  getPendakis,
  createPendaki,
  getPendaki,
  updatePendaki,
  deletePendaki,
  uploadFotoPendaki,
  getJumlahPendaki,
};
