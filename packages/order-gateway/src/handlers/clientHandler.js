/**
 * ClientHandler module
 * @module clientHandler
 */

/** @constant
 * @type{ordereActions}
 */
const orderActions = require('../actions/ordersActions');

exports.clientHandler = (socket, store, orders) => {
  // Bubbles' requests
  console.log('Client connected');

    /**
     * @function
     * @name soket/on
     * @param {Event} disconnect - client disconnect event
     * @param {Function} client_disconnect - client disconnection
     * @desc Menage client disconnection
     */
  // Disconnection event
  socket.on('disconnect', () => { console.log('Client disconnected'); });

    /**
     * @function
     * @name soket/on
     * @param {Event} orderStatus - check client's oreder status
     * @param {Function} search_by_id - search client's order by id
     * @desc Manages the order's status request when client disconnects and reconnects
     */
  // This manages the order's status request when client disconnects and reconnects
  socket.on('orderStatus', (id) => {
    // client is reconnected: retrieve its order by order id
    console.log(`Requesting order's ${id} state`);
    const filterFunction = element => element._id === id;
    let order = store.getState().order.orders.filter(filterFunction);
    order = order[0];
    if (typeof order !== 'undefined') {
      console.log('corresponding order is', order);
      // Check if order is still active
      if (order.state === 'active') {
        // if order is still active emit an event to the listening client
        orders.on(order.id, () => {
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


    /**
     * @function
     * @name soket/on
     * @param {Event} order - client's order
     * @param {Function} send_order - send client's order
     * @desc set unique id to client's order and save it in store(orderStates) and in database then send's id back
     * to client(in case of client's disconnection) and wait event with his specific order's id
     */
  // if an order comes from the client
  socket.on('order', (order) => {
    console.log('Order arrived', JSON.stringify(order, null, '  '));

    const outputOrder = Object.assign({}, order);
    let total = 0;
    const dishes = order.dishes;

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

    /**
     * @function
     * @name soket/on
     * @param {Event} menuRequest - menu request event
     * @param {Function} emit_request - client emit menu request
     * @desc manage client's menu request
     */
  // handle menu request
  socket.on('menuRequest', () => {
    socket.emit('menu', store.getState().menu.dishes);
  });
};

