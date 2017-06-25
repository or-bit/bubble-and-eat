import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

import DishesList from '../components/DishesList';
import ConfirmPage from './ConfirmPage';

/**
 * @class This class represents the order's page in the client's bubble.
 * @property props {Object}
 * @property props.socket {Socket} {@link socket}
 * @property props.handleBack {Function} Action to perform when back is clicked
 * @property props.handleCompletedOrder {Function} Action to perform when the order is signaled as complete
 * @property socket {Socket} Socket for the connection to the server
 * @property state {Object}
 * @property state.amounts {Array} Array containing the different dishe's amounts
 * @property state.menu {Array} The array containing the dishes in the menu
 * @property state.total {Number} The order's total
 * @property state.page {Object} The current page
 */
export default class OrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.homePage = 'home';
        this.orderConfirmPage = 'order';
        this.handleBack = props.handleBack;
        this.state = {
            amounts: [],
            menu: [],
            total: 0,
            page: this.homePage,
        };
    }

    /**
     * Invoked immediately after the component is mounted,
     * sets the connection.
     */
    componentDidMount() {
        this.socket.on('menu', (menu) => {
            // initialize amounts array with 0s
            const amounts = menu.map(() => 0);
            this.setState({ menu, amounts });
        });
        this.socket.emit('menuRequest');
    }

    /**
     * Handles the addition of a dish to the order.
     * @param index the index of the dish whose amount has to be increased
     */
    handleAddDish(index) {
        const dishAmount = this.state.amounts[index] + 1;
        this.updateAmount(dishAmount, index);
    }

    /**
     * Handles the reset of the order.
     */
    handleOrderReset() {
        for (let i = 0; i < this.state.amounts.length; i += 1) {
            this.handleInputChange({ target: { value: 0 } }, i);
        }
    }

    /**
     * This method handles the changes in the amount of ordered portions for the selected dish.
     * It calls the updateAmount method after converting into an int the amount of portions.
     * @param e {Event}
     * @param i {Number} index in the amounts array
     */
    handleInputChange(e, index) {
        this.updateAmount(parseInt(e.target.value, 10), index);
    }

    /**
     * Calculates and returns the total cost of all the dishes selected for the current order.
     * @returns {Number} Total cost of the order.
     */
    reloadTotal() {
        let total = 0;
        for (let i = 0; i < this.state.amounts.length; i += 1) {
            if (this.state.amounts[i] !== 0) {
                total += (this.state.menu[i].price * this.state.amounts[i]);
            }
        }
        return total;
    }

    /**
     * This method updates a specific dish's amount
     * of portions as well as the total cost of the order.
     * @param amount {Number} New amount
     * @param i {Number} Which item to update
     */
    updateAmount(amount, i) {
        const amounts = this.state.amounts;
        if (amount > 0) {
            amounts[i] = amount;
        } else {
            amounts[i] = 0;
        }
        const total = this.reloadTotal();
        this.setState({ amounts, total });
    }

    /**
     * Handles the removal from the order of a dishe's portion
     * @param index The index of the dish that must be removed from the order
     */
    handleRemoveDish(index) {
        const dishAmount = this.state.amounts[index] - 1;
        this.updateAmount(dishAmount, index);
    }

    /**
     * Handles the placement of the order and takes the client to the confirm page
     */
    handleOrderNext() {
        this.setState({
            page: this.orderConfirmPage,
        });
    }

    /**
     * Renders the header.
     * @return {React.Component}
     */
    renderHeader() {
        return (
            <div>
                <Button text="Back" callback={() => this.handleBack()} />
                <h2 className="text-center">New Order</h2>
            </div>
        );
    }

    /**
     * Renders the home page.
     * @return {React.Component}
     */
    renderHomePage() {
        return (
            <DishesList
              dishes={this.state.menu}
              amounts={this.state.amounts}
              total={this.state.total}
              handleOrderReset={() => this.handleOrderReset()}
              handleOrderNext={() => this.handleOrderNext()}
              handleInputChange={(e, index) => this.handleInputChange(e, index)}
              handleAddDish={index => this.handleAddDish(index)}
              handleRemoveDish={index => this.handleRemoveDish(index)}
            />
        );
    }

    /**
     * Renders the entire bubble.
     * @returns {React.Component}
     */
    render() {
        let page = this.renderHomePage();

        switch (this.state.page) {
        case this.orderConfirmPage:
            page = (
                <ConfirmPage
                  amounts={this.state.amounts}
                  dishes={this.state.menu}
                  handleBack={() => this.setState({ page: this.homePage })}
                  handleOrderConfirm={order => this.props.handleCompletedOrder(order)}
                />
            );
            break;
        default:
            break;
        }

        return (
            <div>
                {this.renderHeader()}
                {page}
            </div>
        );
    }
}

OrderPage.propTypes = {
    socket: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleCompletedOrder: PropTypes.func.isRequired,
};
