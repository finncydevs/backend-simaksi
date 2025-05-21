const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");


// Buat JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Daftar admin
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists with that email");
  }

  const admin = await Admin.create({ name, email, phone, password });

  res.status(201).json({
    id: admin._id,
    email: admin.email,
    token: generateToken(admin._id),
  });
});

// Login admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Email or password incorrect");
  }

  res.json({
    token: generateToken(admin._id),
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
    },
  });
});
const getAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json({ admins });
});

const getAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }
  res.status(200).json(admin);
});
const updateAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }
  const { name, email, phone, password } = req.body;
  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.params.id,
    { name, email, phone, password }, // Only update allowed fields
    { new: true }
  );
  res.status(200).json(updatedAdmin);
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }
  await Admin.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Admin deleted" });
});

module.exports = {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
};
