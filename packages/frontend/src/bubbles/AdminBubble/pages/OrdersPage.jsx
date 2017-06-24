import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

import OrderList from '../../../components/OrderList';

export default class OrdersPage extends React.Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
            orders: [],
        };
    }

    componentDidMount() {
        this.syncOrders();
    }

    syncOrders() {
        this.socket.on('allOrders', orders => this.setState({ orders }));
        this.socket.emit('allOrders');
    }

    filterCompletedOrders() {
        this.syncOrders();
        this.socket.on('completedOrders', orders => (
            this.setState({ orders })
        ));
        this.socket.emit('completedOrders');
    }

    filterActiveOrders() {
        this.syncOrders();
        this.socket.on('activeOrders', orders => (
            this.setState({ orders })
        ));
        this.socket.emit('activeOrders');
    }

    resetFilters() {
        this.syncOrders();
    }

    handleDelete(order) {
        this.socket.on('deleteOrder', () => this.syncOrders());
        this.socket.emit('deleteOrder', order._id);
    }

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
