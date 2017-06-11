const config = require('bubble-and-eat-consts');
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

  // ..................ORDINI.....................................
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
// server's response of dish addiction
socket.on('addedDish', (response) => {
  console.log('risposta all aggiunta di un piatto: ', response);
});

// server's response of menu request
socket.on('menu', (menu) => {
  console.log('risposta alla richiesta del menu; ', menu);
});

// server's response of dish modification
socket.on('editedDish', (newDish) => {
  console.log('riposta alla richiesta di modifica dell elemento ', newDish);
});

// server's response of dish removal
socket.on('removeDish', (id) => {
  console.log('eliminato l elemento con id: ', id);
});

// ..............................ORDINI...............................

// server's response to show all orders
socket.on('allOrders', (orders) => {
  console.log('All orders', orders);
});

// server's response to show completed orders
socket.on('completedOrders', (orders) => {
  console.log('Completed orders', orders);
});

// server's response to show active orders
socket.on('activeOrders', (orders) => {
  console.log('Active orders', orders);
});

// server's response to order removal
socket.on('deleteOrder', (id) => {
  console.log(`Order with id ${id} deleted`);
});

// ...............................DISCONNECTION......................
socket.on('disconnect', () => {
  console.log('disconnected');
});
