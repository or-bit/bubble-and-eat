// import configuration
const config = require('bubble-and-eat-consts');

const server = require('monolith-backend').Server.create();
const StoreProvider = require('monolith-backend').StoreProvider;
const DataBase = require('monolith-backend').DataBase;
const BubbleMemory = require('monolith-backend').BubbleMemory;

// import various connections handlers
const chefHandler = require('./src/handlers/chefHandler').chefHandler;
const clientHandler = require('./src/handlers/clientHandler').clientHandler;
const adminHandler = require('./src/handlers/adminHandler').adminHandler;

// import redux reducers
const reducers = require('./src/reducers/combineReducer').reducers;

// create an EventEmitter used for orders
class Orders extends BubbleMemory {}
const orders = new Orders();

// increase concurrent operations limit
orders.setMaxListeners(500);

const mongoUrl = config.getDBURL();

const db = new DataBase(mongoUrl);

// function used to save a completed order in the appropriate collection (collection 'orders')
const addCompletedOrderToDB = (order) => {
  const persistOrder = Object.assign({}, order);
  delete persistOrder.id;
  db.insertOne('orders', persistOrder).then(() => {
    console.log('Completed order saved to db');
  }).catch(err => console.error('Failed to save completed order to db', err));
};


// Redux store creation
// 3 cases
/*  1) connection to DB successful
      1.A) "state" collection present => load state from DB
      1.B) "state" collection not found => initialize default state and persist it immediately
      BOTH) set store's subscriber to saveStateToDB (keep state updated also on DB)

    2) connection to DB failed => run without persistence: initialize default state but not save it to DB.
       TODO DEBUG PURPOSES ONLY
*/

// try to connect to db
db.findOne('state', {}).then((state) => {
    // DB connected and state found -> 1.A
    // retrieve all active orders
  StoreProvider.initStore(reducers, state, db).then();
}).catch((err) => {
  console.warn(err);
  StoreProvider.initStore(reducers, {}, null).then();
  StoreProvider.getStore().subscribe(() => {
      // trace what's happening for debug
    console.log('Server state modified:', StoreProvider.getStore().getState());
  });
});

// run server
// server.listen(config.production.port);
server.open(config.getServerPort());
console.log('Server is running');


// .....................................CONNECTION EVENTS.....................................

// route each client to its specific connectionHandler
// TODO authentication goes HERE

server.onConnection((socket) => {
  socket.on('auth', (authData) => {
    const store = StoreProvider.getStore();
    // TODO modify cook -> chef
    if (authData.type === 'cook') {
      chefHandler(
        socket,
        store,
        orders,
        addCompletedOrderToDB);
    } else if (authData.type === 'client') {
      clientHandler(socket, store, orders);
    } else if (authData.type === 'admin') {
      adminHandler(socket, store, db);
    }
  });
});
