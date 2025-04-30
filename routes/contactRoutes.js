const express = require("express");
const router = express.Router();
const {
  getAdmins,
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  // loginAdmin,
} = require("../controllers/contactControllers");

router.route("/").get(getAdmins);
router.route("/").post(createAdmin);
router.route("/:id").get(getAdmin);
router.route("/:id").put(updateAdmin);
router.route("/:id").delete(deleteAdmin);
module.exports = router;
