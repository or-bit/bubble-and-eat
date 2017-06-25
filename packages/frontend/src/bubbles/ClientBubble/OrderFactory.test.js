import OrderFactory from './OrderFactory';

describe('OrderFactory Unit Tests', () => {
    it('should return expected object', () => {
        const dishes = [
            {
                name: 'test',
                ingredients: 'test',
                price: 1,
            },
            {
                name: 'test',
                ingredients: 'test',
                price: 1,
            },
            {
                name: 'test',
                ingredients: 'test',
                price: 1,
            },
        ];

        const amounts = [
            1,
            0,
            2,
        ];

        const expectedResult = {
            state: '',
            client: {
                name: 'test',
            },
            dishes: [
                {
                    amount: 1,
                    dish: {
                        name: 'test',
                        ingredients: 'test',
                        price: 1,
                    },
                },
                {
                    amount: 2,
                    dish: {
                        name: 'test',
                        ingredients: 'test',
                        price: 1,
                    },
                },
            ],
        };

        expect(OrderFactory(amounts, dishes, 'test')).toEqual(expectedResult);
    });
});
