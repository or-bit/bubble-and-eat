import React from 'react';
import { render } from 'enzyme';

import MissingConnection from './MissingConnection';

describe('MissingConnection Unit Tests', () => {
    it('should render without errors', () => {
        render(<MissingConnection />);
    });
});

