/**
 * Menu actions module
 * @module order-gateway/menuActions
 * @see module:monolith-backend/Action
 */

const menuStates = require('../states/menuStates').menuStates;
const Action = require('monolith-backend').Action;

/**
 * Returns an Action instance to use in redux dispatch.
 * @param dish - Dish object to add in the menu.
 */
exports.addDish = dish => Action.create(menuStates.add, dish);

/**
 * Returns an Action instance to use in redux dispatch.
 * @param dishId - Dish id to remove from the menu.
 */
exports.removeDish = dishId => Action.create(menuStates.remove, dishId);

/**
 * Returns an Action instance to use in redux dispatch.
 * @param newDish - Dish object that will replace the existing dish with the same Id.
 */
exports.editedDish = newDish => Action.create(menuStates.modify, newDish);
