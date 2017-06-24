const menuActions = require('../actions/menuActions');

const menuEventsHandler = (() => ({
  menuEventHandler: (socket, store) => {
    socket.emit('menu', store.getState().menu.dishes);
  },
  addDishEventHandler: (socket, store, dish) => {
    store.dispatch(menuActions.addDish(dish).asPlainObject());
    socket.emit('addedDish', dish);
  },
  removeDishEventHandler: (socket, store, id) => {
    store.dispatch(menuActions.removeDish(id).asPlainObject());
    socket.emit('removedDish', id);
  },
  editDishEventHandler: (socket, store, payload) => {
    store.dispatch(menuActions.editedDish(payload).asPlainObject());
    const filterFunction = element => element.id === payload.id;
    const dishes = store.getState().menu.dishes;
    socket.emit('editedDish', dishes.filter(filterFunction));
  },
}))();

module.exports = menuEventsHandler;
