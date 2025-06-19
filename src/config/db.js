const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database using the MONGO_URI from environment variables.
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is successfully established
 * @throws {Error} If the connection fails, logs the error and exits the process with code 1
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
