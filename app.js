const dotenv = require('dotenv');

// Necessary or calls to mongoose models simply hang forever
const setupDb = require('./models/index');

// Only works when loaded here
if(process.env.NODE_ENV != 'production') {
  try {
    dotenv.load();
  }
  // Doesn't work
  catch(e) {
    console.log(e);
  }
}

setupDb();

require('./server/app')();
