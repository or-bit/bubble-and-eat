const readline = require('readline');
const config = require('../configuration/config');

const socket = require('socket.io-client')(config.getServerURL());

socket.emit('auth', { type: 'cook' });
socket.emit('ready');
console.log('Emulatore della bolla del cuoco lanciato');
socket.on('activeOrdinations', (ordinations) => {
  console.log('ordinazioni da cucinare: ');
  console.log(ordinations);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const message = 'Inserisci l\'id dell\'ordine da completare (q per disconnettersi)\n';

  rl.question(message, (answer) => {
    if (answer === 'q') {
      rl.close();
      socket.disconnect();
    } else {
      socket.emit('orderCompleted', parseInt(answer, 10));
    }
  });
});

socket.on('disconnect', () => {
  console.log('disconnected');
});
