const server = require('monolith-backend').Server.create();

// local requires
const chefHandler = require('./chefHandler').chefHandler;
const config = require('bubble-and-eat-consts');

// requires for client
const assert = require('chai').assert;
const EventEmitter = require('events');
const socketClient = require('socket.io-client');

class Orders extends EventEmitter {}
const orders = new Orders();

const serverUrl = config.getServerURL();
const serverPort = config.getServerPort();
const socketServer = server.getSocket();

const response = {};

const store = {
  getState: () => ({
    menu: {
      dishes: ['test'],
    },
    order: {
      orders: [
        { name: 'active order', state: 'active', _id: 10 },
        { name: 'completed order', state: 'completed', _id: 11 },
      ],
    },
  }),
  // specific dispatch for completeOrder action/event
  dispatch: (action) => {
    const map = (order) => {
      if (order._id === action.payload) {
        return Object.assign(order, { state: 'completed' });
      }
      return order;
    };
    store.getState().order.orders.map(map);
  },
  subscribe: (callback) => {
    response.subscribed = true;
    store.getState().order.orders.push(
      { name: 'new order', state: 'active', id: 12 });
    callback();
  },
};

describe('chefHandler', () => {
  describe('connection and disconnection', () => {
    let client;

    beforeEach((done) => {
      server.open(serverPort);
      done();
    });

    afterEach((done) => {
      server.close();
      client.disconnect();
      done();
    });

    it('should connect', (done) => {
      client = socketClient.connect(serverUrl);
      client.once('connect', () => {
        assert.isTrue(client.connected);
        done();
      });
    });

    it('should disconnect', (done) => {
      client = socketClient.connect(serverUrl);
      client.once('connect', () => {
        assert.isTrue(client.connected);
        client.disconnect();
      });
      client.once('disconnect', () => {
        assert.isFalse(client.connected);
        done();
      });
    });
  });

  describe('fake connection to mongodb', () => {
    let client;

    class FakeDB extends EventEmitter {}
    const fakeDB = new FakeDB();

    const orderId = 10;

    const fakeDBWriteFunction = (data) => {
      fakeDB.emit('write', data.toString());
    };

    beforeEach((done) => {
      server.open(serverPort);
      client = socketClient(serverUrl);
      socketServer.on('connection', (socket) => {
        chefHandler(socket, store, orders, fakeDBWriteFunction);
      });
      done();
    });

    afterEach((done) => {
      client.disconnect();
      server.close();
      done();
    });

    it('should write to db', (done) => {
      client.once('connect', () => {
        fakeDB.once('write', (data) => {
          const resultOrder = store.getState().order.orders[1];
          assert.deepEqual(data, resultOrder.toString());
          done();
        });
      });
      client.emit('orderCompleted', orderId);
    });
  });

  describe('responses to events', () => {
    let client;
    beforeEach((done) => {
      server.open(serverPort);
      client = socketClient(serverUrl);
      socketServer.on('connection', (socket) => {
        chefHandler(socket, store, orders);
        client.on('activeOrdinations', (ordinations) => {
          response.ordinations = ordinations;
        });
        orders.on(6, () => {
          response.orderReady = true;
        });
      });
      done();
    });

    afterEach((done) => {
      client.disconnect();
      server.close();
      done();
    });

    it('should return an array of ordinations on event ready', (done) => {
      client.once('connect', () => {
        client.once('activeOrdinations', () => {
          assert.notEqual(response.ordinations, null);
          done();
        });
      });
      client.emit('ready');
    });

    it('should return only active ordinations', (done) => {
      client.once('connect', () => {
        client.once('activeOrdinations', () => {
          assert.equal(response.ordinations.length, 1);
          done();
        });
      });
      client.emit('ready');
    });

    it('store should be subscribed', () => {
      assert.equal(response.subscribed, true);
    });

    it('should trigger order completion event', (done) => {
      const orderId = 6;
      client.once('connect', () => {
        orders.once(orderId, () => {
          assert.equal(response.orderReady, true);
          done();
        });
      });
      client.emit('orderCompleted', orderId);
    });
  });
});
