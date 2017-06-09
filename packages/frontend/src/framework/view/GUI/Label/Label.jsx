import React from 'react';
import PropTypes from 'prop-types';

export default function Label({ forId, value }) {
    return <label htmlFor={forId}>{value}</label>;
}

Label.propTypes = {
    forId: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

