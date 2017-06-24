import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import io from 'socket.io-client';
import './adminBubble.css';

/**
 * @class This class allows you to create a class representing the Admin Bubble
 * @extends React.Component
 * @property props {Object}
 * @property state {Object}
 * @property state.menu {Array} The restaurant's menu
 * @property state.allOrders {Array} All the orders
 * @property state.completedOrders {Array} The completed orders
 * @property state.activeOrders {Array} The active orders
 * @property state.page {String} The page that is currently displayed to the user
 * @property state.formDataName {String} Name input
 * @property state.formDataPrice {Number} Price input
 * @property state.formOnClick {function} Action perform on click event on the form
 * @property socket {Socket} Socket for the connection to the server
 */
export default class AdminBubble extends React.Component {

    /**
     * Create a bubble for the admin
     * @param props {Object}
     */
    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            allOrders: [],
            completedOrders: null,
            activeOrders: null,
            page: 'home',
            formDataName: null,
            formDataPrice: null,
            formOnClick: () => {},
        };
        this.socket = null;
    }

    /**
     * Invoked immediately after the component is mounted, calls the connect method.
     */
    componentDidMount() {
        this.connect();
    }

    /**
     * Manage admin's connection to the application URL.
     */
    connect() {
        this.socket = io('https://order-gateway.herokuapp.com');
        this.socket.emit('auth', { type: 'admin' });
        this.setState({ menu: [] });
    }

    /**
     * Manage admin's menu request.
     */
    showMenu() {
        this.socket.on('menu', (menu) => {
            this.setState({ menu });
        });
        this.socket.emit('menu');
    }


    /**
     * Manage admin's add dish event.
     * @param dish {Object} dish to add
     */
    addDish(dish) {
        this.socket.on('addedDish', (response) => {
            console.log('risposta all aggiunta di un piatto: ', response);
        });
        this.socket.emit('addDish', dish);
    }

    /**
     * Manage admin's remove dish event to menuStates and emit the event.
     * @param id {Number} id of the dish to remove
     */
    removeDish(id) {
        this.socket.emit('removeDish', id);
    }


    /**
     * Manage admin's edit dish to menuStates then search the dish to modify and emit the event.
     * @param id {Number} dish id
     * @param newDish {Object} changes to upload
     */
    editDish(id, newDish) {
        this.socket.emit('editDish', { id, dish: newDish });
    }

    /**
     * Manage admin's request to get all orders.
     */
    fetchAllOrders() {
        this.socket.on('allOrders', (orders) => {
            console.log('All orders from backend', JSON.stringify(orders));
            this.setState({ allOrders: orders });
        });
        this.socket.emit('allOrders');
    }

   /**
    * Manage admin's request to get active orders, filter orders to get the active ones and emit the event.
    */
    fetchActiveOrders() {
        this.socket.on('activeOrders', (orders) => {
            console.log('Active orders from backend', orders);
            this.setState({ completedOrders: orders });
        });
        this.socket.emit('activeOrders');
    }

    /**
     * Manage admin's request to get completed orders, filter orders to get the completed ones and emit the event.
     */
    fetchCompletedOrders() {
        this.socket.on('completedOrders', (orders) => {
            console.log('Completed orders from backend', orders);
            this.setState({ activeOrders: orders });
        });
        this.socket.emit('completedOrders');
    }

    /**
     * Manage admin's request to delete an order with the specified id, emit delete event on that order.
     * @param orderID {Number} - order to delete
     */
    deleteOrder(orderID) {
        this.socket.on('deleteOrder', (id) => {
            console.log('Deleted order from backend: ', id);
            this.fetchAllOrders();
        });
        this.socket.emit('deleteOrder', orderID);
    }

    /**
     * Manage admin disconnection.
     */
    disconnect() {
        this.socket.close();
    }

    /**
     * Redirect to the form in add item mode.
     */
    redirectToFormAdd() {
        // default value
	// on submit
        this.setState({
            page: 'form',
            formDataPrice: 0,
            formDataName: '',
            formOnClick: () => {
                this.addDish({ name: this.state.formDataName, price: this.state.formDataPrice });
                this.redirectToMenu();
            },
        });
    }

    /**
     * Redirect to the form in edit item mode.
     * @param element {Object} The element to modify
     */
    redirectToFormEdit(element) {
        this.setState({
            page: 'form',
            formDataPrice: element.price,
            formDataName: element.name,
            formOnClick: () => {
                const dish = {
                    price: this.state.formDataPrice,
                    name: this.state.formDataName,
                };
                this.editDish(element.id, { dish });
                this.redirectToMenu();
            },
        });
    }

    /**
     * Redirect to home page.
     */
    redirectToHome() {
        this.setState({ page: 'home' });
    }

    /**
     * Redirect to the menu page.
     */
    redirectToMenu() {
        this.setState({ page: 'menu' });
        this.showMenu();
    }

    /**
     * Redirect to the orders list page.
     */
    redirectToOrders() {
        this.setState({ page: 'orders' });
        this.fetchAllOrders();
    }

    /**
     * Renders the bubble.
     * @return {React.Component}
     */
    render() {
        // page definition
        // default

        let page = <p>z</p>;

        // menu page
	// also used for edits and adds
        const menuPage = (<div>
            <div className="row">
                <div className="col-xs-6">
                    <button
                      className="btn btn-default"
                      onClick={() => this.redirectToHome()}
                    >
                        back
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center">
                        Menu:
                    </h2>
                </div>
            </div>
            {this.state.menu.length === 0 && <h3 className="text-center">Menu empty</h3>}
            {this.state.menu.length !== 0 && <table className="table">
                <thead>
                    <tr>
                        <th>
                        Name:
                    </th>
                        <th>
                        Price:
                    </th>
                        <th className="text-right">
                        Actions:
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.menu.map(element => (<tr key={element.id}>
                        <td>
                            {element.name}
                        </td>
                        <td>
                            {element.price}
                            {' $ '}
                        </td>
                        <td className="text-right">
                            <button
                              className="btn btn-default"
                              onClick={() => this.redirectToFormEdit(element)}
                            >
                                edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                  this.removeDish(element.id);
                                  this.showMenu();
                              }}
                            >
                                delete
                            </button>
                        </td>
                    </tr>))}
                </tbody>
            </table>}


            <div className="row">
                <div className="col-md-12">
                    <button
                      className="btn btn-default center-block"
                      onClick={() => this.redirectToFormAdd()}
                    >
                        AddDishToMenu
                    </button>
                </div>
            </div>

        </div>);

        // order state page
        const ordersPage = (<div>
            <div className="row">
                <div className="col-xs-6">
                    <button
                      className="btn btn-default"
                      onClick={() => this.redirectToHome()}
                    >
                        back
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center">
                        Orders:
                    </h2>
                </div>
            </div>

            {this.state.allOrders.map(element => (<div className="row well" key={element.id}>

                <div className="col-sm-6">
                    <h3>Client info:</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name:</th>
                                <th>Address:</th>
                                <th>State:</th>
                                <th>Action:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>{element.client.name}</th>
                                <th>{element.client.address}</th>
                                <th>{element.state}</th>
                                <th>
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => this.deleteOrder(element._id)}
                                    >
                                        delete
                                    </button>
                                </th>
                            </tr>
                        </tbody>
                    </table>


                </div>
                <div className="col-sm-6">
                    <h3>Dishes:</h3>
                    <table className="table" key={element.id}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {element.dishes.map(dish => (<tr key={dish.id}>
                                <td>{dish.dish.name}</td>
                                <td>{dish.amount}</td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>))}
        </div>);

        // home page
        const homePage = (<div>
            <div className="row bottomSpace2 topSpace1">
                <div className="col-md-12 control-group">
                    <button
                      className="btn btn-default center-block"
                      onClick={() => this.redirectToMenu()}
                    >
                        MenuOperations
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 control-group">
                    <button
                      className="btn btn-default center-block"
                      onClick={() => this.redirectToOrders()}
                    >
                        OrdersOperations
                    </button>
                </div>
            </div>
        </div>);


        // form page for adding and editing orders
        const form = (
            <div>
                <div className="row">
                    <div className="col-xs-6">
                        <button
                          className="btn btn-default"
                          onClick={() => this.redirectToHome()}
                        >
                            back
                        </button>
                    </div>
                </div>
                <div className="form-group topSpace1 margin-left-1 margin-right-1">
                    <label htmlFor="name">Name</label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={this.state.formDataName}
                      onChange={event => this.setState({ formDataName: event.target.value })}
                    />
                </div>
                <div className="form-group margin-left-1 margin-right-1">
                    <label htmlFor="price">Price</label>
                    <input
                      className="form-control"
                      id="price"
                      type="number"
                      value={this.state.formDataPrice}
                      step="0.01"
                      onChange={event => this.setState({ formDataPrice: event.target.value })}
                    />
                </div>

                <button
                  className="btn btn-success center-block"
                  onClick={this.state.formOnClick}
                >
                    Submit
                </button>
            </div>
        );

        // based on state.page it renders the correct page
        if (this.state.page === 'home') {
            page = homePage;
        } else if (this.state.page === 'menu') {
            page = menuPage;
        } else if (this.state.page === 'orders') {
            page = ordersPage;
        } else if (this.state.page === 'form') {
            page = form;
        }

        return (
            <div>
                <h1 className="text-center">Admin Bubble</h1>
                {page}
            </div>
        );
    }
}
