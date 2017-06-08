/**
 * Orders actions module
 * @module order-gateway/ordersActions
 * @see module:monolith-backend/Action
 */

const orderStates = require('../states/orderStates').orderStates;
const Action = require('monolith-backend').Action;

/**
 * Returns an Action instance to use in redux dispatch.
 * @param order - Order object to save in redux store
 */
exports.processOrder = order => Action.create(orderStates.process, order);

/**
 * Returns an Action instance to use in redux dispatch.
 * @param orderId - Order Id to remove from redux store
 */
exports.deleteOrder = orderId => Action.create(orderStates.delete, orderId);

/**
 * Returns an Action instance to use in redux dispatch.
 * @param order - Order object to set as completed.
 */
exports.completeOrder = order => Action.create(orderStates.complete, order);
