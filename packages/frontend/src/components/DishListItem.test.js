import React from 'react';
import { render } from 'enzyme';

import DishListItem from './DishListItem';

describe('DishListItem Unit Tests', () => {
    const dish = {
        amount: 1,
        dish: {
            name: 'test',
            ingredients: 'test',
            price: 1,
        },
    };

    it('should render without errors', () => {
        render(<DishListItem dish={dish} />);
    });
});
