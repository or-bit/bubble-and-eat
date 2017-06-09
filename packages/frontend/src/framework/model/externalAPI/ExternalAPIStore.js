import dispatcher from '../../../dispatcher';
import BubbleMemory from '../bubbleMemory/BubbleMemory';

class ExternalAPIStore extends BubbleMemory {
    constructor() {
        super();
        this.items = []; // json items as strings in store
        this.itemNumber = 0;
    }

    addItems(text) {
        this.itemNumber += 1;
        this.items.push({ id: this.itemNumber, item: text });
        this.emit('change');
    }

    getItems() {
        return this.items;
    }

    handleActions(action) {
        switch (action.type) {
        case 'ADD_JSON': {
            this.addItems(action.text);
            break;
        }
        default: break;
        }
    }
}

const externalAPIStore = new ExternalAPIStore();
dispatcher.register(externalAPIStore.handleActions.bind(externalAPIStore));
export default externalAPIStore;
