import React from 'react';
import { render } from 'enzyme';

import ChefDishListItem from './ChefDishListItem';

describe('ChefDishListItem Unit Tests', () => {
    const dish = {
        amount: 1,
        dish: {
            name: 'test',
            ingredients: 'test',
            price: 1,
        },
    };

    it('should render without errors', () => {
        render(<ChefDishListItem dish={dish} />);
    });
});
