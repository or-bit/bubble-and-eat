const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/**
 * @class DataBase - Class that connects to the specified MongoDB server instance.
 * @property {string} mongoUrl
 */
class DataBase {
    /**
     * Initialize the DataBase object with the specified url
     * @param mongoUrl {string}
     */
    constructor(mongoUrl) {
        this.mongourl = mongoUrl;
    }

    /**
     *
     * @returns {*}
     */
    connect() {
        return MongoClient.connect(this.mongourl);
    }

    /**
     * Method that tries to read from the specified collection of the connected DataBase
     * @param collectionName {string} Name of the collection to search in.
     * @param filter {Object} Query selection criteria {@link https://docs.mongodb.com/manual/reference/operator/query/}.
     * @returns {Promise} A promise which will be resolved if the connection has been successful and
     *  if something has been found inside the specified collection, rejected otherwise.
     */
    findOne(collectionName, filter) {
        return new Promise((resolve, reject) => {
            this.connect().then((err, db) => {
                assert.equal(null, err);
                console.log('Connected correctly to server');
                db.collection(collectionName).findOne(filter).then((doc) => {
                    db.close();
                    resolve(doc);
                }).catch((readError) => {
                    reject(readError);
                });
            });
        });
    }

    /**
     * Method that tries to insert an element inside the specified collection of the connected DataBase.
     * @param collectionName {string} Name of the collection to put the element in.
     * @param element {Object} Element to be inserted.
     * @returns {Promise} A promise which will be resolved if the connection and the insertion have been successful,
     *  rejected otherwise.
     */
    insertOne(collectionName, element) {
        return new Promise((resolve, reject) => {
            this.connect().then((err, db) => {
                assert.equal(null, err);
                console.log('Connected correctly to server');
                db.collection(collectionName).insertOne(element).then((data) => {
                    db.close();
                    resolve(data);
                }).catch((insertError) => {
                    reject(insertError);
                });
            });
        });
    }
}

module.exports = DataBase;
