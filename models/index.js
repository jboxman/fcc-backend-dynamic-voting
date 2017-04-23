const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require('../config/envs');

function setupDb() {

    mongoose.connect(config.mongodb.url);

    const db = mongoose.connection;
    db.once('open', () => {
        console.log('I am connected.');
    });

    return db;
}

module.exports = setupDb;
