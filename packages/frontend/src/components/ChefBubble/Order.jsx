import React from 'react';
import PropTypes from 'prop-types';

export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        // this.markOrdinationCompleted = this.markOrdinationCompleted.bind(this);
    }

    markOrdinationCompleted() {
        this.props.markOrdinationCompleted(this.props.element._id);
    }

    render() {
        return (
            <div className="margin-right-1 margin-left-1  well">
                {<div >
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                         <tbody>
                            {this.props.element.dishes.map((element, i)=>{
                            return <tr key={i}>
                                <td>{element.dish.name}</td>
                                 <td className="text-right">{element.amount}</td>
                            </tr>})}
                        </tbody>
                    </table>
                 </div>
                 }
                <div className="row">
                    <div className="row-md-12">
                        <button className="btn btn-danger center-block" onClick={()=>this.markOrdinationCompleted()}>Mark As Complete</button>
                    </div>
                </div>
            </div>
        );
    }
}

Order.propTypes = {
    socket: PropTypes.object.isRequired,
    markOrdinationCompleted: PropTypes.function.isRequired,
};

Order.defaultProps = {
    class: '',
    text: '',
};
