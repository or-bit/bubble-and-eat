import React from 'react';
import PropTypes from 'prop-types';
import GUI from './GUI/GUI';

export default function GUIContainer(props) {
    return (
        <div>
            {props.children}
        </div>
    );
}

GUIContainer.propTypes = {
    children: PropTypes.arrayOf(PropTypes.instanceOf(GUI)),
};

GUIContainer.defaultProps = {
    children: [],
};
