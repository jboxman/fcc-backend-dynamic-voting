const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const getEnv = () => process.env.NODE_ENV || 'development';

function setupDb(env = getEnv()) {

    // https://github.com/embbnux/kails/blob/master/config/database.js
    const dbUri = `localhost/db_${env}`;

    mongoose.connect(`mongodb://${dbUri}`);

    const db = mongoose.connection;
    db.once('open', () => {
        console.log('I am connected.');
    });

    return db;
}

module.exports = setupDb;
