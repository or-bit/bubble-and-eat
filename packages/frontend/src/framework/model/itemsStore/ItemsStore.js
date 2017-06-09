import dispatcher from '../../../dispatcher';
import BubbleMemory from '../bubbleMemory/BubbleMemory';

class ItemsStore extends BubbleMemory {
    constructor() {
        super();
        this.items = [];
    }

    addItems(text) {
        this.items.push({ text, completed: false });
        this.emit('change');
    }
    removeItems(id) { // id passed
        let index;
        for (let i = 0, len = this.items.length; i < len; i += 1) {
            if (this.items[i].text === id) {
                index = i;
            }
        }
        if (index > 0) {
            this.items.splice(index, 1);// id passed
        } else {
            this.items.shift();
        }
        this.emit('change');
    }
    completeItems(id) { // id passed
        this.items[id] = { text: this.items[id].text, completed: true };
        this.emit('change');
    }

    getItems() {
        return this.items;
    }
    getCompleted() {
        return this.items.filter(item => item.completed);
    }

    handleActions(action) {
        switch (action.type) {
        case 'ADD_ITEM': {
            this.addItems(action.text);
            break;
        }
        case 'REMOVE_ITEM': {
            this.removeItems(action.id);
            break;
        }
        case 'COMPLETE_ITEM': {
            this.completeItems(action.id);
            break;
        }
        default: break;
        }
    }

}

const itemsStore = new ItemsStore();
dispatcher.register(itemsStore.handleActions.bind(itemsStore));
window.dispatcher = dispatcher;
export default itemsStore;
