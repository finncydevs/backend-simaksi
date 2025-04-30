const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const { errorHandler } = require("./middleware/errorHandler");
const connectDB = require("./connections/dbConn");


dotenv.config(); // Load environment variables
connectDB();

const app = express();
app.use(cors()); // 🔹 Enable CORS for all origins
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const port = process.env.PORT || 3000;
app.use("/api/admins", require("./routes/contactRoutes"));
app.use("/api/pendakis", require("./routes/pendakiRoutes"));
app.use("/api/pemandus", require("./routes/pemanduRoutes"));
app.use("/api/transaksis", require("./routes/transaksiRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
