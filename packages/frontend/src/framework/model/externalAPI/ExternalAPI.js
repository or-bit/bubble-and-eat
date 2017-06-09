import React from 'react';
import axios from 'axios'; // npm install axios
import PropTypes from 'prop-types';
import ExternalAPIStore from './ExternalAPIStore';
import * as ExternalAPIActions from './../../../actions/externalAPIActions'; // objectliteral

export default class ExternalAPI extends React.Component {

// informations is the json found for that url

    constructor(props) { // passing props
        super(props);
        this.state = {
            informations: 'no info found',
            myurl: this.props.myurl,
            items: ExternalAPIStore.getItems(),
        };
    }

    getInitialState() {
        return { information: undefined };
    }

    componentWillMount() {
        ExternalAPIStore.on('change', () => {
            this.setState({
                items: ExternalAPIStore.getItems(),
            });
        });
    }


    componentDidMount() { // get json as a string
        const url = this.state.myurl;
        axios.get(url).then((response) => {
            const informations = JSON.stringify(response);
            this.setState({ informations });// save to state
            ExternalAPIActions.addJSONItem(informations);// save to store
        });
    }
    
     render() {
         return null;
     }

}

ExternalAPI.propTypes = {
    myurl: PropTypes.string.isRequired,
};
