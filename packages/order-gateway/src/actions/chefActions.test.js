const Action = require('monolith-backend').Action;
const chefActions = require('./chefActions');
const chefStates = require('../states/chefStates').chefStates;
const expect = require('chai').expect;

describe('Chef actions test suite', () => {
  const data = {
    chefId: 0,
    dateTime: new Date(),
  };

  it('should create an action that signals chef\'s presence', () => {
    const expectedAction = Action.create(chefStates.present, data);
    expect(chefActions.present(data)).to.deep.equal(expectedAction);
  });

  it('should create an action that signals chef\'s absence', () => {
    const expectedAction = Action.create(chefStates.absent, data);
    expect(chefActions.absent(data)).to.deep.equal(expectedAction);
  });
});
