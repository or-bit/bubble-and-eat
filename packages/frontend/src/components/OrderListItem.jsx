import React from 'react';
import PropTypes from 'prop-types';
import { TextView } from 'monolith-frontend';

import ClientInfo from './ClientInfo';
import DishList from './DishList';

const OrderListItem = ({ order }) => {
    const render = () => (
        <div className="row">
            <div className="col-sm-3">
                <ClientInfo client={order.client} />
                <TextView text={`Order state: ${order.state}`} />
                <TextView text={`Total: ${order.total}`} />
            </div>
            <div className="col-sm-9">
                <DishList dishes={order.dishes} />
            </div>
        </div>
    );

    return render();
};

OrderListItem.propTypes = {
    order: PropTypes.object.isRequired,
};

export default OrderListItem;
