import React from 'react';
import PropTypes from 'prop-types';

import { Button, InputText, Label } from 'monolith-frontend';

import OrderFactory from '../OrderFactory';
/**
 * @class This class represents a page,
 *  used in the client bubble to confirm an order.
 * @property props {Object}
 * @property props.amounts {Array} Array containing the dishe's amounts
 * @property props.dishes {Array} Array containing the list of disges
 * @property props.handleBack {Function} Action to perform when back is clicked
 * @property props.handleOrderConfirm {Function} Action to perform when the order is confirmed
 * @property state {Object}
 * @property state.clientName {String} Client's name
 */
export default class ConfirmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientName: '',
        };
    }

    /**
     * Updates the client's name
     * @param newName Name of the client
     */
    updateClient(newName) {
        this.setState({
            clientName: newName,
        });
    }

    /**
     * Confirms the placement of the order
     */
    orderConfirm() {
        return OrderFactory(
            this.props.amounts,
            this.props.dishes,
            this.state.clientName,
        );
    }

    /**
     * Renders the menu page.
     * @returns {React.Component}
     */
    render() {
        return (
            <div className="margin-left-1 margin-right-1">
                <div className="row">
                    <div className="col-md-12">
                        <Button
                          text="Recheck your order"
                          callback={() => this.props.handleBack()}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="text-center">Insert personal info</h3>
                    </div>
                </div>

                <div className="form-group">
                    <Label forId="name" value="Name" />
                    <InputText
                      className="form-control"
                      id="name"
                      value={this.state.clientName}
                      onTextChange={newText => this.updateClient(newText)}
                    />
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Button
                          className="btn-success"
                          text="Confirm Order"
                          callback={() => this.props.handleOrderConfirm(this.orderConfirm())}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ConfirmPage.propTypes = {
    amounts: PropTypes.array.isRequired,
    dishes: PropTypes.array.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleOrderConfirm: PropTypes.func.isRequired,
};
