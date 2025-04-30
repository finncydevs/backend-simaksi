// @desc get all
// @route get /api/contacts
// @acces publis
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");

const { errorMessages } = require("vue/compiler-sfc");

const getAdmins = asyncHandler(async (req, res) => {
  const admin = await Admin.find();

  res.status(200).json({ admin });
});

// @desc create new contacts
// @route POST /api/contacts
// @acces publis

const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error("all fields are required");
  }
  const admin = await Admin.create({
    name,
    email,
    phone,
    password,
  });
  res.status(201).json(admin);
});
// @desc create new contacts
// @route PUT /api/contact/:id
// @acces publis

const getAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    res.status(404);
    throw new Error("id doesnt exist");
  }
  res.status(200).json(admin);
});

// @desc create new contacts
// @route PUT /api/contact/:id
// @acces publis
const updateAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    res.status(404);
    throw new Error("id doesnt exist");
  }
  const updateAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updateAdmin);
});

// @desc delete contacts
// @route delete /api/contact/:id
// @acces publis
const deleteAdmin = asyncHandler(async (req, res) => {
  const contact = await Admin.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("id doesnt exist");
  }
  await Admin.deleteOne({ _id: req.params.id });

  // const deletedContact = await Contact.findByIdAndDelete(
  //   req.params.id,
  //   req.body,
  //   { new: true }
  // );
  res.status(200).json({ message: `id deleted for ${admin}` });
});
module.exports = {
  getAdmins,
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
