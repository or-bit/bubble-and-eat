import React from 'react';
import { render } from 'enzyme';

import ChefOrderListItem from './ChefOrderListItem';

describe('ChefOrderListItem Unit Tests', () => {
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
        render(
            <ChefOrderListItem
              order={order}
              handleOrderCompletionEvent={() => {}}
            />,
        );
    });
});
