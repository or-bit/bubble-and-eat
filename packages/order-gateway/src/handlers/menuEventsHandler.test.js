const menuEventsHandler = require('./menuEventsHandler');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');

const expect = chai.use(sinonChai).expect;

describe('Menu Events Handler test suite', () => {
  const socket = {
    emit: (event, result) => (console.log(event, result)),
  };
  const store = {
    getState: () => ({
      menu: {
        dishes: [
          { id: 'first', dish: 'test' },
        ],
      },
      order: {
        orders: [],
      },
    }),
    dispatch: () => {},
  };

  // shortcuts
  const menu = store.getState().menu.dishes;

  describe('testing menu event handler', () => {
    it('should return the expected menu', () => {
      const spiedEmit = sinon.spy(socket, 'emit');
      menuEventsHandler.menuEventHandler(socket, store);
      expect(spiedEmit).to.have.been.calledWith('menu', menu);
      socket.emit.restore();
    });
  });

  describe('testing add dish event', () => {
    it('should add the expected dish', () => {
      const dish = { test: 'test' };
      const spiedEmit = sinon.spy(socket, 'emit');
      menuEventsHandler.addDishEventHandler(socket, store, dish);
      expect(spiedEmit).to.have.been.calledWith('addedDish', dish);
      socket.emit.restore();
    });
  });

  describe('testing edit dish event', () => {
    it('should edit the expected dish', () => {
      const spiedEmit = sinon.spy(socket, 'emit');
      const spiedDispatch = sinon.spy(store, 'dispatch');
      const newDish = { id: 'first', dish: 'newTest' };
      const expectedDish = [{ id: 'first', dish: 'test' }];
      const editDishAction = {
        type: 'MODIFY_DISH',
        payload: { dish: newDish.dish, id: newDish.id },
      };
      menuEventsHandler.editDishEventHandler(socket, store, newDish);
      expect(spiedEmit).to.have.been.calledWith('editedDish', expectedDish);
      expect(spiedDispatch).to.have.been.calledWith(editDishAction);
      socket.emit.restore();
      store.dispatch.restore();
    });
  });

  describe('testing remove dish event', () => {
    it('should remove the expected dish', () => {
      const spiedEmit = sinon.spy(socket, 'emit');
      const spiedDispatch = sinon.spy(store, 'dispatch');
      const removeDishAction = {
        type: 'REMOVE_DISH',
        payload: 'first',
      };
      menuEventsHandler.removeDishEventHandler(socket, store, 'first');
      expect(spiedEmit).to.have.been.calledWith('removedDish', 'first');
      expect(spiedDispatch).to.have.been.calledWith(removeDishAction);
      socket.emit.restore();
      store.dispatch.restore();
    });
  });
});
