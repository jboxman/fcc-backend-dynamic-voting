const dotenv = require('dotenv');
const debug = require('debug')('fcc-voting');

const config = require('./config/envs');
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

setupDb().then(() => {
  const app = require('./backend/app');
  app.listen(config.app.port, () => {
    debug(`Listening on ${config.app.port}`);
  });
});
