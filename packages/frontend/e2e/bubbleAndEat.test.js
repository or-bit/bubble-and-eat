import React from 'react';
import renderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import io from 'socket.io-client';
import ClientBubble from '../src/bubbles/ClientBubble/ClientBubble';


test('TI26', (done) => {
    const clientBubble = ReactTestUtils.renderIntoDocument(<ClientBubble />);
    const socket = io('http://localhost:3001');
    clientBubble.showMenu();
    socket.on('menu', (menu) => {
        const result = menu.length === 0 || (
            menu.length !== 0 &&
            menu[0].id !== null &&
            menu[0].name !== null &&
            menu[0].price !== null);
        expect(result).toEqual(true);
        socket.close();
        done();
    });
    socket.emit('auth', { type: 'client' });
    socket.emit('menuRequest');
});


test('TI27', () => {
    const clientBubble = ReactTestUtils.renderIntoDocument(<ClientBubble />);
    clientBubble.setState({ menu: [] });
    clientBubble.redirectToMenu();
    const component = renderer.create(
        clientBubble.render(),
    );
    expect(component.toJSON().children[1].children[2].children[0]).toBe('Menu is empty!');
});


test('TI28', (done) => {
    const socket = io('http://localhost:3001');
    const clientBubble = ReactTestUtils.renderIntoDocument(<ClientBubble />);
    clientBubble.order({
        client: { name: 'name' },
        dishes: [{ dish: { id: 999, name: 'prova', price: 3 }, amount: 2 }],
        state: 'active',
    });
    socket.on('activeOrdinations', (orders) => {
        const order = orders[orders.length - 1];
        const result = order.client.name === 'name' &&
            order.dishes[0].amount === 2 &&
            order.state === 'active';
        expect(result).toBe(true);
        socket.close();
        done();
    });
    socket.emit('auth', { type: 'chef' });
    setTimeout(() => {
        socket.emit('ready');
    }, 200);
});

/*
test('TI30', (done) => {
    const clientBubble = ReactTestUtils.renderIntoDocument(<ClientBubble />);
    const len1 = adminBubble.state.allOrders.length;
    clientBubble.order({
        client: { name: 'name', address: 'address' },
        dishes: [{ dish: { id: 999, name: 'prova', price: 3 }, amount: 2 }],
        state: 'active',
    });
    adminBubble.fetchAllOrders();
    setTimeout(() => {
        const len2 = adminBubble.state.allOrders.length;
        expect(len2).toBeGreaterThan(len1);
        done();
    }, 1000);
});
*/

test('TI30', (done) => {
    let first = true;
    let preLength = 0;
    let postLength = 0;
    const socket = io('http://localhost:3001/');
    const clientBubble = ReactTestUtils.renderIntoDocument(<ClientBubble />);
    socket.on('allOrders', (orders) => {
        if (first) {
            preLength = orders.length;
            first = false;
        } else {
            postLength = orders.length;
            expect(preLength).toBeLessThan(postLength);
            socket.close();
            done();
        }
    });
    socket.emit('auth', { type: 'admin' });
    socket.emit('addDish', { id: 999, name: 'prova', price: 3 });
    setTimeout(() => {
        socket.emit('allOrders');
        setTimeout(() => {
            clientBubble.order({
                client: { name: 'name' },
                dishes: [{ dish: { id: 999, name: 'prova', price: 3 }, amount: 2 }],
                state: 'active',
            });
            setTimeout(() => {
                socket.emit('allOrders');
            }, 200);
        }, 200);
    }, 200);
});

test('TI32', (done) => {
    let first = true;
    let preLength = 0;
    let postLength = 0;
    const socket = io('http://localhost:3001');
    const clientBubble = ReactTestUtils.renderIntoDocument(<ClientBubble />);
    socket.on('activeOrdinations', (orders) => {
        if (first) {
            preLength = orders.length;
            first = false;
        } else {
            postLength = orders.length;
            expect(preLength).toBeLessThan(postLength);
            socket.close();
            done();
        }
    });
    socket.emit('auth', { type: 'chef' });
    socket.emit('ready');
    clientBubble.order({
        client: { name: 'name' },
        dishes: [{ dish: { id: 999, name: 'prova', price: 3 }, amount: 2 }],
        state: 'active',
    });
    setTimeout(() => {
        socket.emit('ready');
    }, 200);
});

test('TI33', (done) => {
    const socket = io('http://localhost:3001');
    const socket2 = io('http://localhost:3001');
    let id;
    const clientBubble = ReactTestUtils.renderIntoDocument(<ClientBubble />);
    clientBubble.order({
        client: { name: 'name2' },
        dishes: [{ dish: { id: 999, name: 'prova2', price: 3 }, amount: 2 }],
        state: 'active',
    });
    socket.on('activeOrdinations', (orders) => {
        id = orders[orders.length - 1]._id;
        socket.emit('orderCompleted', id);
        socket.close();
    });
    socket2.on('allOrders', (orders) => {
        const state = orders[orders.length - 1].state;
        expect(state).toBe('completed');
        socket.close();
        socket2.close();
        done();
    });
    socket.emit('auth', { type: 'chef' });
    socket2.emit('auth', { type: 'admin' });
    setTimeout(() => {
        socket.emit('ready');
        setTimeout(() => {
            socket2.emit('allOrders');
        }, 200);
    }, 200);
});

test('TI42', (done) => {
    let id;
    let found = false;
    const socket = io('http://localhost:3001');
    const socket2 = io('http://localhost:3001');
    const clientBubble = ReactTestUtils.renderIntoDocument(<ClientBubble />);
    clientBubble.order({
        client: { name: 'name5' },
        dishes: [{ dish: { id: 999, name: 'prova2', price: 3 }, amount: 2 }],
        state: 'active',
    });
    socket.on('allOrders', (orders) => {
        id = orders[orders.length - 1]._id;
        socket.emit('deleteOrder', id);
    });
    socket.on('deleteOrder', () => {
        socket2.emit('menuRequest');
        socket.close();
    });
    socket2.on('menu', (menu) => {
        menu.forEach((item) => {
            if (item._id === id) {
                found = true;
            }
        });
        expect(found).toBe(false);
        socket2.close();
        done();
    });
    socket.emit('auth', { type: 'admin' });
    socket2.emit('auth', { type: 'client' });
    setTimeout(() => {
        socket.emit('allOrders');
    }, 200);
});


test('TI44', (done) => {
    let first = true;
    let preLength = 0;
    let postLength = 0;
    const socket = io('http://localhost:3001');
    const socket2 = io('http://localhost:3001');
    socket.on('addedDish', () => {
        socket2.emit('menuRequest');
        socket.close();
    });
    socket2.on('menu', (menu) => {
        if (first) {
            preLength = menu.length;
            first = false;
        } else {
            postLength = menu.length;
            expect(preLength).toBeLessThan(postLength);
            socket2.close();
            done();
        }
    });
    socket.emit('auth', { type: 'admin' });
    socket2.emit('auth', { type: 'client' });
    setTimeout(() => {
        socket2.emit('menuRequest');
        setTimeout(() => {
            socket.emit('addDish', { id: 333, name: 'prova', price: 5 });
        }, 200);
    }, 200);
});
