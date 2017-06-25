import React from 'react';
import { render } from 'enzyme';

import ChefBubble from './ChefBubble';

describe('ChefBubble Unit Tests', () => {
    it('should render without errors', () => {
        render(<ChefBubble time={0} />);
    });
});

