const chefReducer = require('./chefReducer').chefReducer;
const chefStates = require('../states/chefStates').chefStates;
const assert = require('chai').assert;
const expect = require('chai').expect;

const initialState = {
  present: false,
};

describe('Chef reducer tests', () => {
  const state = undefined;

  it('should return the initial state', () => {
    expect(chefReducer(state, {})).to.deep.equal(initialState);
  });

  it('should be set present on chefStates.present action', () => {
    const newState = chefReducer(state, { type: chefStates.present });
    assert.isTrue(newState.present, 'chef is present');
  });

  it('should be set absent on chefStates.absent action', () => {
    const newState = chefReducer(state, { type: chefStates.absent });
    assert.isFalse(newState.present, 'chef is absent');
  });
});
