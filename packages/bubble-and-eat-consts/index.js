// required to be able to use the .env file inside this package
require('dotenv').config(
    {
        path: `${process.cwd()}/../bubble-and-eat-consts/.env`,
    }
);

module.exports = {
    getServerPort: () => process.env.SERVER_PORT,
    getServerURL: () => {
        const protocol = process.env.SERVER_PROTOCOL;
        const host = process.env.SERVER_HOST;
        const port = process.env.SERVER_PORT;
        return `${protocol}://${host}:${port}`;
    },
    getDBURL: () => {
        const host = process.env.DB_HOST;
        const port = process.env.DB_PORT;
        const name = process.env.DB_NAME;
        return `mongodb://${host}:${port}/${name}`;
    },
};
