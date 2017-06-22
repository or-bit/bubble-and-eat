import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { WebNotification } from 'monolith-frontend';
import io from 'socket.io-client';
import Order from './Order';

export default class CheBubble extends React.Component {

    constructor(props) {
        super(props);
        this.state = { orders: [], notify: null };
        this.socket = null;
    }

    // viene lanciato da solo al caricamento della bolla
    componentDidMount() {
        this.connect();
    }
    connect() {
        this.socket = io('https://order-gateway.herokuapp.com');
        this.socket.emit('auth', { type: 'cook' });
        this.fetchOrders();
        this.setState({ orders: [] });
    }

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

    disconnect() {
        this.socket.close();
    }

    markOrdinationCompleted(id) {
        if (this.socket !== null) {
            this.socket.emit('orderCompleted', id);
        } else {
            alert('You are not connected!');
        }
    }

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
