const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
} = require("../controllers/adminControllers");
const { protect } = require("../middleware/auth");

router.post("/login", loginAdmin);
router.post("/", createAdmin);
router.get("/",  getAdmins);
router.get("/:id", protect, getAdmin);
router.put("/:id", protect, updateAdmin);
router.delete("/:id", protect, deleteAdmin);

module.exports = router;
