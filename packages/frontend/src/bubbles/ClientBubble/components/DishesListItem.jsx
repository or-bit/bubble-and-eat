import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'monolith-frontend';

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
