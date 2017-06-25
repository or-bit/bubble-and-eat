import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'monolith-frontend';

import ChefDishList from './ChefDishList';

/**
 * Module that renders on order item.
 * @module ChefOrderListItem
 * @param order {Object} Order to render
 * @param handleOrderCompletionEvent {Function} Action to execute when the order is set completed
 * @returns {React.Component}
 * @constructor
 */
const ChefOrderListItem = ({ order, handleOrderCompletionEvent }) => {
    const header = `Order ID: ${order._id}`;

    return (
        <div>
            <h3 className="text-center">{header}</h3>
            <ChefDishList dishes={order.dishes} />
            <Button
              text="This order is ready!"
              callback={() => handleOrderCompletionEvent(order)}
            />
        </div>
    );
};

ChefOrderListItem.propTypes = {
    order: PropTypes.object.isRequired,
    handleOrderCompletionEvent: PropTypes.func.isRequired,
};

export default ChefOrderListItem;
