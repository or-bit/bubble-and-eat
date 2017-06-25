import React from 'react';
import { render } from 'enzyme';
import io from 'socket.io-client';

import OrdersPage from './OrdersPage';

describe('AdminBubble -> OrdersPage Unit Tests', () => {
    let socket;

    beforeEach(() => {
        socket = io();
    });

    afterEach(() => {
        socket.disconnect();
    });

    it('should render without errors', () => {
        render(
            <OrdersPage
              handleBack={() => {}}
              socket={socket}
            />,
        );
    });
});

