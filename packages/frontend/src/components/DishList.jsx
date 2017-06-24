import React from 'react';
import PropTypes from 'prop-types';

import DishListItem from './DishListItem';

const DishList = ({ dishes }) => {
    const render = () => (
        <div>
            <h3>Dishes:</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Ingredients</th>
                        <th className="text-center">Amount</th>
                        <th className="text-center">Unitary price</th>
                    </tr>
                </thead>
                <tbody>
                    {dishes.map(dish => (
                        <DishListItem dish={dish} key={dish._id} />
                    ))}
                </tbody>
            </table>
        </div>
    );

    return render();
};

DishList.propTypes = {
    dishes: PropTypes.array.isRequired,
};

export default DishList;
