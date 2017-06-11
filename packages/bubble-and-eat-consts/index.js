// required to be able to use the .env file inside this package
require('dotenv').config({path: `${process.cwd()}/../bubble-and-eat-consts/.env`});

module.exports = {
  getServerPort: () => process.env.SERVER_PORT,
  getServerURL: () => `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
  getDBURL: () => `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};
