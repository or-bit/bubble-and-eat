import React from 'react';
import { render } from 'enzyme';

import DishList from './DishList';

describe('DishList Unit Tests', () => {
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

    it('should render without errors', () => {
        render(<DishList dishes={dishes} />);
    });
});

