/**
 * AdminHandler module
 * @module adminHandler
 */

/**
 * @constant
 * @type{orderActions}
 */
const orderActions = require('../actions/ordersActions');

/**
 * @constant
 * @type{menuEvents}
 */
const menuEvents = require('./menuEventsHandler');

/**
 * @function
 * @name retrieveCompletedOrders
 * @desc Retrieve the completed orders from the database.
 */
const retrieveCompletedOrders = database => new Promise((resolve, reject) => {
  database.connect().then((db) => {
    db.collection('orders').find().toArray((err, ordersFromDB) => {
      if (err) {
        reject(err);
      } else {
        resolve(ordersFromDB);
        // console.log(orders);
      }
    });
  }).catch(error => reject(error));
});

const disconnectionHandler = () => console.log('Admin disconnected');

exports.adminHandler = (socket, store, database) => {
  // GESTIONE DELLE RICHIESTE DELLA BOLLA
  console.log('Admin connected', new Date());
    /**
     * @function
     * @name soket/on
     * @param {Event} disconnect - admin disconnect event
     * @param {Function} admin_disconnect - admin disconnection
     * @desc Manage admin disconnection
     */
  socket.on('disconnect', () => disconnectionHandler());

  // REACTIONS TO REQUESTS
    /**
     * @function
     * @name soket/on
     * @param {Event} menu - menu request event
     * @param {Function} emit_request - admin emit menu request
     * @desc manage admin's menu request
     */
  // consult the menu
  socket.on('menu', () => menuEvents.menuEventHandler(socket, store));

    /**
     * @function
     * @name soket/on
     * @param {Event} addDish - add dish event
     * @param {Function} emit_request - admin emit add dish event
     * @desc manage admin's add dish to menuStates and emit event
     */
  // add dish to the menu
  socket.on('addDish',
    dish => menuEvents.addDishEventHandler(socket, store, dish));

    /**
     * @function
     * @name soket/on
     * @param {Event} removeDish - remove dish event
     * @param {Function} emit_request - admin emit remove dish event
     * @desc manage admin's remove dish to menuStates and emit event
     */
  // remove dish from the menu
  socket.on('removeDish',
    id => menuEvents.removeDishEventHandler(socket, store, id));

    /**
     * @function
     * @name soket/on
     * @param {Event} editDish - edit dish event
     * @param {Function} emit_request - admin emit edit dish event
     * @desc manage admin's edit dish to menuStates then search the dish to modify and emit event
     */
  // edit dish info
  socket.on('editDish',
    payload => menuEvents.editDishEventHandler(socket, store, payload));

    /**
     * @function
     * @name soket/on
     * @param {Event} allOrders - event to get all orders
     * @param {Function} emit_request - admin emit event
     * @desc manage admin's request to get all orders
     */
  // retrieve all orders
  socket.on('allOrders', () => {
    let orders = store.getState().order.orders;
    retrieveCompletedOrders(database).then(
      (ordersFromDB) => {
        orders = orders.concat(ordersFromDB);
      }).catch(error => console.error(error));
    socket.emit('allOrders', orders);
  });

    /**
     * @function
     * @name soket/on
     * @param {Event} activeOrders - event to get active orders
     * @param {Function} emit_request - admin emit event
     * @desc manage admin's request to get active orders filter order to get active ones and emit the event
     */
  // looking at the active orders
  socket.on('activeOrders', () => {
    const filterFunction = order => order.status === 'active';
    const orders = store.getState().order.orders;
    socket.emit('activeOrders', orders.filter(filterFunction));
  });

    /**
     * @function
     * @name soket/on
     * @param {Event} completedOrders - event to get complete orders
     * @param {Function} emit_request - admin emit event
     * @desc manage admin's request to get completed orders filter order to get completed ones and emit the event
     */
  // looking at the completed orders
  socket.on('completedOrders', () => {
    retrieveCompletedOrders(database).then((completedOrders) => {
      socket.emit('completedOrders', completedOrders);
    }).catch((error) => {
      console.error(error);
      socket.emit('completedOrders', []);
    });
  });

    /**
     * @function
     * @name soket/on
     * @param {Event} deleteOrder - event to delete order
     * @param {Function} emit_request - admin emit event
     * @desc manage admin's request to delete an order from id get the order
     * with that specific id than emit delete event on that order
     */
  // delete an order
  socket.on('deleteOrder', (id) => {
    store.dispatch(orderActions.deleteOrder(id).asPlainObject());
    socket.emit('deleteOrder', id);
  });
};

