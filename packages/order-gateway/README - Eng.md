#Order Gateway

##Installation
On the `master` branch use the command `npm install` to install all the dependencies.
  * `express` for the server management
  * `socket.io` for the tcp connection between the gateway and the bubbles
  * `redux` for the state of the application

  Once all the dependencies have been installed
  * to start the server type `node index.js` in the terminal
  * for the chef type `node chefActions.js`
  * for the client type `node client.js`

  ##HOW IT WORKS
  ###index.js
  At the start the state of the application will be loaded if available, otherwise it will be initialized with the default values.
  If the state of the application can be loaded the list of the orders that will be recovered is limited to the active ones, the completed ones are in fact stored in a different `orders` collection so as to not burden the communication.
  The server will start listening on door 3333 (can be modified in the config.json file) for tcp connections, and it will authomatically accept them and sort them in parallel control flows. When a new connection arrives the server answers only to `auth` events where who is connecting to the server specifies who he is (in the future we might add a bit of security).
  ```
  the chef identifies himself by sending an autheven to the connection
  { type: 'chef' }
  the client
  { type: 'client'}
  ```
  Once the identity of the connection has been identified it will be handeled by specific functions (that will be put in different files
  `chefHandler(socket)` and `clientHandler(socket)`
  These will hold the reference to the open socket so as to be able to communicate with the corresponding bubbles.
  `socket` inside the client represents that connection's socket (with multiple connections there will be more instances of the same function, handeled in parallel, each one with the reference to it's own client).

  Every time the state changes the new state will be saved on the database (if connected)

  ###STARTING THE SERVER AND DATABASE INTERACTION
  Start mogodb anc ehck that the database's address is under the entry `mongoUrl` in the config.json file
  (to start mongo with docker for development you can simply write `docker run -it --rm -p 27017:27017 mongo` on a shell)

  When the application starts it will try to connect to the database pointed at by the address `mongoUrl`
  present in the configuration file `config.json` that will have a content similar to
  `{"mongoUrl" : "mongodb://localhost:27017/test"}`
  if the connection fails the store will be initialized with the default values and the application will still work by keeping the data on the chache
  If the connection succedes there are two possible scenarios:
  * the state of the application when it was last started is present on the databse: in this case the store will be initialized from that state, the exception are the orders already marked as completed that will remain in the collection `orders` so as not to burden the communication.
  Once the state has been initialized a subscriber will be added to the store with the aim of reflecting the changes to the application's state on the database (this way should the server's connection be severed and then restored the activities can be recovered without issues).

  * the state of the application is not present on the database (first time starting the db), the store will be created with default values and a new subscriber will be added to save the future changes on the database

  Interaction between the application and the database during usage of the former:
  * once an order has been marked as completed it will be saved in the `orders` collection, a copy of the order will still be mantained in the cache until the application will be closed so as to speed the recovery of the information for daily reports.
  * when the state of the application changes the new state will be saved on the databse.


  ##MANAGING OF INCOMING CONNECTIONS
  ####/handlers/chefHandler.js

  When the chef connects to the application the corresponding bubble with send and event called `ready`, signaling that it's waiting for orders, and if there are any marked `active` on the server's state those will be notified to the chef. At the same time the application's state will be updated to signal that the chef just connected.
  Once this has been done the handler will start waiting for new events.
 * if the chef disconnects this will be detected and the state of the application will be changed accordingly.
 * if there is an update on the order's state, such as a new active order, these will be sent to the corresponding chef bubble connected to the other side of the socket
 * if the chef bubble notifies the completion of a dish's preparation this event will be sent to the correstonding client that was waiting for that dish's preparation through the event emitter `orders`.

 ####/handlers/clientHandler.js

 As it happens with the chef the client's connection will notified and the handlers will start waiting for events
 * request for the menu: `menuRequest` a `menu` even will be sent to the corresponding bubble attatched with the json containing the menu;
 * order: `order` a unique id will be requsted to the server so that it can be associated to the order, once it has been received the application's state will be modified witb the corresponding reducer and the order will be marked as active.
 The client will be notified of it's ordination's id throught the event `orderId` to notify it that it's ordination has been taken and to allow it to keep track of it in case it disconnects.
 At the same time the list of active orders will be sent to the chef. The client with then start waiting for the event sent by the chef's handler that will notify that the dish has been prepared, at that time the order's state will be changed to completed and the client will be notified that it's ready. (this functions n parallel for different clients).
 If the client's connection fails when an order is waiting to be completed:
 If the client manages to reconnect it will emit an even called `orderStatus` with the order's id attatched to id so as to recover the control flow: at that point if the order has been completed during the downtime the client will be notified, otherwise if it's still active a new observer will be activated on that order.

 ####/handlers/adminHandler.js
 Once the connection has been detected it will start waiting for requests form the admin bubble, the events it will answer to are::
 * `'menu'` sends to the admin bubble the current menu throught the `'menu'` event
 * `'addDish'` adds a new dish to the menu and it assings to it a unique id, it will send back with `'addedDish'` the new dish that has just been added.
 As an object to attach to the even use objects of this type ` {name: 'pasta al ragu', price: 8, description:'pasta al ragu'}`
 * `'removeDish'` it takes an integer as a parameter and removes from the menu the element with the corresponding id, for example `socket.emit('removeDish', 1);`
 the id of the removed element will be sent back to the bubble throught the event `removeDish`
 * `'editDish'` it takes an id as a payload and the object to modify, and then it modifies the obhect and returns through `'editDish'` the modified object or an empty one if the original one was not found. Example `socket.emit('editDish', {id : 0, dish : {name: 'pasta al pomodoro', price: 4, description:'elemento cambiato'}`
 * `'allOrders'` returns to the bubble the list of all the orders through the event `'allOrders'`
 * `'activeOrders'` returns al the active orders through the event `'activeOrders'`
 * `'completedOrders'` returns all the completed orders through the event `'completedOrders'`
 * `'deleteOrder'` takes the order's id as a parameter and then, if it succedes in deleting it, it returns the id of the deleted order with the event `'deleteOrder'`

 ##REDUX STATES
 ###Initial state :
 ```json
 {
    chef :{
        present: false
    },
    order:{
        nextID : 0,
        orders:[]
    },
    menu:{
        dishes: [],
        date : new Date(),
        nextID : 0
    }
 }

```
###Reducers
#### `chefReducer`
It handles the chef's state through the following events:
* `'CHEF_PRESENT'` updates `state.chef.present` to `true`, it activates when the chef connects to the applicatio
* `'CHEF_ABSENT'` updates `state.chef.present` to `false`, it activates when the chef disconnects for the application

