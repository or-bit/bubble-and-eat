import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { WebNotification } from 'monolith-frontend';
import io from 'socket.io-client';
import './clientBubble.css';

export default class ClientBubble extends React.Component {

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

    // viene lanciato da solo al caricamento della bolla
    componentDidMount() {
        this.connect();
    }

    // viene lancialo alla chiusura della bolla per liberare risorse
    componentWillUnmount() {
        this.disconnect();
    }

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

    showMenu() {
        this.socket.emit('menuRequest');
    }

    order(something) {
        this.socket.emit('order', something);
        this.setState({ orderState: <p className="text-info">Waiting..</p> });
    }

    // nel caso di disconnessione ci si rimette in ascolto sull' ordine/ da capire come usarlo
    queryFor(orderId) {
        this.socket.emit('orderStatus', orderId);
    }

    disconnect() {
        this.socket.close();
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

    redirectToNewOrder() {
        this.setState({ page: 'order' });
        this.showMenu();
    }

    redirectToOrder() {
        this.setState({ page: 'order' });
    }

    redirectToInfo() {
        this.setState({ page: 'info' });
    }

    reloadTotal() {
        let total = 0;
        for (let i = 0; i < this.state.quantita.length; i += 1) {
            if (this.state.quantita[i] !== 0) {
                total += (this.state.menu[i].price * this.state.quantita[i]);
            }
        }
        return total;
    }

    addDishToOrder(i) {
        this.updateAmount(this.state.quantita[i] + 1, i);
    }

    removeDishToOrder(i) {
        this.updateAmount(this.state.quantita[i] - 1, i);
    }

    handleChange(e, i) {
        this.updateAmount(parseInt(e.target.value, 10), i);
    }

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

    render() {
        let page = null;

        // pagina home
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

        // pagina menu
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

        // pagina ordine
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
