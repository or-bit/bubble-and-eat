const server = require('monolith-backend').Server.create();
const DataBase = require('monolith-backend').DataBase;
const adminHandler = require('./adminHandler').adminHandler;
const assert = require('assert');
const config = require('bubble-and-eat-consts');
const socketClient = require('socket.io-client');
const sinon = require('sinon');

const serverUrl = config.getServerURL();
const serverPort = config.getServerPort();
const io = server.getSocket();

const fakeDish = {
  id: 0,
  name: 'pasta al ragu',
  price: 8,
  description: 'pasta al ragu',
};

const store = {
  getState: () => ({
    menu: {
      dishes: ['ciaoz'],
    },
    order: {
      orders: [
        {
          status: 'active',
          id: 0,
        },
      ],
    },
  }),
  dispatch: () => {},
};

describe('admin handler responses to events', () => {
  let client;
  const stubbedDB = (() => {
    const db = new DataBase('fake');
    const fakeDB = {
      collection() {
        return {
          find() {
            return {
              toArray(func) {
                return func(null, []);
              },
            };
          },
        };
      },
    };
    return {
      connect: sinon.stub(db, 'connect').resolves(fakeDB),
    };
  })();

  before(() => {
    server.open(serverPort);
  });

  after(() => {
    server.close();
  });

  it('menuEvent', (done) => {
    client = socketClient(serverUrl);
    io.on('connection', (socket) => {
      adminHandler(socket, store, stubbedDB);
      // response from adminHandler (menuEventsHandler)
      client.on('menu', (data) => {
        assert.deepEqual(data, store.getState().menu.dishes);
        client.disconnect();
        done();
      });
    });
    // event on adminHandler
    client.emit('menu');
  });
  it('addDishEvent', (done) => {
    client = socketClient(serverUrl);
    io.on('connection', (socket) => {
      adminHandler(socket, store, stubbedDB);
      // response from adminHandler (menuEventsHandler)
      client.on('addedDish', (data) => {
        assert.deepEqual(data, fakeDish);
        client.disconnect();
        done();
      });
    });
    // event on adminHandler
    client.emit('addDish', fakeDish);
  });
  it('editDishEvent', (done) => {
    client = socketClient(serverUrl);
    io.on('connection', (socket) => {
      adminHandler(socket, store, stubbedDB);
      // response from adminHandler (menuEventsHandler)
      client.on('editedDish', (data) => {
        assert.equal(data.length, 0);
        client.disconnect();
        done();
      });
    });
    // event on adminHandler
    client.emit('editDish', fakeDish);
  });
  it('removeDishEvent', (done) => {
    client = socketClient(serverUrl);
    io.on('connection', (socket) => {
      adminHandler(socket, store, stubbedDB);
      // response from adminHandler (menuEventsHandler)
      client.on('removedDish', (data) => {
        assert.equal(data, 0);
        client.disconnect();
        done();
      });
    });
    client.emit('removeDish', 0);
  });
  it('allOrdersEvent', (done) => {
    client = socketClient(serverUrl);
    io.on('connection', (socket) => {
      adminHandler(socket, store, stubbedDB);
      // response from adminHandler
      client.on('allOrders', (data) => {
        assert.deepEqual(data, store.getState().order.orders);
        client.disconnect();
        done();
      });
    });
    client.emit('allOrders');
  });
  it('activeOrdersEvent', (done) => {
    client = socketClient(serverUrl);
    io.on('connection', (socket) => {
      adminHandler(socket, store, stubbedDB);
      // response from adminHandler
      client.on('activeOrders', (data) => {
        assert.deepEqual(data, [{ status: 'active', id: 0 }]);
        client.disconnect();
        done();
      });
    });
    client.emit('activeOrders');
  });
  it('completedOrdersEvent', (done) => {
    client = socketClient(serverUrl);
    io.on('connection', (socket) => {
      adminHandler(socket, store, stubbedDB);
      // response from adminHandler
      client.on('completedOrders', (data) => {
        assert.deepEqual(data, []);
        client.disconnect();
        done();
      });
    });
    client.emit('completedOrders');
  });
  it('deleteOrderEvent', (done) => {
    client = socketClient(serverUrl);
    io.on('connection', (socket) => {
      adminHandler(socket, store, stubbedDB);
      // response from adminHandler
      client.on('deleteOrder', (data) => {
        assert.deepEqual(data, 1);
        client.disconnect();
        done();
      });
    });
    client.emit('deleteOrder', 1);
  });
});

describe('adminHandler edge cases', () => {
  describe('edge case #1: mongo find error', () => {
    let client;
    const stubbedDB = (() => {
      const db = new DataBase('fake');
      const fakeDB = {
        collection() {
          return {
            find() {
              return {
                toArray(func) {
                  return func('error', null);
                },
              };
            },
          };
        },
      };
      return {
        connect: sinon.stub(db, 'connect').resolves(fakeDB),
      };
    })();

    before(() => {
      server.open(serverPort);
    });

    after(() => {
      server.close();
    });

    it('completedOrdersEvent', (done) => {
      client = socketClient(serverUrl);
      io.on('connection', (socket) => {
        adminHandler(socket, store, stubbedDB);
        // response from adminHandler
        client.on('completedOrders', (data) => {
          assert.deepEqual(data, []);
          client.disconnect();
          done();
        });
      });
      client.emit('completedOrders');
    });
  });

  describe('edge case #2: mongo connection error', () => {
    let client;
    const stubbedDB = (() => {
      const db = new DataBase('fake');
      return {
        connect: sinon.stub(db, 'connect').rejects(),
      };
    })();

    before(() => {
      server.open(serverPort);
    });

    after(() => {
      server.close();
    });

    it('allOrdersEvent', (done) => {
      client = socketClient(serverUrl);
      io.on('connection', (socket) => {
        adminHandler(socket, store, stubbedDB);
        // response from adminHandler
        client.on('allOrders', (data) => {
          assert.deepEqual(data, [{ status: 'active', id: 0 }]);
          client.disconnect();
          done();
        });
      });
      client.emit('allOrders');
    });
  });
});
