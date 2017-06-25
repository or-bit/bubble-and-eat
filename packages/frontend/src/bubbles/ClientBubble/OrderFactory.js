// Utility object

/**
 * Creates a new order.
 * @module createOrder
 * @param amounts {Array} List of the dishes' amounts
 * @param dishes {Array} List of dishes
 * @param name {Array} Name of the user placing the order
 * @return {Object} Returns an order.
 * @constructor
 */
const createOrder = (amounts, dishes, name) => {
    const dishesWithAmounts = [];
    for (let i = 0; i < amounts.length; i += 1) {
        if (amounts[i] > 0) {
            dishesWithAmounts.push({
                dish: dishes[i],
                amount: amounts[i],
            });
        }
    }
    return {
        client: {
            name,
        },
        dishes: dishesWithAmounts,
        state: '',
    };
};

export default createOrder;
