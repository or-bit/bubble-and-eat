import React from 'react';
import PropTypes from 'prop-types';

import { Button, WebNotification } from 'monolith-frontend';

/**
 * @class This class represents the order's summary page in the client's bubble.
 * @property props {Object}
 * @property props.socket {Socket} {@link socket}
 * @property props.handleBack {Function} Action to perform when back is clicked
 * @property socket {Socket} Socket for the connection to the server
 * @property state {Object}
 * @property state.total {Number} The total cost of the order
 * @property state.orderState {String} The state of the order
 * @property state.orderId {Number} The order's id
 */
export default class SummaryPage extends React.Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
            total: 0,
            orderState: 'Not ready yet...',
            orderId: '',
        };
    }

    /**
     * Invoked immediately after the component is mounted,
     * sets the connection.
     */
    componentDidMount() {
        this.socket.once('orderTotal', (total) => {
            this.setState({ total });
        });

        this.socket.once('orderId', (id) => {
            this.socket.emit('orderStatus', id);
            this.setState({
                orderId: id,
            });
        });

        this.socket.once('orderReady', () => {
            const title = 'Order ready!';
            const body = 'Your order is ready! We\'ll keep it warm for you... ;)';
            const imageUrl = 'http://www.pngmart.com/files/3/Green-Tick-PNG-Photos.png';
            new WebNotification(title, body, imageUrl).notify();
            this.setState({
                orderState: 'Order is ready!',
            });
        });
    }

    /**
     * Renders the menu page.
     * @returns {React.Component}
     */
    render() {
        return (
            <div className="row">
                <Button text="Back" callback={() => this.props.handleBack()} />
                <h2 className="text-center">Summary</h2>
                <h3 className="text-center">
                    Order state
                    <p className="text-info">{this.state.orderState}</p>
                </h3>
                <h3 className="text-center">Total: {this.state.total} $</h3>
                <h3 className="text-center">Order Ref. ID: {this.state.orderId}</h3>
                <Button
                  text="Refresh"
                  callback={() => this.socket.emit('orderStatus', this.state.orderId)}
                />
            </div>
        );
    }
}

SummaryPage.propTypes = {
    socket: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
};
