import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

import MenuList from '../../../components/MenuList';

socket: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
/**
 * @class This class represents a page,
 *  used in the client bubble to show the menu.
 * @property props {Object}
 * @property props.socket {Socket} {@link socket}
 * @property props.handleBack {Function} Action to perform when back is clicked
 * @property state {Object}
 * @property state.manu {Array} Menu of the restaurant
 */
export default class MenuPage extends React.Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
            menu: [],
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
        this.socket.emit('menuRequest');
    }

    /**
     * Renders the menu page.
     * @returns {React.Component}
     */
    render() {
        return (
            <div className="row">
                <Button text="Back" callback={() => this.props.handleBack()} />
                <h2 className="text-center">
                    Menu
                </h2>
                <MenuList menu={this.state.menu} />
            </div>
        );
    }
}

MenuPage.propTypes = {
    socket: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
};
