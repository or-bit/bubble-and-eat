const orderActions = require('../actions/ordersActions');

/**
 * Handles the request emitted from the client bubble.
 * @module clientHandler
 * @param socket {Socket} Socket for the connection to the server
 * @param store {Redux.Store} Store where data is saved
 * @param orders {Array} List of all orders
 * @param menusEvent {EventEmitter} EventEmitter for changes in menu
 */
exports.clientHandler = (socket, store, orders, menusEvent) => {
  // Bubbles' requests
  console.log('Client connected');

  menusEvent.on('menuUpdated', () => {
    socket.emit('menu', store.getState().menu.dishes);
  });

  // Disconnection event
  socket.on('disconnect', () => { console.log('Client disconnected'); });

  // This manages the order's status request when client disconnects and reconnects
  socket.on('orderStatus', (id) => {
    // client is reconnected: retrieve its order by order id
    console.log(`Requesting order's ${id} state`);
    const filterFunction = element => element._id.toString() === id;
    let order = store.getState().order.orders.filter(filterFunction);
    order = order[0];
    if (typeof order !== 'undefined') {
      console.log('corresponding order is', order);
      // Check if order is completed
      if (order.state === 'active') {
        // if order is still active emit an event to the listening client
        orders.on(order._id.toString(), () => {
          socket.emit('orderReady');
        });
      } else {
        // order was completed, notify client
        socket.emit('orderReady');
      }
    } else {
      // order not found
      socket.emit('orderNotFound', id);
    }
  });

  // if an order comes from the client
  socket.on('order', (order) => {
    console.log('Order arrived', JSON.stringify(order, null, '  '));

    const outputOrder = Object.assign({}, order);
    let total = 0;
    const dishes = order.dishes;
    if (dishes.length === 0) {
      return;
    }

    dishes.every((dish) => {
      console.log(JSON.stringify(dish, null, '  '));
      const amount = parseInt(dish.amount, 10);
      const unitaryPrice = parseFloat(dish.dish.price);
      total += amount * unitaryPrice;
      return true;
    });

    console.log(`total ${total} $`);
    outputOrder.total = total;
    outputOrder.date = new Date();

    // request to process the order so that it gets registered and shown as active
    // (the chef is paying attention throught the observer to the changes made to the state and gets notified of the order)
    store.dispatch(orderActions.processOrder(outputOrder).asPlainObject());

    socket.emit('orderTotal', total);
    // notify the client of the ID of the placed order so that it can track the state of the order
    socket.emit('orderId', outputOrder._id);
    // waiting for the event corresponding to the order (this way more clients can be notified each of their own order)
    orders.on(outputOrder._id, newOrder => (
      socket.emit('orderReady', newOrder)
    ));
  });

  // handle menu request
  socket.on('menuRequest', () => {
    socket.emit('menu', store.getState().menu.dishes);
  });
};

