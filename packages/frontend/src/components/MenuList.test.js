import React from 'react';
import { render } from 'enzyme';

import MenuList from './MenuList';

describe('MenuList Unit Tests', () => {
    const menu = [
        {
            name: 'test',
            ingredients: 'test',
            price: 1,
        },
    ];

    it('should render without errors', () => {
        render(<MenuList menu={menu} />);
    });

    it('should render without errors', () => {
        render(<MenuList menu={menu} isAdmin />);
    });
});

