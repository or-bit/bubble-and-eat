import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { GenericBubble, WebNotification, WidgetsContainer } from 'monolith-frontend';
import io from 'socket.io-client';
import config from 'bubble-and-eat-consts';

import MissingConnection from '../../components/MissingConnection';
// import Order from './old/Order';
import ChefOrderList from './components/ChefOrderList';


import './ChefBubble.css';

/**
 * @class Represents the Chef Bubble.
 * @param props {Object}
 * @extends GenericBubble
 * @property props {Object}
 * @property state {Object}
 * @property state.orders {Array} List of orders
 * @property state.alive {Boolean} Life state of the bubble
 * @property socket {Socket} Socket for the connection to the server
 */
export default class ChefBubble extends GenericBubble {

    /**
     * Creates a bubble for the chef.
     * @param props {Object}
     */
    constructor(props) {
        super(props);
        this.state = { orders: [], alive: true };
        this.socket = null;
    }

    /**
     * Invoked immediately after the component is mounted, calls the connect method.
     */
    componentDidMount() {
        this.connect();
        this.socket.on('disconnect', () => this.setState(
            { alive: false },
        ));
        this.socket.on('connect', () => this.setState(
            { alive: true },
        ));
    }

    /**
     * Manages the chef's connection to the application URL.
     */
    connect() {
        this.socket = io(config.getServerURL());
        this.socket.emit('auth', { type: 'chef' });
        this.fetchOrders();
        this.setState({ orders: [] });
    }

    /**
     * Manages the chef's orders request.
     */
    fetchOrders() {
        this.socket.on('activeOrdinations', (orders) => {
            console.log('Orders to fulfill:', orders);
            let title = '';
            let body = '';
            let icon = '';
            if (orders.length === 0) {
                title = 'No orders';
                body = 'Orders list is empty';
                icon = 'https://cdn0.iconfinder.com/data/icons/iconshock-windows7-icons/256/task_completed.png';
            } else {
                title = `You have ${orders.length} orders to do`;
                body = 'Back to work';
                icon = 'http://www.fitforafeast.com/images/recipes-cooking';
            }
            if (orders.length !== this.state.orders.length) {
                new WebNotification(title, body, icon).notify();
            }
            this.setState({ orders });
        });
        setTimeout(() => { this.socket.emit('ready'); }, 50);
    }

    /**
     * Manages chef disconnection.
     */
    disconnect() {
        this.socket.close();
    }

    /**
     * Manages the chef's request to complete an order with
     * the specified id, emit orderCompleted event on that order.
     * @param id {Number} Id of the order to complete
     */
    markOrdinationCompleted(id) {
        this.socket.emit('orderCompleted', id);
        const filterFunction = order => (
            order._id.toString() !== id
        );
        const newOrders = this.state.orders.filter(filterFunction);
        this.setState({
            orders: newOrders,
        });
        this.socket.on('orderCompletedCheck', () => this.socket.emit('ready'));
    }

    /**
     * Renders the bubble when there is no connection.
     * @override
     * @returns {React.Component}
     */
    // eslint-disable-next-line class-methods-use-this
    notAliveRender() {
        return <MissingConnection />;
    }

    /**
     * Renders the bubble when there is a connection.
     * @override
     * @returns {React.Component}
     */
    aliveRender() {
        const noOrdersRender = () => (
            <h3 className="text-center">No orders yet!</h3>
        );
        return (
            <WidgetsContainer>
                <h1 className="text-center">{"Chef's Bubble"}</h1>
                <div className="row">
                    <div className="col-md-12">
                        {this.state.orders.length === 0 && noOrdersRender()}
                    </div>
                </div>
                <ChefOrderList
                  orders={this.state.orders}
                  handleOrderCompletionEvent={id => this.markOrdinationCompleted(id)}
                />
                {this.state.notify}
            </WidgetsContainer>
        );
    }
}
