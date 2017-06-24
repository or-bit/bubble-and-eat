import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { WebNotification } from 'monolith-frontend';
import io from 'socket.io-client';
import config from 'bubble-and-eat-consts';
import Order from './Order';

/**
 * @class This class allows you to create a class representing the Chef Bubble
 * @param props {Object}
 * @extends React.Component
 * @property props {Object}
 * @property state {Object}
 * @property state.orders {Array} List of orders.
 * @property socket {Socket} Socket for the connection to the server
 */
export default class ChefBubble extends React.Component {

    /**
     * Creates a bubble for the chef
     * @param props {Object}
     */
    constructor(props) {
        super(props);
        this.state = { orders: [], notify: null };
        this.socket = null;
    }

    /**
     * Invoked immediately after the component is mounted, calls the connect method
     */
    componentDidMount() {
        this.connect();
    }

    /**
     * Manage chef's connection to the application url
     */
    connect() {
        this.socket = io(config.getServerURL());
        this.socket.emit('auth', { type: 'cook' });
        this.fetchOrders();
        this.setState({ orders: [] });
    }

    /**
     * Manage chef's orders request
     */
    fetchOrders() {
        this.socket.on('activeOrdinations', (orders) => {
            console.log('ordinazioni da cucinare: ');
            console.log(orders);
            let title = '';
            let body = '';
            let icon = '';
            if (orders.length === 0) {
                title = 'No orders';
                body = 'InternalComms list empty';
                icon = 'https://cdn0.iconfinder.com/data/icons/iconshock-windows7-icons/256/task_completed.png';
            } else {
                title = `You have ${orders.length} orders to do`;
                body = 'Back to work';
                icon = 'http://www.fitforafeast.com/images/recipes-cooking';
            }
            this.setState({ orders });
            if (orders.length > 0) {
                new WebNotification(title, body, icon).notify();
            }
        });
        setTimeout(() => { this.socket.emit('ready'); }, 50);
    }

    /**
     * Manage chef disconnection
     */
    disconnect() {
        this.socket.close();
    }

    /**
     * Manage chef's request to complete an order with
     * the specified id, emit orderCompleted event on that order
     * @param id {Number} Id of the order to complete
     */
    markOrdinationCompleted(id) {
        if (this.socket !== null) {
            this.socket.emit('orderCompleted', id);
        } else {
            alert('You are not connected!');
        }
    }

    /**
     * Renders the bubble
     */
    render() {
        const noOrdersRender = () => (
            <h3 className="text-center">No orders yet!</h3>
        );
        return (
            <div>
                <h1 className="text-center">{"Chef's Bubble"}</h1>
                <div className="row">
                    <div className="col-md-12">
                        {this.state.orders.length === 0 && noOrdersRender()}
                    </div>
                </div>
                {this.state.orders.map(element => (
                    <Order
                      key={element.id} markOrdinationCompleted={this.markOrdinationCompleted}
                      socket={this.socket} element={element}
                    />
                ))}
                {this.state.notify}
            </div>
        );
    }
}
