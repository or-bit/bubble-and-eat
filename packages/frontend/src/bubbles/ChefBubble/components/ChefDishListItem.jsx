import React from 'react';
import PropTypes from 'prop-types';

const ChefDishListItem = ({ dish }) => (
    (
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
        </tr>
    ));


ChefDishListItem.propTypes = {
    dish: PropTypes.object.isRequired,
};

export default ChefDishListItem;
