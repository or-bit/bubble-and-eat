import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckBox from './CheckBox';

export default class CheckBoxGroup extends Component {
    // onCheckedChange(object) {
    //     console.log(object);
    // }

    processInput() {
        return this.props.buttons.map(
            ({ name, value, label, checked, className }) =>
                <li key={name} className="list-group-item">
                    <CheckBox
                      name={name} value={value} checked={checked}
                      label={label} className={className}
                    />
                </li>,
        );
    }

    render() {
        const buttons = this.processInput();
        return (
            <ul id={this.props.id} className="list-group form-check">
                {buttons}
            </ul>
        );
    }
}

CheckBoxGroup.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
    id: PropTypes.string,
};

CheckBoxGroup.defaultProps = {
    buttons: [],
    id: '',
};
