import React from 'react';
import PropTypes from 'prop-types';
import { Button, InputText, Label } from 'monolith-frontend';

export default class FormPage extends React.Component {
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

    handleNameChange(newName) {
        this.setState({
            name: newName,
        });
    }

    handleIngredientsChange(newIngredients) {
        this.setState({
            ingredients: newIngredients,
        });
    }

    handlePriceChange(newPrice) {
        this.setState({
            price: newPrice,
        });
    }

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
