const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function connect() {
  try {
    // await mongoose.connect(process.env.MONGODB_URL, {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connect succesfully!");
  } catch (error) {
    console.log("Database connect failled!");
  }
}

module.exports = { connect };
