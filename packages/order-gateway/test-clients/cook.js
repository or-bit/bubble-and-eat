/**
 * Cook module
 * @module cook
 */

/**
 * @constant
 * @type{readline}
 */
const readline = require('readline');
/**
 * @constant
 * @type{config}
 */
const config = require('bubble-and-eat-consts');

/**
 * @constant
 * @type{socket}
 */
const socket = require('socket.io-client')(config.getServerURL());

/**
 * @function
 * @name soket/emit
 * @param {Event} auth - chef authentication
 * @param {Object} user - user of type cook
 * @desc emit an event to authentication sending an user object with cook type to be to be authenticated as cook from server
 */
socket.emit('auth', { type: 'cook' });

/**
 * @function
 * @name soket/emit
 * @param {Event} ready - chef ready event
 * @desc emit an event to set chef state on ready
 */
socket.emit('ready');
console.log('CookBubble emulator launched');

/**
 * @function
 * @name soket/on
 * @param {Event} activeOrdinations - active ordination event
 * @param {Function} mange_ordinations - get ordinations
 * @desc Get all the active ordinations 
 */
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

/**
 * @function
 * @name soket/on
 * @param {Event} disconnect - cook disconnect event
 * @param {Function} cook_disconnect - cook disconnection
 * @desc Menage cook disconnection
 */
socket.on('disconnect', () => {
  console.log('disconnected');
});
