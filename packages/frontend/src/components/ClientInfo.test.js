import React from 'react';
import { render } from 'enzyme';

import ClientInfo from './ClientInfo';

describe('ClientInfo Unit Tests', () => {
    it('should render without errors', () => {
        render(
            <ClientInfo
              client={{ name: 'test' }}
            />,
        );
    });
});

