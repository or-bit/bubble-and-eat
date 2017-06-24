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
      expect(state.dishes).to.deep.equal([]);
      expect(state.date).to.equalDate(new Date());
    });

    it('should have registered the dish', () => {
      state = menuReducer(undefined, {
        type: menuStates.add,
        payload: {
          dish: {
            name: 'test',
            price: 1,
            _id: '0',
          },
        },
      });
      assert.isObject(state.dishes[0]._id);
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

    it('should have removed the dish', () => {
      const newState = menuReducer(
        state,
        {
          type: menuStates.remove,
          payload: state.dishes[0]._id.toString(),
        });
      assert.equal(newState.dishes.length, 1);
    });
  });

  describe('.on menuStates.modify ', () => {
    let state;

    function createModifiedState() {
      return {
        type: menuStates.modify,
        payload: { id: state.dishes[0]._id.toString(), dish: { test: 'test' } },
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

    it('should have not changed dish id', () => {
      const newState = menuReducer(state, createModifiedState());
      assert.equal(newState.dishes[0]._id, state.dishes[0]._id);
    });
    it('should have changed dish content', () => {
      const newState = menuReducer(state, createModifiedState());
      assert.equal(newState.dishes[0].test, 'test');
    });
  });
});
