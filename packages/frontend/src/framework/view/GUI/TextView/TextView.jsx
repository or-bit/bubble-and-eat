import React from 'react';
import PropTypes from 'prop-types';

export default function TextView(props) {
    return <p className={props.class}>{props.text}</p>;
}

TextView.propTypes = {
    class: PropTypes.string,
    text: PropTypes.string,
};

TextView.defaultProps = {
    class: '',
    text: '',
};
