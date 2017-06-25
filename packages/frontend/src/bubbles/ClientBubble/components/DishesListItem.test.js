import React from 'react';
import { render } from 'enzyme';

import DishesListItem from './DishesListItem';

describe('DishesListItem Unit Tests', () => {
    const dish = {
        amount: 1,
        dish: {
            name: 'test',
            ingredients: 'test',
            price: 1,
        },
    };

    it('should render without errors', () => {
        render(
            <DishesListItem
              dish={dish.dish}
              index={0}
              amount={1}
              handleAddDish={() => {}}
              handleRemoveDish={() => {}}
              handleInputChange={() => {}}
            />,
        );
    });
});
