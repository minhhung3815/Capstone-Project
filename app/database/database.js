const mongoose = require('mongoose');
const mongoConncetion = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Mongoose Connected');
    })
    .catch(err => {
      console.log('Mongoose connection Error', err);
    });
};

module.exports = mongoConncetion;
