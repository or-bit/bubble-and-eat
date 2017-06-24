// required to be able to use the .env file inside this package
require('dotenv').config(
    {
        path: `${process.cwd()}/../bubble-and-eat-consts/.env`,
    }
);

module.exports = {
    getServerPort: () => process.env.PORT || 3001,
    getServerURL: () => {
        const protocol = process.env.SERVER_PROTOCOL || 'http';
        const host = process.env.SERVER_HOST || 'localhost';
        const port = process.env.PORT || 3001;
        return `${protocol}://${host}:${port}`;
    },
    getDBURL: () => {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const name = process.env.DB_NAME || 'ordergateway';
        return `mongodb://${host}:${port}/${name}`;
    },
};
