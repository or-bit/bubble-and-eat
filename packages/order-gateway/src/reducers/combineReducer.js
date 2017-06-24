const menuReducer = require('./menuReducer').menuReducer;
const chefReducer = require('./chefReducer').chefReducer;
const orderReducer = require('./orderReducer').orderReducer;
const combineReducers = require('redux').combineReducers;

/**
 * Combine menuReducer, chefReducer and orderReducer in one single reducer (pure function).
 * @module combineReducer
 */
exports.reducers = combineReducers({
  chef: chefReducer,
  order: orderReducer,
  menu: menuReducer,
});
