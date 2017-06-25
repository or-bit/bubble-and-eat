import React from 'react';
import { render } from 'enzyme';

import OrderList from './OrderList';

describe('OrderList Unit Tests', () => {
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
            <OrderList
              orders={orders}
              resetFilters={() => {}}
              filterCompletedOrders={() => {}}
              filterActiveOrders={() => {}}
              handleDelete={() => {}}
            />,
        );
    });
});

