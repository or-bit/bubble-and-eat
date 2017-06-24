/**
 *
 */

const IDGenerator = require('monolith-backend').IDGenerator;
const menuStates = require('../states/menuStates').menuStates;

// default menu object definition
const defaultMenuState = {
  dishes: [],
  date: new Date(),
};

/**
 * Menu specific reducer.
 * Pure function that changes redux store state based on the current state and the triggering action.
 * @module menuReducer
 * @param state {Object} Current redux menu state. If redux store is not initialized: menu's state is an object <pre><code> dishes: [], date: new Date(), nextID: 0 </code></pre> .
 * @param action {Action} Action that is triggering state changes.
 * @returns {Object} The new state.
 * @see module:menuActions
 */
exports.menuReducer = (state = defaultMenuState, action) => {
  const newAction = Object.assign({}, action);
  switch (action.type) {
    case menuStates.add: {
      // action.payload = dish object
      newAction.payload._id = IDGenerator.createRandomId();
      const newState = Object.assign({}, state);
      newState.dishes.push(newAction.payload);
      return newState;
    }
    case menuStates.remove: {
      // action.payload = id of the dish that will be removed
      const filterFunction = element => (
          element._id.toString() !== action.payload
      );
      return Object.assign({}, state, {
        dishes: state.dishes.filter(filterFunction),
      });
    }
    case menuStates.modify: {
      // payload = {id: int, dish:{name: string, price: double, description: string}}
      // payload.id = id of the dish that will be modified,
      // payload.dish = dish object that will replace the existing one
      const mapFunction = (element) => {
        console.log(element._id.toString(), action.payload.id);
        if (element._id.toString() !== action.payload.id) return element;
        newAction.payload.dish._id = action.payload.id;
        return newAction.payload.dish;
      };
      console.log(state.dishes.map(mapFunction));
      return Object.assign(
        {},
        state,
        { dishes: state.dishes.map(mapFunction) });
    }
    default:
      return state;
  }
};
