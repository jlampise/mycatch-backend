const bunyan = require('bunyan');


let dbConnection = 'mongodb://localhost:27017/mycatchdb';

if (process.env.NODE_ENV === 'production') {
  dbConnection = process.env.MONGO_URI;
}
module.exports = {
  logger: bunyan.createLogger({ name: 'MyCatch' }),
  dbConnection
};
