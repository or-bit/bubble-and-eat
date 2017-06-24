/**
 * admin module
 * @module admin
 */
/**
 * @constant
 * @type{config}
 */
const config = require('bubble-and-eat-consts');
/**
 * @constant
 * @type{socket}
 */
const socket = require('socket.io-client')(config.getServerURL());

const main = () => {
  // admin's bubble actions
  // ...................AUTHENTICATION............................
  socket.emit('auth', { type: 'admin' });
  // ...................MENU......................................
  // add a dish to the menu
  socket.emit(
    'addDish',
    { name: 'pasta al ragu',
      price: 8,
      description: 'pasta al ragu' });

  // add another dish to the menu
  socket.emit(
    'addDish',
    { name: 'costine',
      price: 5,
      description: 'costine di agnello' });

  // send request to show menu
  socket.emit('menu');

  // edit the dish with id = 0 in 'pasta al pomodoro'
  socket.emit(
    'editedDish',
    { id: 0,
      dish: {
        name: 'pasta al pomodoro',
        price: 4,
        description: 'elemento cambiato' },
    });

  // delete dish with id = 1
  socket.emit('removeDish', 1);

  // ..................ORDERS.....................................
  // send request to show all orders
  socket.emit('allOrders');

  // send request to show only completed orders
  socket.emit('completedOrders');

  // send request to show only active orders
  socket.emit('activeOrders');

  // delete order with id = 0
  // requires that a client connected before this script
  socket.emit('deleteOrder', 0);
};

// run sequentially all the actions above
main();

// Async response's management
// ..............................MENU..............................
/**
 * @function
 * @name soket/on
 * @param {Event} addDish - add dish event
 * @param {Function} emit_request - admin emit add dish event
 * @desc manage admin's add dish event
 */
// server's response of dish addiction
socket.on('addedDish', (response) => {
  console.log('risposta all aggiunta di un piatto: ', response);
});

/**
 * @function
 * @name soket/on
 * @param {Event} menu - menu request event
 * @param {Function} emit_request - admin emit menu request
 * @desc manage admin's menu request
 */
// server's response of menu request
socket.on('menu', (menu) => {
  console.log('risposta alla richiesta del menu; ', menu);
});

/**
 * @function
 * @name soket/on
 * @param {Event} editDish - edit dish event
 * @param {Function} emit_request - admin emit edit dish event
 * @desc manage admin's edit dish to menuStates then search the dish to modify and emit event
 */
// server's response of dish modification
socket.on('editedDish', (newDish) => {
  console.log('riposta alla richiesta di modifica dell elemento ', newDish);
});

/**
 * @function
 * @name soket/on
 * @param {Event} removeDish - remove dish event
 * @param {Function} emit_request - admin emit remove dish event
 * @desc manage admin's remove dish to menuStates and emit event
 */
// server's response of dish removal
socket.on('removeDish', (id) => {
  console.log('eliminato l elemento con id: ', id);
});

// ..............................ORDERS...............................
/**
 * @function
 * @name soket/on
 * @param {Event} allOrders - event to get all orders
 * @param {Function} emit_request - admin emit event
 * @desc manage admin's request to get all orders
 */
// server's response to show all orders
socket.on('allOrders', (orders) => {
  console.log('All orders', orders);
});

/**
 * @function
 * @name soket/on
 * @param {Event} completedOrders - event to get complete orders
 * @param {Function} emit_request - admin emit event
 * @desc manage admin's request to get all the completed orders, filter the orders to get the completed ones and emit the event
 */
// server's response to show completed orders
socket.on('completedOrders', (orders) => {
  console.log('Completed orders', orders);
});

/**
 * @function
 * @name soket/on
 * @param {Event} activeOrders - event to get active orders
 * @param {Function} emit_request - admin emit event
 * @desc manage admin's request to get the active orders, filter the orders to get the active ones and emit the event
 */
// server's response to show active orders
socket.on('activeOrders', (orders) => {
  console.log('Active orders', orders);
});

/**
 * @function
 * @name soket/on
 * @param {Event} deleteOrder - event to delete order
 * @param {Function} emit_request - admin emit event
 * @desc manage admin's request to delete an order, get the order
 * with that specific id then emit delete event on that order
 */
// server's response to order removal
socket.on('deleteOrder', (id) => {
  console.log(`Order with id ${id} deleted`);
});

// ...............................DISCONNECTION......................
/**
 * @function
 * @name soket/on
 * @param {Event} disconnect - admin disconnect event
 * @param {Function} admin_disconnect - admin disconnection
 * @desc Manage admin disconnection
 */
socket.on('disconnect', () => {
  console.log('disconnected');
});
