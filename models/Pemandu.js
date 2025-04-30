const mongoose = require("mongoose")

const pemanduSchema = new mongoose.Schema(
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
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pemandu', pemanduSchema)