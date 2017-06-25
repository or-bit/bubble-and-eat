import React from 'react';
import { render } from 'enzyme';

import ClientBubble from './ClientBubble';

describe('ClientBubble Unit Tests', () => {
    it('should render without errors', () => {
        render(<ClientBubble time={0} />);
    });
});

