const test = require('tape');
const db = require('../models')('test');
const fixtures = require('./fixtures/polls');

const before = () => {

}
const after = () => {
    db.close();
}

fixtures.build('Poll').then(poll => {
    console.log(poll);
});

/*
test('Poll', t => {
    t.test('should save', t => {

    });

});
*/

after();
