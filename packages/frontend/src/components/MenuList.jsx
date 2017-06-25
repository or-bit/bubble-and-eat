import React from 'react';
import PropTypes from 'prop-types';

import MenuListItem from './MenuListItem';

const MenuList = ({ menu, isAdmin, handleEditForm, handleDelete }) => {
    let render = <h3 className="text-center">Menu is empty!</h3>;

    // render table head
    const renderHead = () => (
        <thead>
            <tr>
                <th className="text-center">
                Name
            </th>
                <th className="text-center">
                Ingredients
            </th>
                <th className="text-center">
                Price ($)
            </th>
                {isAdmin &&
                <th className="text-center">
                Actions
            </th>
            }
            </tr>
        </thead>
    );

    const renderBody = () => menu.map(dish => (
        <MenuListItem
          key={dish._id}
          dish={dish}
          isAdmin={isAdmin}
          handleEditForm={() => handleEditForm(dish)}
          handleDelete={() => handleDelete(dish._id)}
        />
            ));

    if (menu.length > 0) {
        render = (
            <table className="table">
                {renderHead()}
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        );
    }

    return render;
};

MenuList.propTypes = {
    menu: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool,
    handleEditForm: PropTypes.func,
    handleDelete: PropTypes.func,
};

MenuList.defaultProps = {
    isAdmin: false,
    handleDelete: () => {},
    handleEditForm: () => {},
};

export default MenuList;
