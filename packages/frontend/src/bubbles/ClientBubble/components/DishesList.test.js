import React from 'react';
import { render } from 'enzyme';

import DishesList from './DishesList';

describe('DishesList Unit Tests', () => {
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
            <DishesList
              dishes={dishes}
              amounts={amounts}
              total={1}
              handleOrderReset={() => {}}
              handleOrderNext={() => {}}
              handleInputChange={() => {}}
              handleRemoveDish={() => {}}
              handleAddDish={() => {}}
            />,
        );
    });
});

