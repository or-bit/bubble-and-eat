/**
 * ChefHandler module
 * @module chefHandler
 */
/**
 * @constant
 * @type{chefActions}
 */
const chefActions = require('../actions/chefActions');
/**
 * @constant
 * @type{orderActions}
 */
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
    /**
     * @function
     * @name soket/on
     * @param {Event} ready - chef is ready event
     * @param {Function} active_orders - function that check if are any active orders
     * @desc If are any active orders in the cookState meanwhile chef is not connected chef is notified
     */
  socket.on('ready', () => {
    if (activeOrders.length > 0) {
      socket.emit('activeOrdinations', activeOrders);
    }
  });
    /**
     * @function
     * @name store/dispatch
     * @param {Object} ChefStates - contains chef's state
     * @desc When chef connect set state in active
     */
  // when the chef is connected we register his/her presence in the state
  store.dispatch(chefActions.present(new Date()).asPlainObject());
  console.log('chef connected');
    /**
     * @function
     * @name soket/on
     * @param {Event} disconnect - chef disconnect event
     * @param {Function} chef_absent - set chefStates on absent state
     * @desc Menage chef disconnection set state in absent
     */
  // when the chef disconnects, register his/her absence in the state
  socket.on('disconnect', () => {
    store.dispatch(chefActions.absent(new Date()).asPlainObject());
  });

    /**
     * @function
     * @name store/subscribe
     * @param {Function} order_manage - catch new orders
     * @desc Active listener functionality to catch new orders and notify to the chef
     */
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

    /**
     * @function
     * @name soket/on
     * @param {Event} orderCompleted - chef complete order event
     * @param {Function} order_id - emit an evit corresponding to a specific client's id
     * @desc When an order, marked with a specific id, is ready chef emit an event wich name=id to notify
     * corresponding client that order is complete
     */
  // When the chef marks the dish as prepared, in the backend we receive the order id of the completed order.
  // In order to notify the client we emit an event with the corresponding id.
  // The client is listening for the event with the order id:
  // when he receives the event he knows that his order is ready.
  socket.on('orderCompleted', (id) => {
    store.dispatch(orderActions.completeOrder(id).asPlainObject());
    // persist completed order in db
    // id is unique -> filter can find only one order with the id -> first result is going to be the desired one
    const completedOrder = ordersInState.filter(order => (
        order._id.toString() === id
    ))[0];
    if (typeof completedOrder !== 'undefined') {
      addToDatadaseCompletedOrder(completedOrder);
      orders.emit(id, completedOrder);
    }
  });
};
