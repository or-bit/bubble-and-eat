import React from 'react';
import PropTypes from 'prop-types';

export default function InputFile(props) {
    return (<input type="file" id={props.id} />);
}
InputFile.propTypes = {
    id: PropTypes.string.isRequired,
};
