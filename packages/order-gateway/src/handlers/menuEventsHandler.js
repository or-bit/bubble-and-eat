const menuActions = require('../actions/menuActions');

/**
 * Handles the signal to emit for events about the menu.
 * @module menuEventsHandler
 */
const menuEventsHandler = (() => ({
  /**
   * Loads the menu and emits a signal.
   * @function menuEventHandler
   * @param socket {Socket} Socket for the connection to the server
   * @param store {Redux.Store} Store where data are saved
   */
  menuEventHandler: (socket, store) => {
    socket.emit('menu', store.getState().menu.dishes);
  },

  /**
   * Adds the dish to the menu and emits a signal.
   * @function addDishEventHandler
   * @param socket {Socket} Socket for the connection to the server
   * @param store {Redux.Store} Store where data are saved
   * @param dish {Object} Dish to add
   */
  addDishEventHandler: (socket, store, dish) => {
    store.dispatch(menuActions.addDish(dish).asPlainObject());
    socket.emit('addedDish', dish);
  },

  /**
   * Removes the dish and emits a signal.
   * @function removeDishEventHandler
   * @param socket {Socket} Socket for the connection to the server
   * @param store {Redux.Store} Store where data are saved
   * @param id {Number} Id of the dish to remove
   */
  removeDishEventHandler: (socket, store, id) => {
    store.dispatch(menuActions.removeDish(id).asPlainObject());
    socket.emit('removedDish', id);
  },

  /**
   * Edits the dish and emits a signal.
   * @function editDishEventHandler
   * @param socket {Socket} Socket for the connection to the server
   * @param store {Redux.Store} Store where data are saved
   * @param payload {Object} Updated data
   */
  editDishEventHandler: (socket, store, payload) => {
    store.dispatch(menuActions.editedDish(payload).asPlainObject());
    const filterFunction = element => element.id === payload.id;
    const dishes = store.getState().menu.dishes;
    socket.emit('editedDish', dishes.filter(filterFunction));
  },
}))();

module.exports = menuEventsHandler;

