import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class RadioButton extends Component {
    constructor(props) {
        super(props);
        this.onChange = props.onChange;
        this.value = props.value;
        this.groupName = props.groupName;
        this.checked = props.checked;
        this.optional = {};
        if (typeof this.onChange === 'function') {
            this.optional.onChange = this.onChange.bind(this.groupName, this.value);
        }
        if (this.checked === true) {
            this.optional.defaultChecked = {};
        }
    }
    render() {
        return (
            <div>
                <input
                  type="radio"
                  value={this.value}
                  name={this.props.group}
                  id={`${this.value}radio`}
                  {...this.optional}
                />
                <label htmlFor={`${this.value}radio`}>{this.props.label}</label>
            </div>
        );
    }
}

RadioButton.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.image,
    ]).isRequired,
    groupName: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    label: PropTypes.string.isRequired,
};

RadioButton.defaultProps = {
    checked: false,
};
