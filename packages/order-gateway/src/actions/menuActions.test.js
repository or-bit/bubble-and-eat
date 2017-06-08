const Action = require('monolith-backend').Action;
const menuActions = require('./menuActions');
const menuStates = require('../states/menuStates').menuStates;
const expect = require('chai').expect;

describe('Menu actions test suite', () => {
  it('should create an action that adds a dish to the menu', () => {
    const data = {
      dish: 'pasta',
    };
    const expectedAction = Action.create(menuStates.add, data);
    expect(menuActions.addDish(data)).to.deep.equal(expectedAction);
  });

  it('should create an action that change a dish in the menu', () => {
    const data = {
      dish: 'lasagne',
    };
    const expectedAction = Action.create(menuStates.modify, data);
    expect(menuActions.editedDish(data)).to.deep.equal(expectedAction);
  });

  it('should create an action that deletes a dish in the menu', () => {
    const data = 0;
    const expectedAction = Action.create(menuStates.remove, data);
    expect(menuActions.removeDish(data)).to.deep.equal(expectedAction);
  });
});
