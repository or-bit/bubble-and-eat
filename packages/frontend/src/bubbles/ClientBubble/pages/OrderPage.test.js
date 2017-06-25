import React from 'react';
import { render } from 'enzyme';
import io from 'socket.io-client';

import OrderPage from './OrderPage';

describe('ClientBubble -> OrderPage Unit Tests', () => {
    let socket;

    beforeEach(() => {
        socket = io();
    });

    afterEach(() => {
        socket.disconnect();
    });

    it('should render without errors', () => {
        render(
            <OrderPage
              handleBack={() => {}}
              socket={socket}
              handleCompletedOrder={() => {}}
            />,
        );
    });
});

