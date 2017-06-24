import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextView } from 'monolith-frontend';

import OrderListItem from './OrderListItem';

const OrderList = (
    {
        orders,
        handleDelete,
        filterCompletedOrders,
        filterActiveOrders,
        resetFilters,
    }) => {
    let render = <TextView text="No orders found! :(" />;

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
            <OrderListItem
              order={order}
            />
            {order.state === 'active' &&
            <Button
              className="button-danger btn btn-danger"
              text="Cancel order"
              callback={() => handleDelete(order)}
            />
                    }
        </div>
            ));

    if (orders.length > 0) {
        render = (
            <div>
                <Button
                  text="Show completed orders only"
                  callback={() => filterCompletedOrders()}
                />
                <Button
                  text="Show active orders only"
                  callback={() => filterActiveOrders()}
                />
                <Button
                  text="Reset filters"
                  callback={() => resetFilters()}
                />
                {renderOrders()}
            </div>
        );
    }

    return render;
};

OrderList.propTypes = {
    orders: PropTypes.array.isRequired,
    handleDelete: PropTypes.func.isRequired,
    filterCompletedOrders: PropTypes.func.isRequired,
    filterActiveOrders: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired,
};

export default OrderList;
