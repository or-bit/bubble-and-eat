const orderActions = require('../actions/ordersActions');
const menuEvents = require('./menuEventsHandler');

/**
 * Retrieve the completed orders from the database.
 * @function retrieveCompletedOrders
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

/**
 * Handles the disconnection
 * @function disconnectionHandler
 */
const disconnectionHandler = () => console.log('Admin disconnected');

/**
 * Handle the request emitted from the admin bubble.
 * @module adminHandler
 * @param socket {Socket} Socket for the connectinto the server
 * @param store {Redux.Store} Store where data are saved
 * @param database {Database} Database instance
 */
exports.adminHandler = (socket, store, database) => {
  // GESTIONE DELLE RICHIESTE DELLA BOLLA
  console.log('Admin connected', new Date());

  socket.on('disconnect', () => disconnectionHandler());

  // REACTIONS TO REQUESTS
  // consult the menu
  socket.on('menu', () => menuEvents.menuEventHandler(socket, store));

  // add dish to the menu
  socket.on('addDish',
    dish => menuEvents.addDishEventHandler(socket, store, dish));

  // remove dish from the menu
  socket.on('removeDish',
    id => menuEvents.removeDishEventHandler(socket, store, id));

  // edit dish info
  socket.on('editDish',
    payload => menuEvents.editDishEventHandler(socket, store, payload));

  // retrieve all orders
  socket.on('allOrders', () => {
    let orders = store.getState().order.orders;
    retrieveCompletedOrders(database).then(
      (ordersFromDB) => {
        orders = orders.concat(ordersFromDB);
      }).catch(error => console.error(error));
    socket.emit('allOrders', orders);
  });

  // looking at the active orders
  socket.on('activeOrders', () => {
    const filterFunction = order => order.state === 'active';
    const orders = store.getState().order.orders;
    socket.emit('activeOrders', orders.filter(filterFunction));
  });

  // looking at the completed orders
  socket.on('completedOrders', () => {
    retrieveCompletedOrders(database).then((completedOrders) => {
      socket.emit('completedOrders', completedOrders);
    }).catch((error) => {
      console.error(error);
      socket.emit('completedOrders', []);
    });
  });

  // delete an order
  socket.on('deleteOrder', (id) => {
    store.dispatch(orderActions.deleteOrder(id).asPlainObject());
    socket.emit('deleteOrder', id);
  });
};

