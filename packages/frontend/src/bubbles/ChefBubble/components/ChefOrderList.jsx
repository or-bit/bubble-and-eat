import React from 'react';
import PropTypes from 'prop-types';

import ChefOrderListItem from './ChefOrderListItem';

const ChefOrderList = ({ orders, handleOrderCompletionEvent }) => {
    const retrieveClassName = (index) => {
        if (index === orders.length - 1) {
            return '';
        }
        return 'divider';
    };

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
