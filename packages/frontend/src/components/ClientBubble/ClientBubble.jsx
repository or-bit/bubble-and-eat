/**
 * client module
 * @module client
 */

import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { WebNotification } from 'monolith-frontend';
import io from 'socket.io-client';
import './clientBubble.css';

/**
 * @class This class allows you to create a class representing the Client Bubble
 * @param props
 * @constructor
 */
export default class ClientBubble extends React.Component {
    /**
     *The class ClientBubble represents the Client and all it's functionalities in the application. It allows the user to interact with the application by rendering the GUI and calling the methods requested by the user.
     * @class ClientBubble -
     * @extends Component
     * @property props {Object}
     * @property props.menu {Array} - the restaurant's menu.
     * @property props.page {String} - the page that is currently displayed to the user.
     * @property props.quantity {Array} - the array containing the quantities of the different dishes.
     * @property props.order {client: {}, dishes: Array, state:String} - order represents the current order.
     * @property props.orderState {String} - the state of the current order.
     * @property props.client {name: String, address: String} - the current client's data.
     * @property props.total {Number} - the current total cost of the order.
     * @property props.notify {Notification}
    */
    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            page: 'home',
            quantita: [],
            order: { client: {}, dishes: [], state: '' },
            orderState: 'not ordered yet',
            client: { name: '', address: '' },
            total: 0,
            notify: null,
        };
        this.socket = null;
        this.orderId = null;
        this.handleChange = this.handleChange.bind(this);
    }

    /**
    * @function
    * @name componentDidMount
    * @desc This function gets called authomatically when the bubble gets loaded and call the method connect() to connect the bubble to the rest of the application.
    */
    componentDidMount() {
        this.connect();
    }

    /**
    * @function
    * @name ccomponentWillUnmount
    * @desc This function gets called authomatically when the bubble dies to free the resources it was occupying.
    */
    componentWillUnmount() {
        this.disconnect();
    }

    /**
    * @function
    * @name connect
    * @desc This method connects the bubble to the rest of the application through a socket.
    */
    connect() {
        this.socket = io('https://order-gateway.herokuapp.com');
        this.socket.emit('auth', { type: 'client' });

        this.socket.on('menu', (menu) => {
            const quantita =
                Array(...new Array(menu.length)).map(Number.prototype.valueOf, 0);
            this.setState({ menu, quantita, total: 0 });
        });

        this.socket.on('orderTotal', (total) => {
            const order = this.state.order;
            order.total = total;
            this.setState({ order });
        });
        this.socket.on('orderId', (id) => {
            this.orderId = id;
        });
        this.socket.on('orderReady', () => {
            this.setState({
                orderState: <p className="text-success">Ready!</p>,
            });
            const title = 'Order ready!';
            const body = 'Your order is ready! We\'ll keep it warm for you... ;)';
            const imageUrl = 'http://www.pngmart.com/files/3/Green-Tick-PNG-Photos.png';
            new WebNotification(title, body, imageUrl).notify();
        });
    }

    /**
     * @function
     * @name showMenu
     * @desc This method requests the menu through the socket.
     */
    showMenu() {
        this.socket.emit('menuRequest');
    }

    /**
     * @function
     * @name order
     * @desc This method orders the object that's passed to it as a parameter.
     * @param something {Object} - The object that has to be ordered.
     */
    order(something) {
        this.socket.emit('order', something);
        this.setState({ orderState: <p className="text-info">Waiting..</p> });
    }

    /**
     * @function
     * @name queryFor
     * @desc This method requests the status of an order.
     * @param orderId {Number} - The ID of the order.
     */
    queryFor(orderId) {
        this.socket.emit('orderStatus', orderId);
    }

    /**
    * @function
    * @name disconnect
    * @desc manage chef disconnection
    */
    disconnect() {
        this.socket.close();
    }

    /**
     * @function
     * @name redirectToHome
     * @desc This method redirects the user to the home page.
     */
    // renderizza la home
    redirectToHome() {
        this.setState({ page: 'home' });
    }

    /**
     * @function
     * @name redirectToMenu
     * @desc This method redirects the user to the menu page.
     */
    // renderizza la pagina di gestione del menu
    redirectToMenu() {
        this.setState({ page: 'menu' });
        this.showMenu();
    }

    /**
     * @function
     * @name redirectToNewOrder
     * @desc This method redirects the user to the new order page.
     */
    redirectToNewOrder() {
        this.setState({ page: 'order' });
        this.showMenu();
    }

    /**
     * @function
     * @name redirectToOrder
     * @desc This method redirects the user to the order page.
     */
    redirectToOrder() {
        this.setState({ page: 'order' });
    }

    /**
     * @function
     * @name redirectToInfo
     * @desc This method redirects the user to the info page.
     */
    redirectToInfo() {
        this.setState({ page: 'info' });
    }

    /**
     * @function
     * @name reloadTotal
     * @desc This method calculates and returns the total cost of all the dishes selected for the current order.
     * @returns {Number} - The total cost of the order.
     */
    reloadTotal() {
        let total = 0;
        for (let i = 0; i < this.state.quantita.length; i += 1) {
            if (this.state.quantita[i] !== 0) {
                total += (this.state.menu[i].price * this.state.quantita[i]);
            }
        }
        return total;
    }

    /**
     * @function
     * @name addDishToOrder
     * @param i {Number} - the ID of the dish.
     * @desc This method increases by one the currently ordered quantity of the selected dish.
     */
    addDishToOrder(i) {
        this.updateAmount(this.state.quantita[i] + 1, i);
    }

    /**
     * @function
     * @name removeDishToOrder
     * @param i {Number} - the ID of the dish.
     * @desc This method reduces by one the currently ordered quantity of the selected dish.
     */
    removeDishToOrder(i) {
        this.updateAmount(this.state.quantita[i] - 1, i);
    }

    /**
     * @function
     * @name handleChange
     * @param e {Event}
     * @param i {Number} - the ID of the dish.
     * @desc This method handles the changes in the amount of ordered portions for the selected dish. It calls the updateAmount method after converting into an int the amount of portions.
     */
    handleChange(e, i) {
        this.updateAmount(parseInt(e.target.value, 10), i);
    }


    /**
    * @function
    * @name updateAmount
    * @param amount {Number} - new amount
    * @param i {Number} - which item to update
    * @desc This method updates a specific dish's amount of portions as well as the total cost of the order.
    */
    updateAmount(amount, i) {
        const quantita = this.state.quantita;
        if (amount > 0) {
            quantita[i] = amount;
        } else {
            quantita[i] = 0;
        }
        const total = this.reloadTotal();
        this.setState({ quantita, total });
    }

    /**
    * @function
    * @name updateClient
    * @desc This method updates the information about the client by adding it's name and address.
    */
    updateClient(e, data) {
        const clientAux = this.state.client;
        switch (data) {
        case 'name':
            clientAux.name = e.target.value;
            break;
        case 'address':
            clientAux.address = e.target.value;
            break;
        default:
            break;
        }
        this.setState({ client: clientAux });
    }

    /**
    * @function
    * @name confirmOrder
    * @desc confirm order, redirects to summary page
    */
    confirmOrder() {
        const order = this.state.order;
        order.client = this.state.client;
        for (let i = 0; i < this.state.quantita.length; i += 1) {
            if (this.state.quantita[i] !== 0) {
                this.state.order.dishes.push({
                    dish: this.state.menu[i],
                    amount: this.state.quantita[i],
                });
            }
        }
        this.order(this.state.order);
        order.state = this.state.orderState;
        this.setState({ order, page: 'summary' });
        console.log(JSON.stringify(this.state.order));
    }

   /**
    * @function
    * @name render
    * @desc renders client's home page, menu page and order page
    */
    render() {
        let page = null;

        // home page
        const homePage = (
            <div>
                <div className="row margin-bottom-2">
                    <div className="col-md-12">
                        <button
                          className="btn btn-default center-block"
                          onClick={() => this.redirectToMenu()}
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <button
                          className="btn btn-default center-block"
                          onClick={() => { this.redirectToNewOrder(); }}
                        >
                            New Order!
                        </button>
                    </div>
                </div>
            </div>
        );

        const emptyMenu = () => (
            <h3 className="text-center">Empty Menu!</h3>
        );

        const fullMenu = () => (
            <div className="row margin-left-1 margin-right-1">
                <table className="table">
                    <thead>
                        <tr>
                            <th >Name</th>
                            <th >Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.menu.map(element => (
                            <tr key={element.id}>
                                <td>{element.name}</td>
                                <td>{element.price}{' $ '}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

        // menu page
        const menuPage = (
            <div>
                <div className="row">
                    <div className="col-xs-6">
                        <button
                          className="btn btn-default"
                          onClick={() => this.redirectToHome()}
                        >
                            Back!
                        </button>
                    </div>
                </div>
                <h2 className="text-center">Menu:</h2>
                {this.state.menu.length === 0 ? emptyMenu() : fullMenu()}
            </div>
        );

        const ordersComponent = () => (
            <div className="row margin-left-1 margin-right-1">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name:</th>
                            <th>Price:</th>
                            <th>Amount:</th>
                            <th>Actions:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.menu.map((element, i) => (
                            <tr key={element.id}>
                                <td>{element.name}</td>
                                <td>{element.price}{' $ '}</td>
                                <td>
                                    <input
                                      className="form-control"
                                      name="amount" type="number"
                                      value={this.state.quantita[i]} label=""
                                      onChange={e => this.handleChange(e, i)}
                                    />
                                </td>
                                <td>
                                    <button
                                      className="btn btn-default"
                                      onClick={() => this.addDishToOrder(i)}
                                    >
                                        +
                                    </button>
                                    <button
                                      className="btn btn-default"
                                      onClick={() => this.removeDishToOrder(i)}
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>Total: {this.state.total} $</p>
                <div className="row">
                    <div className="col-md-12">
                        <button
                          className="btn btn-success center-block"
                          onClick={() => this.redirectToInfo()}
                        >
                            Insert Info
                        </button>
                    </div>
                </div>
                <div className="row margin-top-1">
                    <div className="col-md-12">
                        <button
                          className="btn btn-danger center-block"
                          onClick={() => this.redirectToNewOrder()}
                        >
                            Reset Order!
                        </button>
                    </div>
                </div>
            </div>
        );

        // order page
        const orderPage = (
            <div>
                <button
                  className="btn btn-default"
                  onClick={() => {
                      this.redirectToHome();
                  }}
                >
                    Back!
                </button>
                <h2 className="text-center">New Order</h2>
                {this.state.menu.length === 0 ? emptyMenu() : ordersComponent()}
            </div>
        );

        const infoPage = (
            <div className="margin-left-1 margin-right-1">
                <div className="row">
                    <div className="col-md-12">
                        <button
                          className="btn btn-default"
                          onClick={() => {
                              this.redirectToOrder();
                          }}
                        >
                            Back
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="text-center">Insert personal data</h2>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                      className="form-control"
                      name="name" type="text" value={this.state.client.name}
                      onChange={e => this.updateClient(e, 'name')}
                    />
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <button
                          className="btn btn-success center-block"
                          onClick={() => {
                              this.confirmOrder();
                          }}
                        >
                            Confirm!
                        </button>
                    </div>
                </div>
            </div>
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
            console.log('homePage');
            break;
        case 'menu':
            page = menuPage;
            console.log('menuPage');
            break;
        case 'order':
            page = orderPage;
            console.log('orderPage');
            break;
        case 'info':
            page = infoPage;
            console.log('infoPage');
            break;
        case 'summary':
            page = summaryPage;
            console.log('summaryPage');
            break;
        default:
            break;
        }

        return (
            <div>
                <h1 className="text-center">Client Bubble</h1>
                {page}
            </div>
        );
    }
}
