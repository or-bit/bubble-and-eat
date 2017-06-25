import React from 'react';
import { render } from 'enzyme';
import io from 'socket.io-client';

import MenuPage from './MenuPage';

describe('AdminBubble -> MenuPage Unit Tests', () => {
    let socket;

    beforeEach(() => {
        socket = io();
    });

    afterEach(() => {
        socket.disconnect();
    });

    it('should render without errors', () => {
        render(
            <MenuPage
              handleBack={() => {}}
              socket={socket}
            />,
        );
    });
});

