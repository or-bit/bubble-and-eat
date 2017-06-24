const chefStates = require('../states/chefStates').chefStates;

/**
 * Chef specific reducer.
 * Pure function that changes redux store state based on the current state and the triggering action.
 * @module chefReducer
 * @param state {Object} Current redux chef state. If redux store is not initialized: chef's state is absent
 * @param action {Action} Action that is triggering state changes
 * @returns {Object} The new state
 * @see module:chefActions
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
