/**
 * Orders actions module
 * @module ordersActions
 * @see module:Action
 */

const orderStates = require('../states/orderStates').orderStates;
const Action = require('monolith-backend').Action;

/**
 * Returns an Action instance to use in redux dispatch.
 * @function processOrder
 * @param order {Object} Order object to save in redux store
 */
exports.processOrder = order => Action.create(orderStates.process, order);

/**
 * Returns an Action instance to use in redux dispatch.
 * @function deleteOrder
 * @param orderId {Number} Order Id to remove from redux store
 */
exports.deleteOrder = orderId => Action.create(orderStates.delete, orderId);

/**
 * Returns an Action instance to use in redux dispatch.
 * @function completeOrder
 * @param order {Object} Order object to set as completed.
 */
exports.completeOrder = order => Action.create(orderStates.complete, order);
