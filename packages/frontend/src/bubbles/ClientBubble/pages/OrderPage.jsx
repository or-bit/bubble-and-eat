import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

import DishesList from '../components/DishesList';
import ConfirmPage from './ConfirmPage';

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

    componentDidMount() {
        this.socket.on('menu', (menu) => {
            // initialize amounts array with 0s
            const amounts = menu.map(() => 0);
            this.setState({ menu, amounts });
        });
        this.socket.emit('menuRequest');
    }

    handleAddDish(index) {
        const dishAmount = this.state.amounts[index] + 1;
        this.updateAmount(dishAmount, index);
    }

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

    handleRemoveDish(index) {
        const dishAmount = this.state.amounts[index] - 1;
        this.updateAmount(dishAmount, index);
    }

    handleOrderNext() {
        this.setState({
            page: this.orderConfirmPage,
        });
    }

    renderHeader() {
        return (
            <div>
                <Button text="Back" callback={() => this.handleBack()} />
                <h2 className="text-center">New Order</h2>
            </div>
        );
    }

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
