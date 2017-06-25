import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

import OrderList from '../../../components/OrderList';

/**
 * @class This class represents the orders page in the admin bubble.
 * @property props {Object}
 * @property props.socket {Socket} {@link socket}
 * @property props.handleBack {Function} Action to perform when back is clicked
 * @property socket {Socket} Socket for the connection to the server
 * @property state {Object}
 * @property state.orders {Array} Orders made by clients
 */
export default class OrdersPage extends React.Component {
    /**
     * Create the orders page.
     * @param props {Object}
     */
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
            orders: [],
        };
    }

    /**
     * Invoked immediately after the component is mounted,
     * syncs the orders.
     */
    componentDidMount() {
        this.syncOrders();
    }

    /**
     * Synchronizes the orders.
     */
    syncOrders() {
        this.socket.on('allOrders', orders => this.setState({ orders }));
        this.socket.emit('allOrders');
    }

    /**
     * Filters the orders and extracts the completed ones.
     */
    filterCompletedOrders() {
        this.syncOrders();
        this.socket.on('completedOrders', orders => (
            this.setState({ orders })
        ));
        this.socket.emit('completedOrders');
    }

    /**
     * Filters the orders and extracts the active ones.
     */
    filterActiveOrders() {
        this.syncOrders();
        this.socket.on('activeOrders', orders => (
            this.setState({ orders })
        ));
        this.socket.emit('activeOrders');
    }

    /**
     * Reset filters.
     */
    resetFilters() {
        this.syncOrders();
    }

    /**
     * Handles the removal of an order.
     * @param order {Object} Order removed
     */
    handleDelete(order) {
        this.socket.on('deleteOrder', () => this.syncOrders());
        this.socket.emit('deleteOrder', order._id);
    }

    /**
     * Renders the order page.
     * @returns {React.Component}
     */
    render() {
        return (
            <div>
                <Button text="Back" callback={() => this.props.handleBack()} />
                <h2 className="text-center">
                    Orders
                </h2>
                <OrderList
                  orders={this.state.orders}
                  handleDelete={order => this.handleDelete(order)}
                  filterActiveOrders={() => this.filterActiveOrders()}
                  filterCompletedOrders={() => this.filterCompletedOrders()}
                  resetFilters={() => this.resetFilters()}
                />
            </div>
        );
    }
}

OrdersPage.propTypes = {
    socket: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
};
