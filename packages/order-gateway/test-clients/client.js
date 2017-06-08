const config = require('../configuration/config');
const socketImport = require('socket.io-client');

let socket = socketImport(config.getServerURL());
let orderId = null;

// TODO: da fare piu pulita la riconnessione
socket.on('disconnect', () => {
  socket.close();
  console.log('disconnected');
  // riconnetto
  socket = socketImport(config.getServerURL());
  // riautentico
  socket.emit('auth', { type: 'client' });
  // chiedo come e' messo l'ordine
  socket.emit('orderStatus', orderId);
  // ne aspetto la risposta
  socket.on('orderReady', () => {
    console.log('your order is ready!');
  });
});

socket.on('menu', (menu) => { console.log('il menu del giorno è', menu); });

function clientOperations() {
  socket.emit('auth', { type: 'client' });
  socket.emit('menuRequest');
  socket.emit('order', {
    dishes: ['cotoletta alla pera',
      'insalata veggie',
      'tofu con crema di banana'],
  });
}
clientOperations();

socket.on('orderId', (id) => {
  orderId = id;
  console.log('your order id is:', id);
});
socket.on('orderReady', () => {
  console.log('your order is ready!');
});
