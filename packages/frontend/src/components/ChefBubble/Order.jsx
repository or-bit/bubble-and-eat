import React from 'react';
import PropTypes from 'prop-types';

/**
 * @class Class that renders an order for the chef
 * @extends React.Component
 * @property props {Object}
 * @property props.markOrdinationComplete {function} Action to execute to mark an order completed
 * @property props.element {Object} Order to render
 * @property props.socket {Socket} Socket for the connection to the server
 */
export default class Order extends React.Component {
    /**
     * Create a graphic order
     * @param props {Object}
     */
    constructor(props) {
        super(props);
        this.socket = this.props.socket;
    }

    /**
     * Marks the current order completed
     */
    markOrdinationCompleted() {
        this.props.markOrdinationCompleted(this.props.element._id);
    }

    /**
     * Renders the order
     * @return {React.Component}
     */
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
