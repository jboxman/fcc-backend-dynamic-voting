const factory = require('factory-girl').factory;

const Poll = require('../../models/poll');

//const adapter = new factory.MongooseAdapter();

factory.define('Poll', Poll, {
    text: 'hi'
});

//factory.setAdapter(adapter);

module.exports = factory;
