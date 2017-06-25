import React from 'react';
import PropTypes from 'prop-types';
import { Button, InputText, Label } from 'monolith-frontend';

/**
 * @class This class represents a page with a form,
 *  used in the admin bubble to createOrder or edit dishes.
 * @property props {Object}
 * @property props.dish [undefined] {Object} Object representing a dish
 * @property props.socket {Socket} {@link socket}
 * @property props.handleBack {Function} Action to perform when back is clicked
 * @property props.handleSubmit {Function} Action to perform when submit is clicked
 * @property socket {Socket} Socket for the connection to the server
 * @property state {Object}
 * @property state._id {Number} Id of the current dish
 * @property state.name {String} Name of the current dish
 * @property state.ingredients {String} List of ingredients of the current dish
 * @property state.price {Number} Price of the current dish
 */
export default class FormPage extends React.Component {
    /**
     * Creates a form page with the given socket and dish.
     * @param props
     */
    constructor(props) {
        super(props);
        this.socket = props.socket;
        const existingDish = props.dish;
        this.state = {
            _id: existingDish ? existingDish._id : null,
            name: existingDish ? existingDish.name : '',
            ingredients: existingDish ? existingDish.ingredients : '',
            price: existingDish ? existingDish.price : '',
        };
    }

    /**
     * Handles changing of the dish name.
     * @param newName {String} New name to set
     */
    handleNameChange(newName) {
        this.setState({
            name: newName,
        });
    }

    /**
     * Handles changing of the ingredients.
     * @param newIngredients {String} New ingredients to set
     */
    handleIngredientsChange(newIngredients) {
        this.setState({
            ingredients: newIngredients,
        });
    }

    /**
     * Handles changing of the price.
     * @param newPrice {Number} New price to set
     */
    handlePriceChange(newPrice) {
        this.setState({
            price: newPrice,
        });
    }

    /**
     * Renders the page.
     * @returns {React.Component}
     */
    render() {
        const submitButtonLabel =
            this.props.dish ? 'Save changes' : 'Add dish';
        return (
            <div className="form-group">
                <Button text="Back" callback={() => this.props.handleBack()} />
                <p>Menu</p>

                <div>
                    <div className="form-group">
                        <Label forId="name" value="Name:" />
                        <InputText
                          className="form-control"
                          id="name"
                          value={this.state.name}
                          onTextChange={newValue => this.handleNameChange(newValue)}
                        />
                    </div>

                    <div className="form-group">
                        <Label forId="ingredients" value="Ingredients:" />
                        <InputText
                          className="form-control"
                          id="ingredients"
                          value={this.state.ingredients}
                          onTextChange={newValue => this.handleIngredientsChange(newValue)}
                        />
                    </div>


                    <div className="form-group">
                        <Label forId="price" value="Price:" />
                        <InputText
                          className="form-control"
                          id="price"
                          value={this.state.price}
                          onTextChange={newValue => this.handlePriceChange(newValue)}
                        />
                    </div>

                </div>

                <Button
                  text={submitButtonLabel}
                  callback={() => {
                      const dish = {
                          name: this.state.name,
                          ingredients: this.state.ingredients,
                          price: this.state.price,
                      };
                      if (this.state._id) {
                          dish._id = this.state._id;
                      }
                      this.props.handleSubmit(dish);
                  }}
                />
            </div>
        );
    }
}

FormPage.propTypes = {
    dish: PropTypes.object,
    socket: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

FormPage.defaultProps = {
    dish: undefined,
};
