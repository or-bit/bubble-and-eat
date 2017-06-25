// Utility object

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
