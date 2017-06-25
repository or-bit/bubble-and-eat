const orderStates = require('../states/orderStates').orderStates;
const IDGenerator = require('monolith-backend').IDGenerator;

/* eslint-disable no-underscore-dangle */
/**
 * Orders specific reducer.
 * Pure function that changes the redux store's state based on the current state and the triggering action.
 * @module orderReducer
 * @param state {Object} Current redux orders state. If redux store is not initialized: orders's state is an object
 * <pre><code> nextID: 0, orders: [] </code></pre>.
 * @param action {Action} Action that is triggering state changes
 * @returns {Object} The new state
 * @see module:ordersActions
 */
exports.orderReducer = (state = { orders: [] }, action) => {
  let newState = Object.assign({}, state);
  const newAction = Object.assign({}, action);
  switch (action.type) {
    case orderStates.process: {
      newAction.payload.state = 'active';
      newAction.payload._id = IDGenerator.createRandomId();
      newState = Object.assign({}, state);
      newState.orders.push(newAction.payload);
      return newState;
    }
    case orderStates.complete: {
      const mapFunction = (element) => {
        if (element._id.toString() === action.payload) {
          const newElement = Object.assign({}, element);
          newElement.state = 'completed';
          return newElement;
        }
        return element;
      };

      const newOrders = newState.orders.map(mapFunction);
      return Object.assign(newState, { orders: newOrders });
    }
    case orderStates.delete: {
      const mapFunction = (element) => {
        if (element._id.toString() === action.payload) {
          const newElement = Object.assign({}, element);
          newElement.state = 'canceled';
          return newElement;
        }
        return element;
      };
      const newOrders = newState.orders.map(mapFunction);
      return Object.assign(newState, { orders: newOrders });
    }
    default:
      return state;
  }
};
