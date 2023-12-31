const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

// For handling errors outside express from synchronous code
// Synchronous code errors emits uncaughtException event , so we can cathc them using that
process.on("uncaughtException", (err) => {
  console.log("Unhandled Exception!! Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connection established"));

const app = require("./app");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Port = process.env.PORT || 5000;
const server = app.listen(Port, () => {
  console.log("Server started on port 5000");
});

// For handling errors outside express from asynchronous code
// aSynchronous code errors emits unhandledRejection event , so we can catch them using that
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection!! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// process.on("SIGTERM", () => {
//   console.log("SIGTERM recieved! Shutting down");
//   server.close(() => {
//     console.log("Process terminated");
//   });
// });
