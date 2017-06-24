const orderActions = require('../actions/ordersActions');

exports.clientHandler = (socket, store, orders) => {
  // Bubbles' requests
  console.log('Client connected');

  // Disconnection event
  socket.on('disconnect', () => { console.log('Client disconnected'); });

  // // This manages the order's status request when client disconnects and reconnects
  socket.on('orderStatus', (id) => {
    // client is reconnected: retrieve its order by order id
    console.log(`Requesting order's ${id} status`);
    const filterFunction = element => element.id === id;
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
      // TODO: ricerca sul database nel caso sia crashato anche il server subito dopo che il cuoco l'ha marcata completata col client crashato pure lui
    }
  });

  // se arriva un ordinazione dal client
  socket.on('order', (order) => {
    // TODO: pensare a cosa fare se il cuoco non c'è io ho messo che si registra comunque l' evento e glielo notifica appena si connette
    // TODO: check che i piatti che vengono ordinati siano in menu

    console.log(JSON.stringify(order, null, '  '));

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

    // richiesta di processare l'ordine.. quindi che venga registrato nello stato degli ordini e segnato come attivo
    // (il cuoco e' in ascolto sulle modifiche allo stato con l'observer e viene notificato dell'ordine)
    store.dispatch(orderActions.processOrder(outputOrder).asPlainObject());

    socket.emit('orderTotal', total);
    // notifico al client l'id dell'ordinazione presa in carico per notificare la presa in carico dell'ordinazione e permettergli di tracciarla
    socket.emit('orderId', outputOrder.id);
    // attesa dell'evento corrispondente alla propria ordinazione (cosi piu client vengono notificati ciascuno rispetto alla propria)
    orders.on(outputOrder.id, () => {
      // notifica alla bolla client
      socket.emit('orderReady');
    });
  });
  // gestione della richiesta del menu.. da valutare se farla con lo stato
  socket.on('menuRequest', () => {
    socket.emit('menu', store.getState().menu.dishes);
  });
};