#### `orderReducer`
* `'PROCESS_ORDER'` updates the field `state.order.orders` by inserting the element passed as a `payload`, assigning to it a unique id in the field `id` and marking it as active so that it can be signaled to the chef.
```json
payload : {dishes :[]}
```
* `'ORDER_COMPLETED'` updates the field `state.order.orders` marking the elementi whose id matches `payload` as completed so that it's no longer considered active

* `'DELETE_ORDER'` it receives the id as a payload and deletes the corresponding order

#### `menuReducers`
* `'ADD_ELEMENT'` updates the field `state.menu.nextID` with a unique id and  `state.menu.dishes` by adding the object passed as `payload`
this object will be structured in the following way since a unique id will be authomathically assigned to it.
```json
payload: {name: string, price: double, descriiption: string}
```
 * `'REMOVE_ELEMENT'` updates the field `state.menu.dishes` by removing the menu's voice whose id matches the `payload`

 * `'MODIFY_ELEMENT'` updates the field `state.menu.dishes` by modifying the menu's voice whose id matches the `payload.id`
and setting it to `payload.dish`
 ```json
payload : {id: 0, dish:{name:'pasta', price:5.5, description:'pasta'}}
```

 ## EXTERNAL SUPPORT FILES
  ###client.js
  Mock of the client bubble.
  Every time the client gets started it will authomatically login to the server specifying that it's the client. Once aithenticated a new request of viewing the menu will be made, and the menu will be sent as a js object (and should then be visible on the client.
  After visualizing the menu the client will place an order, receive it's id and wait for it's completion.

  ### chefActions.js
  Mock of the chef bubble. It visualizes the active orders and allows to mark them as completed by typing their corresponding ids

  ### admin.js
  Mock of the admin bubble, it will authenticate and then insert two dishes in the menu, modify one of them and then delete another one.
  Once it has done that it will access the oders' list and try to delete the one with id 0. If it manages to do that it will return 0 otherwise it will return an empty object.
