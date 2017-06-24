/**
 * chef module
 * @module chef
 */

import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { WebNotification } from 'monolith-frontend';
import io from 'socket.io-client';
import Order from './Order';

/**
 * This module allows you to create a class representing the Chef Bubble
 * @module bubble-and-eat/packages/frontend/src/components
 * @param props
 * @constructor
 */
export default class CheBubble extends React.Component {
     /**
     * @class ChefBubble -
     * @extends Component
     * @property props {Object}
     * @property props.state { orders: [], notify: null } - orders state.
     * @property props.state { socket } - connection socket.
    */
    constructor(props) {
        super(props);
        this.state = { orders: [], notify: null };
        this.socket = null;
    }

    /**
    * @function
    * @name componentDidMount
    * @desc invoked immediately after the component is mounted, calls the connect method
    */
    componentDidMount() {
        this.connect();
    }

    /**
    * @function
    * @name connect
    * @desc manage chef's connection to the application url
    */
    connect() {
        this.socket = io('https://order-gateway.herokuapp.com');
        this.socket.emit('auth', { type: 'cook' });
        this.fetchOrders();
        this.setState({ orders: [] });
    }

    /**
    * @function
    * @name fetchOrders
    * @desc manage chef's orders request
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
                body = 'Orders list empty';
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
    * @function
    * @name disconnect
    * @desc manage chef disconnection
    */
    disconnect() {
        this.socket.close();
    }

    /**
    * @function
    * @name markOrdinationCompleted
    * @param orderID {Integer} - order to complete
    * @desc manage chef's request to complete an order with the specified id, emit orderCompleted event on that order
    */
    markOrdinationCompleted(id) {
        if (this.socket !== null) {
            this.socket.emit('orderCompleted', id);
        } else {
            alert('You are not connected!');
        }
    }

    /**
    * @function
    * @name render
    * @desc renders chef's empty order page
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
