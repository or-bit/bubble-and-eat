import React from 'react';
import { render } from 'enzyme';

import OrderListItem from './OrderListItem';

describe('OrderListItem Unit Tests', () => {
    const order = {
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
    };

    it('should render without errors', () => {
        render(<OrderListItem order={order} />);
    });
});
