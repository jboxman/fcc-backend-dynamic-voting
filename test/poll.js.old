//require('leaked-handles');

const test = require('tape');
const group = test.group;
const Mongoose = require('mongoose').Mongoose;
const Mockgoose = require('mockgoose').Mockgoose;

const mongoose = new Mongoose();
mongoose.Promise = global.Promise;
const mockgoose = new Mockgoose(mongoose);

//const db = require('../models')('test');
const pollSchema = require('../models/poll').schema;
const Poll = mongoose.model('Poll', pollSchema);
//const Poll = require('../models/poll').model;
let db;

// TODO
// Try https://github.com/substack/tape/issues/216#issuecomment-290200896

async function before() {
    await mockgoose.prepareStorage().then(() => {
        mongoose.connect('mongodb://foobar/baz');
        db = mongoose.connection;
        mongoose.connection.on('connected', () => {  
            console.log('db connection is now open');
        });
        db.on('close', () => {
            console.log('closed');
        });
        return db;
    });
}

const after = () => {
    db.close();
}

const pollFactory = ({question = 'test', viewCount = 0} = {}) => {
    return {
        question,
        viewCount
    }
}

test('Poll', t => {

    t.test('should save', async function(t) {
        const poll = new Poll(pollFactory());
        console.log(poll);
        await before();
        /*
        await poll.save(function(err, x) {
            console.log('saving...');
            t.end();
        });
        */
        db.close();
        console.log('last statement in test');
    });

    t.test('random', () => {
        console.log('what');
        t.ok(1);
        t.end();
    });

    t.end();
});

// https://github.com/substack/tape/issues/216#issuecomment-224728386
//test.onFinish(() => process.exit(0));
