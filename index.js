const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./app/router/index');
const mongoConncetion = require('./app/database/database');
const app = express();
const cloudinary = require('cloudinary');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'config.env' });
}
const port = process.env.PORT || 8098;

mongoConncetion();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

app.listen(port, err => {
  if (err) {
    return console.log('Connection error');
  }
  return console.log(`Server is connected to ${port} !!!🚀`);
});
