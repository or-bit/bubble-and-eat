/**
 * Menu specific reducer
 * @module order-gateway/menuReducer
 */

const menuStates = require('../states/menuStates').menuStates;

// default menu object definition
const defaultMenuState = {
  dishes: [],
  date: new Date(),
  nextID: 0,
};

/**
 * Pure function that changes redux store's state based on the current state and the triggering action.
 * @param state - Current redux menu state. If redux store is not initialized: menu's state is an object <pre><code> dishes: [], date: new Date(), nextID: 0 </code></pre> .
 * @param action - Action that is triggering state changes. @see module:order-gateway/menuActions
 * @returns The new state.
 */
exports.menuReducer = (state = defaultMenuState, action) => {
  const newAction = Object.assign({}, action);
  switch (action.type) {
    case menuStates.add: {
      // action.payload = dish object
      // TODO replace this id management with Object.Id from mongoclient
      newAction.payload.id = state.nextID;
      const newState = Object.assign({}, state, { nextID: state.nextID + 1 });
      newState.dishes.push(newAction.payload);
      return newState;
    }
    case menuStates.remove: {
      // action.payload = id of the dish that will be removed
      const filterFunction = element => element.id !== action.payload;
      return Object.assign({}, state, {
        dishes: state.dishes.filter(filterFunction),
      });
    }
    case menuStates.modify: {
      // payload = {id: int, dish:{name: string, price: double, descriiption: string}}
      // payload.id = id of the dish that will be modified,
      // payload.dish = dish object that will replace the existing one
      const mapFunction = (element) => {
        if (element.id !== action.payload.id) return element;
        newAction.payload.dish.id = action.payload.id;
        return newAction.payload.dish;
      };
      return Object.assign(
        {},
        state,
        { dishes: state.dishes.map(mapFunction) });
    }
    default:
      return state;
  }
};
