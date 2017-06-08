const orderReducer = require('./orderReducer').orderReducer;
const orderStates = require('../states/orderStates').orderStates;
const assert = require('assert');


describe('orderReducer Test Suite', () => {
  describe('orderReducer on orderStates.process ', () => {
    const state = {
      orders: [],
    };

    const newState = orderReducer(
      state,
      {
        type: orderStates.process,
        payload: {},
      });

    it('should have an active order', () => {
      const activeOrders = newState.orders.filter(
        order => order.state === 'active');
      assert.equal(activeOrders.length, 1);
    });
  });

  describe('order reducer on orderStates.complete ', () => {
    const state = {
      orders: [],
    };
    const newState = orderReducer(
      state,
      {
        type: orderStates.process,
        payload: {},
      });

    it('should have marked the order as completed', () => {
      const orderId = newState.orders[0]._id;
      assert.equal(orderReducer(
        newState,
        {
          type: orderStates.complete,
          payload: orderId.toString(),
        }).orders[0].state, 'completed');
    });
  });

  describe('order reducer on orderStates.delete ', () => {
    const state = {
      orders: [],
    };
    const newState = orderReducer(
      state,
      {
        type: orderStates.process,
        payload: {},
      });

    it('should have marked the order as canceled', () => {
      const orderId = newState.orders[0]._id;
      assert.equal(orderReducer(
        newState,
        {
          type: orderStates.delete,
          payload: orderId.toString(),
        }).orders[0].state, 'canceled');
    });
  });
});
