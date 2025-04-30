const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database connected:",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process with an error code
  }
};

module.exports = connectDB;
