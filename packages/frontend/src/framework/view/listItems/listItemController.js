import React, { Component } from 'react';
import ListItemView from './listItemView';
import Button from '../GUI/Button/Button';
import ItemsStore from './../../model/itemsStore/ItemsStore';
import * as ListItemsActions from '../../../actions/listItemsActions'; // objectliteral

export default class ListItemController extends Component {
    constructor() {
        super();
        this.state = {
            items: ItemsStore.getItems(),
            completed: ItemsStore.getCompleted(),
        };
        this.handleComplete = this.handleComplete.bind(this);
    }
    componentWillMount() {
        ItemsStore.on('change', () => {
            this.setState({
                items: ItemsStore.getItems(),
                completed: ItemsStore.getCompleted(),
            });
        });
    }

    processInput() {
        return <ListItemView id="list" items={this.state.items} completed={this.state.completed} />;
    }

    handleComplete(event) {
        event.preventDefault();// prevent page refresh
        const list = document.getElementById('list');
        // Description of what variables are
        // array = [<li>, <li>, <li>, ...]
        // array.children[0] = <div>
        // items = array.children[0].children = [<input>, <label>]
        const array = Array.prototype.slice.call(list.children);
        let j = 0;
        while (j < array.length) {
            const items = Array.prototype.slice.call(array[j].children[0].children);
            if (items[0].checked) {
                ListItemsActions.completeItem(j);
            }
            j += 1;
        }
    }

    handleSubmit(event) {
        const itemString = document.getElementById('todoInpuId').value;
        event.preventDefault();// prevent page refresh
        ListItemsActions.addItem(itemString);
        document.getElementById('todoInpuId').value = '';
    }

    handleRemove(event) {
        event.preventDefault();// prevent page refresh
        const list = document.getElementById('list');
        const array = Array.prototype.slice.call(list.children);
        let j = 0;
        while (j < array.length) {
            // Description of what variables are
            // array = [<li>, <li>, <li>, ...]
            // array.children[0] = <div>
            // items = array.children[0].children = [<input>, <label>]
            const items = Array.prototype.slice.call(array[j].children[0].children);
            if (items[0].checked) {
                ListItemsActions.removeItem(items[0].id);
            }
            j += 1;
        }
    }

    render() {
        const items = this.processInput();
        return (
            <div className="container" id="todo-container">
                <h1 className="modal-title">To-do list</h1>
                <form name="submitItemForm" className="form-group" onSubmit={this.handleSubmit}>
                    <input id="todoInpuId" type="text" className="form-control" />
                    <label htmlFor="todoInpuId" className="hidden">To-do item</label>
                    <input type="submit" name="itemText" value="Add" id="submitItem" className="btn btn-primary" />
                    <label htmlFor="submitItem" className="hidden">Add</label>
                </form>
                <form name="submitIdsForm" onSubmit={this.handleRemove}>
                    {items}
                    <input type="submit" id="delete" name="submitIds" value="Delete Selected" className="btn btn-danger" />
                    <label htmlFor="delete" className="hidden">Delete selected</label>
                    <Button function={this.handleComplete} text="Complete Selected" className="btn btn-default" />
                </form>

            </div>
        );
    }
}
