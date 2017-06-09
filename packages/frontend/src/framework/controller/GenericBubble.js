import React from 'react';
import PropTypes from 'prop-types';
import LifeCycle from '../model/lifeCycle/LifeCycle';

export default class GenericBubble extends React.Component {
    constructor(props) {
        super(props);
        this.lifeCycle = props.time === null ? null : new LifeCycle(props.time);
        this.state = { alive: true };
    }

// eslint-disable-next-line class-methods-use-this
    aliveRender() {}

// eslint-disable-next-line class-methods-use-this
    notAliveRender() {}

    render() {
        if (this.state.alive) {
            return this.aliveRender();
        }
        return this.notAliveRender();
    }
}

GenericBubble.propTypes = {
    time: PropTypes.number,
};

GenericBubble.defaultProps = {
    time: null,
};
