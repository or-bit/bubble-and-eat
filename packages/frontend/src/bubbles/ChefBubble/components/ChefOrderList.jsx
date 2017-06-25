import React from 'react';
import PropTypes from 'prop-types';

import ChefOrderListItem from './ChefOrderListItem';

/**
 * Module that renders a list of orders in the chef bubble.
 * @module ChefOrderList
 * @param orders {Array} List of orders
 * @param handleOrderCompletionEvent {Function} Action to execute when an order is set completed.
 * @returns {React.Component}
 * @constructor
 */
const ChefOrderList = ({ orders, handleOrderCompletionEvent }) => {
    /**
     * Get the class for the element to render.
     * @function
     * @param index {Number} Index of the element
     * @returns {String} Class to set
     */
    const retrieveClassName = (index) => {
        if (index === orders.length - 1) {
            return '';
        }
        return 'divider';
    };

    /**
     * Renders the orders
     * @function
     * @returns {React.Component}
     */
    const renderOrders = () => orders.map((order, index) => (
        <div
          key={order._id}
          className={retrieveClassName(index)}
        >
            <ChefOrderListItem
              order={order}
              handleOrderCompletionEvent={() => handleOrderCompletionEvent(order._id.toString())}
            />
        </div>
    ));

    return <div>{renderOrders()}</div>;
};

ChefOrderList.propTypes = {
    orders: PropTypes.array.isRequired,
    handleOrderCompletionEvent: PropTypes.func.isRequired,
};

export default ChefOrderList;
