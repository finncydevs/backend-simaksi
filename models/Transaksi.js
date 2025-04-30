const mongoose = require("mongoose");

const TransaksiSchema = new mongoose.Schema(
  {
    id_pendaki: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pendaki",
      required: true,
    },
    jenis_transaksi: {
      type: String,
      required: true,
    },
    jumlah: {
      type: Number,
      required: true,
    },
    metode_pembayaran: {
      type: String,
      required: true,
    },
    tanggal_transaksi: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaksi = mongoose.model("Transaksi", TransaksiSchema);

module.exports = Transaksi;
