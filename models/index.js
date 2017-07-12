const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require('../config/envs');

function dbConnect() {

  // Return a Promise here so we can await on it later
  return new Promise(function(resolve, reject) {
    // If there's an error, reject with the error
    mongoose.connect(config.mongodb.url, (err) => {
      if(err) reject(err);
    });

    // If the connection is successful, resolve with the database handle
    const db = mongoose.connection;
    db.once('open', () => {
      //console.log('I am connected.');
      resolve(db);
    });

  });
}

module.exports = dbConnect;
