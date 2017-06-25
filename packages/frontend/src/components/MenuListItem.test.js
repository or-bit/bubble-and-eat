import React from 'react';
import { render } from 'enzyme';

import MenuListItem from './MenuListItem';

describe('MenuListItem Unit Tests', () => {
    const dish = {
        name: 'test',
        ingredients: 'test',
        price: 1,
    };

    it('should render without errors', () => {
        render(<MenuListItem dish={dish} />);
    });

    it('should render without errors', () => {
        render(<MenuListItem dish={dish} isAdmin />);
    });
});
