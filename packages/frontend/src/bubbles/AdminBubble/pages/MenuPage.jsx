import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

import MenuList from '../../../components/MenuList';
import FormPage from './FormPage';

export default class MenuPage extends React.Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
            menu: [],
            page: 'menu-home',
        };
    }

    componentDidMount() {
        this.syncMenu();
    }

    syncMenu() {
        this.socket.on('menu', (menu) => {
            this.setState({ menu });
        });
        this.socket.emit('menu');
    }

    showAddDishForm() {
        this.setState({
            page: 'menu-form-add',
        });
    }

    showEditDishForm(selectedDish) {
        this.setState({
            selectedDish,
            page: 'menu-form-edit',
        });
    }

    showDefaultPage() {
        this.setState({
            page: 'menu-home',
        });
    }

    handleAddFormResult(newDish) {
        this.socket.on('addedDish', () => {
            this.syncMenu();
            this.setState({
                page: 'menu-home',
            });
        });
        this.socket.emit('addDish', newDish);
    }

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

    handleDelete(id) {
        this.socket.emit('removeDish', id);
        this.syncMenu();
    }

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
