import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import io from 'socket.io-client';
import './adminBubble.css';


export default class AdminBubble extends React.Component {
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

    componentDidMount() {
        this.connect();
    }

    connect() {
        this.socket = io('https://order-gateway.herokuapp.com');
        this.socket.emit('auth', { type: 'admin' });
        this.setState({ menu: [] });
    }

    showMenu() {
        this.socket.on('menu', (menu) => {
            this.setState({ menu });
        });
        this.socket.emit('menu');
    }

    addDish(dish) {
        this.socket.on('addedDish', (response) => {
            console.log('risposta all aggiunta di un piatto: ', response);
        });
        this.socket.emit('addDish', dish);
    }

    removeDish(id) {
        this.socket.emit('removeDish', id);
    }

    editDish(id, newDish) {
        this.socket.emit('editDish', { id, dish: newDish });
    }

    fetchAllOrders() {
        this.socket.on('allOrders', (orders) => {
            console.log('All orders from backend', JSON.stringify(orders));
            this.setState({ allOrders: orders });
        });
        this.socket.emit('allOrders');
    }

    fetchActiveOrders() {
        this.socket.on('activeOrders', (orders) => {
            console.log('Active orders from backend', orders);
            this.setState({ completedOrders: orders });
        });
        this.socket.emit('activeOrders');
    }

    fetchCompletedOrders() {
        this.socket.on('completedOrders', (orders) => {
            console.log('Completed orders from backend', orders);
            this.setState({ activeOrders: orders });
        });
        this.socket.emit('completedOrders');
    }

    deleteOrder(orderID) {
        this.socket.on('deleteOrder', (id) => {
            console.log('Deleted order from backend: ', id);
            this.fetchAllOrders();
        });
        this.socket.emit('deleteOrder', orderID);
    }

    disconnect() {
        this.socket.close();
    }

    // form per l' aggiunta cambiando la funzione di submit e i valori di default e lo renderizza
    redirectToFormAdd() {
        // funzione che viene eseguita al submit e i valori di default da visualizzare nel form
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
    // predispone il form per l' edit della voce del menu e lo renderizza
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
    // renderizza la home
    redirectToHome() {
        this.setState({ page: 'home' });
    }
    // renderizza la pagina di gestione del menu
    redirectToMenu() {
        this.setState({ page: 'menu' });
        this.showMenu();
    }
    // renderizza la pagina di gestione delle ordinaizoni
    redirectToOrders() {
        this.setState({ page: 'orders' });
        this.fetchAllOrders();
    }


    render() {
        // DEFINISCO LE VARIE PAGINE
        // default

        let page = <p>z</p>;

        // pagina per la visualizzazione del menu e base per lanciare le modifiche o aggiunte
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

        // pagina per vedere lo stato degli ordini
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

        // pagina home
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


        // pagina di form che uo servire per aggiungere oppure
        // modificare un ordinazione a seconda di come viene chiamato
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

        // in base allo state.page renderizza una pagina diversa
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
