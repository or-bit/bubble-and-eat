const orderActions = require('../actions/ordersActions');
const menuEvents = require('./menuEventsHandler');

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
  socket.on('disconnect', () => disconnectionHandler());

  // REAZIONI ALLE RICHIESTE
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
  // vedere gli ordini attivi
  socket.on('activeOrders', () => {
    const filterFunction = order => order.status === 'active';
    const orders = store.getState().order.orders;
    socket.emit('activeOrders', orders.filter(filterFunction));
  });
  // vedere gli ordini non attivi
  socket.on('completedOrders', () => {
    retrieveCompletedOrders(database).then((completedOrders) => {
      socket.emit('completedOrders', completedOrders);
    }).catch((error) => {
      console.error(error);
      socket.emit('completedOrders', []);
    });
  });
  // eliminare un ordine
  socket.on('deleteOrder', (id) => {
    store.dispatch(orderActions.deleteOrder(id).asPlainObject());
    // che sia il caso di marcarlo come eliminato invece che cancellarlo veramente?
    // nik: secondo me si potrebbe creare una collection apposta (come per gli ordini completati)
    socket.emit('deleteOrder', id);
  });
};
