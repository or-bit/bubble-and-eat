import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { GenericBubble, WidgetsContainer } from 'monolith-frontend';
import io from 'socket.io-client';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrderPage from './pages/OrderPage';

import './clientBubble.css';

/**
 * @class Represents the Client and all it's functionalities in the application.
 * It allows the user to interact with the application by
 * rendering the GUI and calling the methods requested by the user.
 * @extends GenericBubble
 * @property props {Object}
 * @property state {Object}
 * @property state.menu {Array} Restaurant's menu
 * @property state.page {String} Page that is currently displayed to the user
 * @property state.quantity {Array} Array containing the quantities of the different dishes
 * @property state.order {Object} Represents the current order
 * @property state.order.client {Client} Client associated to the order
 * @property state.order.dishes {Array} List of dishes ordered by the client
 * @property state.order.state {String} State of the order
 * @property state.orderState {String} State of the current order
 * @property state.client {Object} Client user of the bubble
 * @property state.client.name {String} Client's name
 * @property state.client.address {String} Client's address
 * @property state.total {Number} Total cost of the order
 * @property state.notify {Notification}
 * @property socket {Socket} Socket for the connectionto the server
 * @property orderId {Number} Id of the order once completed
 */
export default class ClientBubble extends GenericBubble {

    /**
     * Create a bubble for the client
     * @param props {Object}
     */
    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            alive: true,
            page: 'home',
            quantita: [],
            order: { client: {}, dishes: [], state: '' },
            client: { name: '' },
            total: 0,
            notify: null,
        };
        this.socket = io('http://localhost:3001');
        this.orderId = null;
    }

    /**
     * This function gets called automatically when the bubble
     * gets loaded and calls the method connect() to connect
     * the bubble to the rest of the application.
     */
    componentDidMount() {
        this.connect();
    }

    /**
     * This function gets called automatically when
     * the bubble dies to free the resources it was occupying.
     */
    componentWillUnmount() {
        this.disconnect();
    }

    /**
     * This method connects the bubble to the rest of the application through a socket.
     */
    connect() {
        this.socket.emit('auth', { type: 'client' });

        // this.socket.on('addedDish', () => this.showMenu());
        // this.socket.on('menu', (menu) => {
        //     const quantita =
        //         Array(...new Array(menu.length)).map(Number.prototype.valueOf, 0);
        //     this.setState({ menu, quantita, total: 0 });
        // });
        //
        // this.socket.on('orderTotal', (total) => {
        //     const order = this.state.order;
        //     order.total = total;
        //     this.setState({ order });
        // });
        // this.socket.on('orderId', (id) => {
        //     this.orderId = id;
        // });
        // this.socket.on('orderReady', (newOrder) => {
        //     console.log('ORDER COMPLETED', newOrder);
        //     this.setState({ newOrder });
        //     const title = 'Order ready!';
        //     const body = 'Your order is ready! We\'ll keep it warm for you... ;)';
        //     const imageUrl = 'http://www.pngmart.com/files/3/Green-Tick-PNG-Photos.png';
        //     new WebNotification(title, body, imageUrl).notify();
        // });
    }

    /**
      * Requests the menu through the socket.
      */
    showMenu() {
        this.socket.emit('menuRequest');
    }

    /**
     * Orders the object that's passed to it as a parameter.
     * @param order {Object} The object that has to be ordered.
     */
    order(order) {
        console.log(JSON.stringify(order, null, ' '));
        this.socket.emit('order', order);
    }

    /**
     * Requests the status of an order.
     * @param orderId {Number} The ID of the order.
     */
    queryFor(orderId) {
        this.socket.emit('orderStatus', orderId);
    }

    /**
     * Manage client disconnection
     */
    disconnect() {
        this.socket.close();
    }

    /**
     * Redirects the user to the home page.
     */
    redirectToHome() {
        this.setState({ page: 'home' });
    }

    /**
     * Redirects the user to the menu page.
     */
    // renderizza la pagina di gestione del menu
    redirectToMenu() {
        this.setState({ page: 'menu' });
    }

    /**
     * Redirects the user to the order page.
     */
    redirectToOrder() {
        this.setState({ page: 'order' });
    }

    /**
     * Redirects the user to the info page.
     */
    redirectToInfo() {
        this.setState({ page: 'info' });
    }

    /**
     * This method updates the information about the client by adding it's name and address.
     */
    updateClient(e, data) {
        const clientAux = this.state.client;
        switch (data) {
        case 'name':
            clientAux.name = e.target.value;
            break;
        default:
            break;
        }
        this.setState({ client: clientAux });
    }

    /**
     * Confirms the order and redirects to the summary page
     */
    handleCompletedOrder(order) {
        this.order(order);
        this.setState({ order, page: 'summary' });
    }

   /**
    * Renders client's home page, menu page and order page
    */
    render() {
        let page = null;

        // home page
        const homePage = (
            <HomePage
              handleMenuClick={() => this.redirectToMenu()}
              handleOrderClick={() => this.redirectToOrder()}
            />
        );

        const summaryPage = (
            <div>
                <h2 className="text-center">Summary</h2>
                <h3 className="text-center">Order state: {this.state.orderState}</h3>
                {this.state.notify}
                <h3 className="text-center">Total: {this.state.order.total} $</h3>
            </div>
        );

        switch (this.state.page) {
        case 'home':
            page = homePage;
            break;
        case 'menu':
            page = (
                <MenuPage
                  socket={this.socket}
                  handleBack={() => this.redirectToHome()}
                />
            );
            break;
        case 'order':
            page = (
                <OrderPage
                  socket={this.socket}
                  handleBack={() => this.redirectToHome()}
                  handleCompletedOrder={order => this.handleCompletedOrder(order)}
                />
            );
            break;
        case 'summary':
            page = summaryPage;
            break;
        default:
            break;
        }

        return (
            <WidgetsContainer>
                <h1 className="text-center">Welcome to Bubble & Eat demo!</h1>
                {page}
            </WidgetsContainer>
        );
    }
}
