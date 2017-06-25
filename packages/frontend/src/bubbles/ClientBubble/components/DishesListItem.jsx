import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'monolith-frontend';
/**
 * (pure function) Module that renders a single dish.
 * @module DishesListItem
 * @param dish {Object}
 * @param dish.name {String} The dish's name
 * @param dish.ingredients {String} The dishe's ingredients
 * @param dish.price {Number} The dish's price
 * @param index {Number} The dish's index
 * @param amount {Number} The dish's amount
 * @param handleInputChange {Function} Action to execute when there is an input
 * @param handleAddDish {Function} Action to execute when a dish is added
 * @param handleRemoveDish {Function} Action to execute when a dish is removed
 * @constructor
 */
const DishesListItem = ({
                            dish,
                            index,
                            amount,
                            handleInputChange,
                            handleAddDish,
                            handleRemoveDish,
}) => (
    <tr>
        <td>{dish.name}</td>
        <td>{dish.ingredients}</td>
        <td>{dish.price}{' $'}</td>
        <td>
            <input
              className="form-control"
              name="amount" type="number"
              value={amount} label=""
              min="0"
              step="1"
              onChange={e => handleInputChange(e, index)}
            />
        </td>
        <td>
            <Button
              text="+"
              callback={() => handleAddDish(index)}
            />
            <Button
              text="-"
              callback={() => handleRemoveDish(index)}
            />
        </td>
    </tr>
);

DishesListItem.propTypes = {
    dish: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleAddDish: PropTypes.func.isRequired,
    handleRemoveDish: PropTypes.func.isRequired,
};

export default DishesListItem;
