import React from 'react';
import PropTypes from 'prop-types';

export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.socket = this.props.socket;
    }

    markOrdinationCompleted() {
        this.props.markOrdinationCompleted(this.props.element._id);
    }

    render() {
        const renderDish = order => (
            <tr key={order._id}>
                <td>{order.dish.name}</td>
                <td className="text-right">{order.amount}</td>
            </tr>
        );

        return (
            <div className="margin-right-1 margin-left-1  well">
                {<div >
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.element.dishes.map(dish => renderDish(dish))}
                        </tbody>
                    </table>
                </div>
                }
                <div className="row">
                    <div className="row-md-12">
                        <button
                          className="btn btn-danger center-block"
                          onClick={() => this.markOrdinationCompleted()}
                        >
                            This order is ready!
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

/* eslint-disable react/forbid-prop-types */
Order.propTypes = {
    socket: PropTypes.object.isRequired,
    element: PropTypes.object.isRequired,
    markOrdinationCompleted: PropTypes.func.isRequired,
};
