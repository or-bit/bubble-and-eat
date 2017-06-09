import itemsStore from './ItemsStore.js';
import dispatch from '../../../dispatcher.js';


describe('itemsStore', function() {

	it('check itemsStore is empty', function() {
		let all = itemsStore.getItems();
		expect(all).toEqual( [] );
	});

	it('check itemsStore has foo item', function() {

		dispatcher.dispatch({
			type: "ADD_ITEM",
			text: 'foo',
		});

		let all = itemsStore.getItems();
		let keys = Object.keys(all);
		expect(keys.length).toBe(1);
		expect(all).toEqual([{"item": "foo"}]);
	});

	it('check itemsStore has deleted last item', function() {

		dispatcher.dispatch({
			type: 'ADD_ITEM',
			text: 'foo2',
		});

		let all = itemsStore.getItems();
		let keys = Object.keys(all);
		expect(keys.length).toBe(2);
		expect(all).toEqual([{"item": "foo"}, {"item": "foo2"}]);

		dispatcher.dispatch({
			type: 'REMOVE_ITEM',
			id: '2',
		});

		all = itemsStore.getItems();
		keys = Object.keys(all);
		expect(keys.length).toBe(1);
		expect(all).toEqual([{"item": "foo"}]);
	});

});
