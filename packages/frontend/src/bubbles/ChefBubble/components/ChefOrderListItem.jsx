import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'monolith-frontend';

import ChefDishList from './ChefDishList';

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
