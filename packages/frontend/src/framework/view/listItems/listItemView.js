import React from 'react';
import CheckBoxGroup from '../GUI/CheckButton/CheckBoxGroup';

export default class ListItemView extends React.Component {

    constructor(props) { // passing props
        super(props);
        this.state = {
            items: this.props.items,
            completed: this.props.completed,
        };
    }

    render() {
        return (
            <CheckBoxGroup
              id={this.props.id}
              groupName="lista"
              buttons={this.state.items.map(item => ({
                  name: item.text,
                  value: item.text,
                  label: item.text,
                  checked: item.checked,
                  className: item.completed ? 'completed' : '',
              }))}
            />
        );
    }
}
