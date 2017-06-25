import { GenericBubble, WidgetsContainer } from 'monolith-frontend';
import React from 'react';
import io from 'socket.io-client';

// importing pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';

import MissingConnection from '../../components/MissingConnection';
import './AdminBubble.css';

/**
 * @class This class represents the Admin Bubble.
 * @extends GenericBubble
 * @property props {Object}
 * @property state {Object}
 * @property state.menu {Array} The restaurant's menu
 * @property state.orders {Array} All the orders
 * @property state.page {String} The page that is currently displayed to the user
 * @property state.alive {Boolean} Life state of the bubble
 * @property socket {Socket} Socket for the connection to the server
 * @property menuPage {String} Page to render to show menu
 * @property homePage {String} Page to render to show home
 * @property ordersPage {String} Page to render to show the orders
 */
export default class AdminBubble extends GenericBubble {

    /**
     * Create a bubble for the admin
     * @param props {Object}
     */
    constructor(props) {
        super(props);
        this.socket = null;
        this.menuPage = 'menu';
        this.homePage = 'home';
        this.ordersPage = 'orders';

        this.state = {
            menu: [],
            orders: [],
            page: this.homePage,
            alive: true,
        };
    }

    /**
     * Manage admin's menu page request.
     */
    showMenu() {
        this.setState({
            page: this.menuPage,
        });
    }

    /**
     * Manage admin's home page request.
     */
    showHome() {
        this.setState({
            page: this.homePage,
        });
    }

    /**
     * Manage admin's orders page request.
     */
    showOrders() {
        this.setState({
            page: this.ordersPage,
        });
    }

    /**
     * Invoked immediately after the component is mounted,
     * set the connection.
     */
    componentDidMount() {
        this.socket = io('http://localhost:3001');
        this.socket.emit('auth', { type: 'admin' });
        this.socket.on('disconnect', () => this.setState(
            { alive: false },
        ));
        this.socket.on('connect', () => this.setState(
            { alive: true },
        ));
    }

    /**
     * @override
     * Renders the bubble in it's not alive state.
     * @returns {React.Component}
     */
    // eslint-disable-next-line class-methods-use-this
    notAliveRender() {
        return <MissingConnection />;
    }

    /**
     * @override
     * Renders the bubble in it's alive state.
     * @returns {React.Component}
     */
    aliveRender() {
        let page = <p>null</p>;

        switch (this.state.page) {
        case this.menuPage:
            page = (
                <MenuPage
                  socket={this.socket}
                  handleBack={() => this.showHome()}
                />
                );
            break;
        case this.ordersPage:
            page = (
                <OrdersPage
                  socket={this.socket}
                  handleBack={() => this.showHome()}
                />
                );
            break;
        default:
            page = (
                <HomePage
                  handleMenuClick={() => this.showMenu()}
                  handleOrdersClick={() => this.showOrders()}
                />
                );
            break;
        }

        return (
            <WidgetsContainer>
                <h1 className="text-center">{"Admin's Bubble"}</h1>
                {page}
            </WidgetsContainer>
        );
    }
}
