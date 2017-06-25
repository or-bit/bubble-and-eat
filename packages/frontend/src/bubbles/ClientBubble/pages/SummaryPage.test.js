import React from 'react';
import { render } from 'enzyme';
import io from 'socket.io-client';

import SummaryPage from './SummaryPage';

describe('ClientBubble -> SummaryPage Unit Tests', () => {
    let socket;

    beforeEach(() => {
        socket = io();
    });

    afterEach(() => {
        socket.disconnect();
    });

    it('should render without errors', () => {
        render(
            <SummaryPage
              handleBack={() => {}}
              socket={socket}
            />,
        );
    });
});

