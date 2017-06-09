import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RadioButton from './RadioButton';

export default class RadioButtonsGroup extends Component {
    constructor() {
        super();
        this.state = {
            selected: null,
        };
    }

    onCheckedChange(value) {
        this.setState({ selected: value });
        console.log(value);
    }

    processInput() {
        return this.props.buttons.map(
            ({ value, label, checked, key }) =>
                <RadioButton
                  group={this} key={key} value={value}
                  label={label} groupName={this.props.groupName}
                  checked={checked} onChange={this.onCheckedChange}
                />,
        );
    }

    render() {
        return (
            <div>
                {this.processInput()}
            </div>
        );
    }
}

RadioButtonsGroup.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.object),
    groupName: PropTypes.string,
};

RadioButtonsGroup.defaultProps = {
    buttons: [],
    groupName: 'RadioButtons',
};
