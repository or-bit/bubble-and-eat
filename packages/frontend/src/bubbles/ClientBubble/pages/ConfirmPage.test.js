import React from 'react';
import { render } from 'enzyme';

import ConfirmPage from './ConfirmPage';

describe('ClientBubble -> ConfirmPage Unit Tests', () => {
    const dishes = [
        {
            amount: 1,
            dish: {
                name: 'test',
                ingredients: 'test',
                price: 1,
            },
        },
    ];

    const amounts = [
        1,
    ];

    it('should render without errors', () => {
        render(
            <ConfirmPage
              dishes={dishes}
              amounts={amounts}
              handleBack={() => {}}
              handleOrderConfirm={() => {}}
            />,
        );
    });
});

