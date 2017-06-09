const expect = require('chai').expect;
const Database = require('./DataBase');
const MongoInMemory = require('mongo-in-memory');

describe('DataBase Test Suite', () => {
    const port = 7777;
    const collection = 'test';
    const dbName = 'testDB';
    const insertedObject = {
        id: 0,
        name: 'test',
    };
    let url;
    let mongoServerInstance;

    before((done) => {
        mongoServerInstance = new MongoInMemory(port);
        mongoServerInstance.start((error) => {
            if (error) {
                done(error);
            } else {
                url = mongoServerInstance.getMongouri(dbName);
                done();
            }
        });
    });

    after((done) => {
        mongoServerInstance.stop((error) => {
            done(error);
        });
    });

    it('should have the correct mongoUrl field', () => {
        const db = new Database(url);
        expect(db.mongourl).to.equal(url);
    });

    it('should connect and insert object', () => {
        const db = new Database(url);
        db.insertOne(collection, insertedObject);
    });

    it('should contain an object with name = "test"', () => {
        const db = new Database(url);
        db.findOne(collection, { name: 'test' }).then((output) => {
            console.log(output);
        });
    });
});
