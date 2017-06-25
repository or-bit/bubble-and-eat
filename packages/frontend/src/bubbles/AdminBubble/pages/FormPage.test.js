import React from 'react';
import { render } from 'enzyme';
import io from 'socket.io-client';

import FormPage from './FormPage';

describe('AdminBubble -> FormPage Unit Tests', () => {
    const dish = {
        name: 'test',
        price: '1',
    };

    let socket;

    beforeEach(() => {
        socket = io();
    });

    afterEach(() => {
        socket.disconnect();
    });

    it('should render without errors', () => {
        render(
            <FormPage
              socket={socket}
              handleBack={() => {}}
              handleSubmit={() => {}}
            />,
        );
    });
    it('should render without errors', () => {
        render(
            <FormPage
              socket={socket}
              handleBack={() => {}}
              handleSubmit={() => {}}
              dish={dish}
            />,
        );
    });
});

