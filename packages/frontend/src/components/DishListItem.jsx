import React from 'react';
import PropTypes from 'prop-types';

const DishListItem = ({ dish }) => {
    const render = () => (
        <tr>
            <td>
                {dish.dish.name}
            </td>
            <td>
                {dish.dish.ingredients}
            </td>
            <td>
                {dish.amount}
            </td>
            <td>
                {dish.dish.price}
            </td>
        </tr>
    );

    return render();
};

DishListItem.propTypes = {
    dish: PropTypes.object.isRequired,
};

export default DishListItem;
