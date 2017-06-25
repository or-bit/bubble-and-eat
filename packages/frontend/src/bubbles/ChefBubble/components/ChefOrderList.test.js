import React from 'react';
import { render } from 'enzyme';

import ChefOrderList from './ChefOrderList';

describe('ChefOrderList Unit Tests', () => {
    const orders = [
        {
            client: {
                name: 'test',
            },
            state: 'test',
            total: 1,
            dishes: [
                {
                    amount: 1,
                    dish: {
                        name: 'test',
                        ingredients: 'test',
                        price: 1,
                    },
                },
            ],
        },
    ];

    it('should render without errors', () => {
        render(
            <ChefOrderList
              orders={orders}
              handleOrderCompletionEvent={() => {}}
            />,
        );
    });
});

