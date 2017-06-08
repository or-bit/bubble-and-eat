const Action = require('monolith-backend').Action;
const orderActions = require('./ordersActions');
const orderStates = require('../states/orderStates').orderStates;
const expect = require('chai').expect;

describe('Order actions test suite', () => {
  const data = {
    dishes: [
      {
        dish: 'pasta',
      },
    ],
    total: 5,
  };

  it('should create an action that processes an order', () => {
    const expectedAction = Action.create(orderStates.process, data);
    expect(orderActions.processOrder(data)).to.deep.equal(expectedAction);
  });

  it('should create an action that completes an order', () => {
    const expectedAction = Action.create(orderStates.complete, data);
    expect(orderActions.completeOrder(data)).to.deep.equal(expectedAction);
  });

  it('should create an action that deletes an order', () => {
    const id = 0;
    const expectedAction = Action.create(orderStates.delete, id);
    expect(orderActions.deleteOrder(id)).to.deep.equal(expectedAction);
  });
});
