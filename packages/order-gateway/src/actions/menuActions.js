/**
 * Menu actions module
 * @module menuActions
 * @see module:Action
 */

const menuStates = require('../states/menuStates').menuStates;
const Action = require('monolith-backend').Action;

/**
 * Returns an Action instance to use in redux dispatch.
 * @function addDish
 * @param dish {Object} Dish object to be added to the menu.
 */
exports.addDish = dish => Action.create(menuStates.add, dish);

/**
 * Returns an Action instance to use in redux dispatch.
 * @function removeDish
 * @param dishId {Object} Dish id to be removed from the menu.
 */
exports.removeDish = dishId => Action.create(menuStates.remove, dishId);

/**
 * Returns an Action instance to use in redux dispatch.
 * @function editedDish
 * @param newDish {Object} Dish object that will replace the existing dish with the same Id.
 */
exports.editedDish = newDish => Action.create(menuStates.modify, newDish);
