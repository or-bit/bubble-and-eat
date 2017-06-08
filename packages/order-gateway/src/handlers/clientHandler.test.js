// requires for socket.io server
const server = require('monolith-backend').Server.create();

// local requires
const clientHandler = require('./clientHandler').clientHandler;
const config = require('../../configuration/config');

// requires for client
const assert = require('chai').assert;
const EventEmitter = require('events');
const socketClient = require('socket.io-client');

class Orders extends EventEmitter {}
const orders = new Orders();

const serverUrl = config.getTestServerURL();
const socketServer = server.getSocket();

const store = {
  getState: () => ({
    menu: {
      dishes: ['ciaoz'],
    },
    order: {
      orders: [
        { name: 'ordine attivo', state: 'active', id: 10 },
        { name: 'ordine non attivo', state: 'completed', id: 11 },
      ],
    },
  }),
  dispatch: () => {},
};

describe('clientHandler', () => {
  describe('responses to events', () => {
    const response = {};
    let client;

    beforeEach((done) => {
      server.open(config.test.port);
      client = socketClient.connect(serverUrl, { transports: ['websocket'] });
      socketServer.on('connection', (socket) => {
        clientHandler(socket, store, orders);
        // responses
        client.on('orderId', (id) => {
          response.orderIdEvent = id;
          // simulates a chef completing the order
          orders.emit(id);
        });
        client.on('orderReady', () => {
          response.orderReadyEvent = true;
        });
        client.on('menu', (menu) => {
          response.menuEvent = menu;
        });
        // error returned by server.io server
        client.on('error', (error) => {
          done(error);
        });
      });
      done();
    });

    afterEach((done) => {
      server.close();
      done();
    });

    it('orderId assigned', (done) => {
      client.once('connect', () => {
        client.once('orderId', () => {
          assert.equal(response.orderIdEvent, 6);
          done();
        });
      });
      client.emit('order', { id: 6, zz: 'a', dishes: [] });
    });
    it('should notify the order is completed on order signal', (done) => {
      client.once('connect', () => {
        client.once('orderReady', () => {
          assert.equal(response.orderReadyEvent, true);
          done();
        });
      });
      client.emit('order', { id: 6, zz: 'a', dishes: [] });
    });
    it('should receive the correct menu on menu request', (done) => {
      client.once('connect', () => {
        client.once('menu', () => {
          assert.deepEqual(response.menuEvent, store.getState().menu.dishes);
          done();
        });
      });
      client.emit('menuRequest');
    });
    it('should display an error message', (done) => {
      const erroringOrderId = 0;
      client.once('connect', () => {
        client.once('orderNotFound', (id) => {
          assert.equal(erroringOrderId, id);
          done();
        });
      });
      client.emit('orderStatus', erroringOrderId);
    });
  });

  describe('reconnection test', () => {
    const response = { ordersReadyEvents: [] };
    let client;

    beforeEach((done) => {
      server.open(config.test.port);
      client = socketClient.connect(serverUrl, {
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 10,
      });
      socketServer.on('connection', (socket) => {
        clientHandler(socket, store, orders);
        // responses
        client.on('orderReady', () => {
          response.ordersReadyEvents.push(true);
          orders.emit(10);
        });
      });
      done();
    });

    afterEach((done) => {
      client.disconnect();
      server.close();
      done();
    });

    it('should notify the order is completed even if client disconnected',
      (done) => {
        client.emit('orderStatus', 11);
        client.emit('orderStatus', 10);
        client.disconnect();
        setTimeout(() => {
          client.connect();
        }, 500);
        client.once('connect', () => {
          client.once('orderReady', () => {
            assert.equal(response.ordersReadyEvents[0], true);
            done();
          });
        });
      });
  });
});
