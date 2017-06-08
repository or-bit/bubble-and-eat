const menuReducer = require('./menuReducer').menuReducer;
const menuStates = require('../states/menuStates').menuStates;
const chai = require('chai');
const chaiDateTime = require('chai-datetime');

chai.use(chaiDateTime);
const assert = chai.assert;
const expect = chai.expect;

describe('menuReducer', () => {
  describe('.on menuStates.add ', () => {
    let state;

    it('should return the initial state', () => {
      state = menuReducer(undefined, {});
      expect(state.nextID).to.equal(0);
      expect(state.dishes).to.deep.equal([]);
      expect(state.date).to.equalDate(new Date());
    });

    it('should have raised nextID by 1', () => {
      state = menuReducer(undefined, {
        type: menuStates.add,
        payload: {},
      });
      expect(state.nextID).to.equal(1);
    });

    it('should have registered the dish', () => {
      assert.equal(state.dishes[0].id, 0);
    });
  });

  describe('.on menuStates.remove ', () => {
    let state;

    before(() => {
      state = menuReducer(
        undefined,
        {
          type: menuStates.add,
          payload: {},
        });
    });
    it('should not have changed nextID', () => {
      const newState = menuReducer(
        state,
        {
          type: menuStates.remove,
          payload: 0,
        });
      assert.equal(newState.nextID, 1);
    });

    it('should have removed the dish', () => {
      const newState = menuReducer(
        state,
        {
          type: menuStates.remove,
          payload: 0,
        });
      assert.equal(newState.dishes.length, 0);
    });
  });

  describe('.on menuStates.modify ', () => {
    let state;

    function createModifiedState() {
      return {
        type: menuStates.modify,
        payload: { id: 0, dish: { test: 'test' } },
      };
    }

    before(() => {
      state = menuReducer(
        undefined,
        {
          type: menuStates.add,
          payload: {},
        });
    });

    it('should not have changed nextID', () => {
      const newState = menuReducer(state, createModifiedState());
      assert.equal(newState.nextID, 1);
    });
    it('should have not changed dish id', () => {
      const newState = menuReducer(state, createModifiedState());
      assert.equal(newState.dishes[0].id, 0);
    });
    it('should have changed dish content', () => {
      const newState = menuReducer(state, createModifiedState());
      assert.equal(newState.dishes[0].test, 'test');
    });
  });
});
