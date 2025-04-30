const mongoose = require("mongoose");

const pendakiSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Silakan masukkan nama"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Silakan masukkan email"],
    },
    phone: {
      type: String,
      required: [true, "Silakan masukkan nomor telepon"],
    },
    alamat: {
      type: String,
      required: [true, "Silakan masukkan alamat"],
    },
    umur: {
      type: Number,
      required: [true, "Silakan masukkan umur"],
    },
    gender: {
      type: String,
      enum: ["Laki Laki", "Perempuan"],
      required: [true, "Pilih jenis kelamin"],
    },
    tanggalMasuk: {
      type: Date,
      required: [true, "Silakan masukkan tanggal masuk"],
    },
    tanggalDaki: {
      type: Date,
      required: [true, "Silakan masukkan tanggal daki"],
    },
    ktpKartuPelajar: {
      type: String,
    },
    pemandu: {
      type: String,
      enum: ["Ya", "Tidak"],
    },
  },
  {
    timestamps: true,
  },
  { collection: "pendakis" }
);

module.exports = mongoose.model("Pendaki", pendakiSchema);
