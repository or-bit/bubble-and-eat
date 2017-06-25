import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

import MenuList from '../../../components/MenuList';
import FormPage from './FormPage';

/**
 * @class This class represents the menu page in the admin bubble.
 * @property props {Object}
 * @property props.socket {Socket} {@link socket}
 * @property props.handleBack {Function} Action to perform when back is clicked
 * @property socket {Socket} Socket for the connection to the server
 * @property state {Object}
 * @property state.manu {Array} Menu of the restaurant
 * @property state.page {String} Page currently displayed in the bubble.
 */
export default class MenuPage extends React.Component {
    /**
     * Create the menu page in its home section.
     * @param props {Object}
     */
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
            menu: [],
            page: 'menu-home',
        };
    }

    /**
     * Invoked immediately after the component is mounted,
     * calls {@link syncMenu()}.
     */
    componentDidMount() {
        this.syncMenu();
    }

    /**
     * Synchronizes the menu.
     */
    syncMenu() {
        this.socket.on('menu', (menu) => {
            this.setState({ menu });
        });
        this.socket.emit('menu');
    }

    /**
     * Shows the form to add a new dish.
     */
    showAddDishForm() {
        this.setState({
            page: 'menu-form-add',
        });
    }

    /**
     * Shows the form to edit a dish.
     * @param selectedDish {Object} Dish to edit
     */
    showEditDishForm(selectedDish) {
        this.setState({
            selectedDish,
            page: 'menu-form-edit',
        });
    }

    /**
     * Shows the default page (menu-home).
     */
    showDefaultPage() {
        this.setState({
            page: 'menu-home',
        });
    }

    /**
     * Handles the completion of adding a dish.
     * @param newDish {Object} The added dish
     */
    handleAddFormResult(newDish) {
        this.socket.on('addedDish', () => {
            this.syncMenu();
            this.setState({
                page: 'menu-home',
            });
        });
        this.socket.emit('addDish', newDish);
    }

    /**
     * Handles the completion of editing a dish.
     * @param newDish {Object} The edited dish
     */
    handleEditFormResult(newDish) {
        this.socket.emit('editDish', {
            id: newDish._id,
            dish: newDish,
        });
        this.syncMenu();
        this.setState({
            page: 'menu-home',
        });
    }

    /**
     * Handles the removal of a dish.
     * @param id {Number} Id of the dish removed
     */
    handleDelete(id) {
        this.socket.emit('removeDish', id);
        this.syncMenu();
    }

    /**
     * Renders the default page.
     * @returns {React.Component}
     */
    renderDefaultPage() {
        return (
            <div className="row">
                <Button text="Back" callback={() => this.props.handleBack()} />
                <h2 className="text-center">
                    Menu
                </h2>
                <MenuList
                  menu={this.state.menu}
                  isAdmin
                  handleDelete={id => this.handleDelete(id)}
                  handleEditForm={selectedDish => this.showEditDishForm(selectedDish)}
                />
                <Button text="Add dish" callback={() => this.showAddDishForm()} />
            </div>
        );
    }

    /**
     * Renders the menu page.
     * @returns {React.Component}
     */
    render() {
        let page = this.renderDefaultPage();

        switch (this.state.page) {
        case 'menu-form-add':
            page = (
                <FormPage
                  handleBack={() => this.showDefaultPage()}
                  handleSubmit={newDish => this.handleAddFormResult(newDish)}
                />
            );
            break;
        case 'menu-form-edit':
            page = (
                <FormPage
                  dish={this.state.selectedDish}
                  handleBack={() => this.showDefaultPage()}
                  handleSubmit={newDish => this.handleEditFormResult(newDish)}
                />
            );
            break;
        default:
            break;
        }
        return page;
    }
}

MenuPage.propTypes = {
    socket: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
};
