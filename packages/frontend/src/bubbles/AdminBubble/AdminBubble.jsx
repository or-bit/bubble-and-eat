import { GenericBubble, WidgetsContainer } from 'monolith-frontend';
import React from 'react';
import io from 'socket.io-client';

// importing pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';

import MissingConnection from '../../components/MissingConnection';
import './AdminBubble.css';

export default class AdminBubble extends GenericBubble {

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

    showMenu() {
        this.setState({
            page: this.menuPage,
        });
    }

    showHome() {
        this.setState({
            page: this.homePage,
        });
    }

    showOrders() {
        this.setState({
            page: this.ordersPage,
        });
    }

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

    // eslint-disable-next-line class-methods-use-this
    notAliveRender() {
        return <MissingConnection />;
    }

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
