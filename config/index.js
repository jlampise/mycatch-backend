const bunyan = require('bunyan');

module.exports = {
  logger: bunyan.createLogger({ name: 'MyCatch' }),
  dbConnection: 'mongodb://localhost:27017/mycatchdb'
};
