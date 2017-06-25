import React from 'react';
import { render } from 'enzyme';

import ChefBubble from './AdminBubble';

describe('AdminBubble Unit Tests', () => {
    it('should render without errors', () => {
        render(<ChefBubble time={0} />);
    });
});

