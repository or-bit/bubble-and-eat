import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

const MenuListItem = ({ dish, isAdmin, handleEditForm, handleDelete }) => {
    const render = () => (
        <tr>
            <td>
                {dish.name}
            </td>
            <td>
                {dish.ingredients}
            </td>
            <td>
                {dish.price}
            </td>
            {isAdmin &&
            <td className="text-center">
                <Button
                  className="btn"
                  text="Edit"
                  callback={() => handleEditForm(dish)}
                />
                <Button
                  className="button-danger btn btn-danger"
                  text="Delete"
                  callback={() => handleDelete(dish._id)}
                />
            </td>
            }
        </tr>
    );

    return render();
};

MenuListItem.propTypes = {
    dish: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool,
    handleEditForm: PropTypes.func,
    handleDelete: PropTypes.func,
};

MenuListItem.defaultProps = {
    isAdmin: false,
    handleDelete: () => {},
    handleEditForm: () => {},
};

export default MenuListItem;
