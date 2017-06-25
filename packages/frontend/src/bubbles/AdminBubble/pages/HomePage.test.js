import React from 'react';
import { render } from 'enzyme';

import HomePage from './HomePage';

describe('AdminBubble -> HomePage Unit Tests', () => {
    it('should render without errors', () => {
        render(
            <HomePage
              handleMenuClick={() => {}}
              handleOrdersClick={() => {}}
            />,
        );
    });
});

