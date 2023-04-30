const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./app/router/index");
const mongoConncetion = require("./app/database/database");
const app = express();
const paypal = require("paypal-rest-sdk");
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config.env" });
}
const port = process.env.PORT || 8098;

mongoConncetion();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://frontend-clinic-iota.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

app.listen(port, err => {
  if (err) {
    return console.log("Connection error");
  }
  return console.log(`Server is connected to ${port} !!!🚀`);
});
