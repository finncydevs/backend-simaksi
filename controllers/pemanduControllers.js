const asyncHandler = require("express-async-handler");
const Pemandu = require("../models/Pemandu");

// @desc Get all pemandu
// @route GET /api/pemandu
// @access public
const getPemandus = asyncHandler(async (req, res) => {
  const pemandu = await Pemandu.find();
  res.status(200).json({ pemandu });
});

// @desc Create new pemandu
// @route POST /api/pemandu
// @access public
const createPemandu = asyncHandler(async (req, res) => {
  const { name, email, phone, photo } = req.body;
  if (!name || !email || !phone || !photo) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const pemandu = await Pemandu.create({ name, email, phone, photo });
  res.status(201).json(pemandu);
});


const uploadFotoPemandu = async (req, res) => { 
  if(!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  try {
    const newPemandu = new Pemandu({
      nama: req.body.nama,
      photo: `/upoads/${req.file.filename}`,
    })

    await newPemandu.save()
    res.json({succes: true, data: newPemandu})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

// @desc Get single pemandu
// @route GET /api/pemandu/:id
// @access public
const getPemandu = asyncHandler(async (req, res) => {
  const pemandu = await Pemandu.findById(req.params.id);
  if (!pemandu) {
    res.status(404);
    throw new Error("ID doesn't exist");
  }
  res.status(200).json(pemandu);
});

// @desc Update pemandu
// @route PUT /api/pemandu/:id
// @access public
const updatePemandu = asyncHandler(async (req, res) => {
  const updatedPemandu = await Pemandu.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updatedPemandu) {
    res.status(404);
    throw new Error("ID doesn't exist");
  }
  res.status(200).json(updatedPemandu);
});

// @desc Delete pemandu
// @route DELETE /api/pemandu/:id
// @access public
const deletePemandu = asyncHandler(async (req, res) => {
  const pemandu = await Pemandu.findById(req.params.id);
  if (!pemandu) {
    res.status(404);
    throw new Error("ID doesn't exist");
  }
  await Pemandu.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: `Pemandu with ID ${req.params.id} deleted` });
});

module.exports = {
  getPemandus,
  createPemandu,
  getPemandu,
  updatePemandu,
  deletePemandu,
  uploadFotoPemandu,
};
