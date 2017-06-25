import React from 'react';
import PropTypes from 'prop-types';

import ChefDishListItem from './ChefDishListItem';

const ChefDishList = ({ dishes }) => (
    (
        <div>
            <h3>Dishes:</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Ingredients</th>
                        <th className="text-center">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {dishes.map(dish => (
                        <ChefDishListItem dish={dish} key={dish._id} />
                        ))}
                </tbody>
            </table>
        </div>
    ));

ChefDishList.propTypes = {
    dishes: PropTypes.array.isRequired,
};

export default ChefDishList;
