const chefActions = require('../actions/chefActions');
const orderActions = require('../actions/ordersActions');

exports.chefHandler = (socket, store, orders, addToDatadaseCompletedOrder) => {
  // notify the chef when there are active orders in state
  const activeFilterFunction = element => element.state === 'active';
  let ordersInState = store.getState().order.orders;
  let previousOrders = store.getState().order.orders;

  let activeOrders = [];
  if (Array.isArray(ordersInState)) {
    activeOrders = ordersInState.filter(activeFilterFunction);
  }
  socket.on('ready', () => {
    if (activeOrders.length > 0) {
      socket.emit('activeOrdinations', activeOrders);
    }
  });
  // when the chef is connected we register his/her presence in the state
  store.dispatch(chefActions.present(new Date()).asPlainObject());
  console.log('chef connected');
  // when the chef disconnects, register his/her absence in the state
  socket.on('disconnect', () => {
    store.dispatch(chefActions.absent(new Date()).asPlainObject());
  });

  // listen the store for changes in state:
  // check if orders changed, and only if they did notify them to the frontend
  store.subscribe(() => {
    ordersInState = store.getState().order.orders;
    console.log(ordersInState, previousOrders);
    if (previousOrders !== ordersInState) {
      previousOrders = ordersInState;
      activeOrders = ordersInState.filter(activeFilterFunction);
      // frontend takes care of empty activeOrders
      socket.emit('activeOrdinations', activeOrders);
    }
  });

  // When the chef marks the dish as prepared, in the backend we receive the order id of the completed order.
  // In order to notify the client we emit an event with the corresponding id.
  // The client is listening for the event with the order id:
  // when he receives the event he knows that his order is ready.
  socket.on('orderCompleted', (id) => {
    orders.emit(id);
    store.dispatch(orderActions.completeOrder(id).asPlainObject());
    // persist completed order in db
    // id is unique -> filter can find only one order with the id -> first result is going to be the desired one
    const completedOrder = ordersInState.filter(order => order._id === id)[0];
    if (typeof completedOrder !== 'undefined') {
      addToDatadaseCompletedOrder(completedOrder);
    }
  });
};
