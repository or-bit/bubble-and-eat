/**
 * Chef specific reducer
 * @module order-gateway/chefReducer
 */

const chefStates = require('../states/chefStates').chefStates;

/**
 * Pure function that changes redux store's state based on the current state and the triggering action.
 * @param state - Current redux chef state. If redux store is not initialized: chef's state is absent.
 * @param action - Action that is triggering state changes. @see module:order-gateway/chefActions
 * @returns The new state.
 */
exports.chefReducer = (state = { present: false }, action) => {
  switch (action.type) {
    case chefStates.present:
      return Object.assign(
        {}, state, { present: true, start: action.payload });
    case chefStates.absent:
      return Object.assign(
        {}, state, { present: false, end: action.payload });
    default:
      return state;
  }
};
