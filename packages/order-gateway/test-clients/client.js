/**
 * Client module
 * @module client
 */
/**
 * @constant
 * @type{config}
 */
const config = require('bubble-and-eat-consts');
/**
 * @constant
 * @type{socketImport}
 */
const socketImport = require('socket.io-client');

let socket = socketImport(config.getServerURL());
let orderId = null;

/**
 * @function
 * @name soket/on
 * @param {Event} disconnect - client disconnect event
 * @param {Function} client_disconnect - client disconnection
 * @desc Menage client disconnection and eventually client reconnection to server and
 * recovery state of his order if are any active
 */
// TODO: da fare piu pulita la riconnessione
socket.on('disconnect', () => {
  socket.close();
  console.log('disconnected');
  // reconnection
  socket = socketImport(config.getServerURL());
  // authentication
  socket.emit('auth', { type: 'client' });
  // check order status
  socket.emit('orderStatus', orderId);
  // wait for response
  socket.on('orderReady', () => {
    console.log('your order is ready!');
  });
});

/**
 * @function
 * @name soket/on
 * @param {Event} menu - menu request event
 * @param {Function} get_request - get menu
 * @desc return menu to client
 */
socket.on('menu', (menu) => { console.log('the menu of the day is', menu); });

/**
 * @function
 * @name clientOperations
 * @desc auth menu order
 */
function clientOperations() {
  socket.emit('auth', { type: 'client' });
  socket.emit('menuRequest');
  socket.emit('order', {
    dishes: ['cotoletta alla pera',
      'salad',
      'tofu and banana cream'],
  });
}
clientOperations();

/**
 * @function
 * @name soket/on
 * @param {Event} orderId - order id event
 * @param {Function} set_id - set id
 * @desc set id of client's order
 */
socket.on('orderId', (id) => {
  orderId = id;
  console.log('your order id is:', id);
});

/**
 * @function
 * @name soket/on
 * @param {Event} orderReady - order ready event
 * @desc notify when order is ready
 */
socket.on('orderReady', () => {
  console.log('your order is ready!');
});
