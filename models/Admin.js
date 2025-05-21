const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add the contact name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "please add the contact email"],
    },
    phone: {
      type: String,
      required: [true, "please add the contact phone"],
    },
    password: {
      type: String,
      required: [true, "please add the contact deignation"],
      minlength: 6,
    },
  },

  {
    timestamps: true,
  }
);
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
