import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'monolith-frontend';

import DishesListItem from './DishesListItem';

const DishesList = ({
                        dishes,
                        amounts,
                        total,
                        handleOrderReset,
                        handleOrderNext,
                        handleInputChange,
                        handleAddDish,
                        handleRemoveDish,
                    }) => (
                        <div className="row">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-center">Name</th>
                                        <th className="text-center">Ingredients</th>
                                        <th className="text-center">Price</th>
                                        <th className="text-center">Amount</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dishes.map((dish, i) => (
                                        <DishesListItem
                                          dish={dish}
                                          index={i}
                                          amount={amounts[i]}
                                          handleInputChange={() => handleInputChange()}
                                          handleAddDish={() => handleAddDish(i)}
                                          handleRemoveDish={() => handleRemoveDish(i)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            <p>Total: {total}$</p>
                            <div className="row">
                                <Button
                                  text="Done"
                                  callback={() => handleOrderNext()}
                                />
                                <Button
                                  text="Reset Order"
                                  callback={() => handleOrderReset()}
                                />
                            </div>
                        </div>
);

DishesList.propTypes = {
    dishes: PropTypes.array.isRequired,
    amounts: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    handleOrderReset: PropTypes.func.isRequired,
    handleOrderNext: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleAddDish: PropTypes.func.isRequired,
    handleRemoveDish: PropTypes.func.isRequired,
};

export default DishesList;
