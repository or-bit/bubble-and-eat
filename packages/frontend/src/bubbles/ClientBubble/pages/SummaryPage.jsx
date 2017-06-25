import React from 'react';
import PropTypes from 'prop-types';

// import { WebNotification } from 'monolith-frontend';
import { Button } from 'monolith-frontend';

export default class SummaryPage extends React.Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
            total: 0,
            orderState: <p className="text-info">Not ready yet...</p>,
        };
    }

    render() {
        return (
            <div className="row">
                <Button text="Back" callback={() => this.props.handleBack()} />
                <h2 className="text-center">Summary</h2>
                <h3 className="text-center">Order state {this.state.orderState}</h3>
                <h3 className="text-center">Total: {this.state.total} $</h3>
            </div>
        );
    }
}

SummaryPage.propTypes = {
    socket: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
};
