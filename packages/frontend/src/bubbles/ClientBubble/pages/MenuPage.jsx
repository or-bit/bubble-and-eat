import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

import MenuList from '../../../components/MenuList';

export default class MenuPage extends React.Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
            menu: [],
        };
    }

    componentDidMount() {
        this.syncMenu();
    }

    syncMenu() {
        this.socket.on('menu', (menu) => {
            this.setState({ menu });
        });
        this.socket.emit('menuRequest');
    }

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
