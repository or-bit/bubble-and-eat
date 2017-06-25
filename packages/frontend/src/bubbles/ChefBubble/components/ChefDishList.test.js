import React from 'react';
import { render } from 'enzyme';

import ChefDishList from './ChefDishList';

describe('ChefDishList Unit Tests', () => {
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
        render(<ChefDishList dishes={dishes} />);
    });
});

