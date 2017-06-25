import React from 'react';
import PropTypes from 'prop-types';

import { Button, InputText, Label } from 'monolith-frontend';

import OrderFactory from '../OrderFactory';

export default class ConfirmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientName: '',
        };
    }

    updateClient(newName) {
        this.setState({
            clientName: newName,
        });
    }

    orderConfirm() {
        return OrderFactory(
            this.props.amounts,
            this.props.dishes,
            this.state.clientName,
        );
    }

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
