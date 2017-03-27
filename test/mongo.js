const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.once('open', () => {
    console.log('I am connected.');
});
