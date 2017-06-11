import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { WebNotification } from 'monolith-frontend';
import io from 'socket.io-client';
import Order from './Order';

export default class CookBubble extends React.Component {

    constructor(props) {
        super(props);
        this.state = { ordinations: [] };
        this.socket = null;
    }

    // viene lanciato da solo al caricamento della bolla
    componentDidMount() {
        this.connect();
    }
    connect() {
        this.socket = io('http://localhost:3333');
        this.socket.emit('auth', { type: 'cook' });
        this.fetchOrders();
        this.setState({ ordinations: [] });
    }

    fetchOrders() {
        this.socket.on('activeOrdinations', (ordinations) => {
            console.log('ordinazioni da cucinare: ');
            console.log(ordinations);
            let title = '';
            let body = '';
            let icon = '';
            if (ordinations.length === 0) {
                title = 'No orders';
                body = 'Orders list empty';
                icon = 'https://cdn0.iconfinder.com/data/icons/iconshock-windows7-icons/256/task_completed.png';
            } else {
                title = `You have ${ordinations.length} orders to do`;
                body = 'Back to work';
                icon = 'http://www.fitforafeast.com/images/recipes-cooking';
            }
            this.setState({ ordinations });
            const notifica = new WebNotification(title, body, icon);
            notifica.notify();
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
        return (
            <div>
                <h1 className="text-center">Chef's Bubble</h1>
                <div className="row">
                    <div className="col-md-12">
                        {this.state.ordinations.length === 0 && <h3 className="text-center">No ordinations yet!</h3>}
                    </div>
                </div>
                {this.state.ordinations.map(element => (
                    <Order
                      key={element._id} markOrdinationCompleted={this.markOrdinationCompleted}
                      socket={this.socket} element={element}
                    />
                ))}
            </div>
        );
    }
}
