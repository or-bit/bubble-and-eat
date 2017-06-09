import React from 'react';
import PropTypes from 'prop-types';
import './button.css';

export default function Button(props) {
    return (
        <button className={props.className} onClick={props.function}>
            {props.text}
        </button>
    );
}

Button.propTypes = {
    function: PropTypes.func,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
};

Button.defaultProps = {
    function: () => {},
    className: '',
};
