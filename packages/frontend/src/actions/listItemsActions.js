import dispatcher from '../dispatcher';

export function addItem(text) {
    dispatcher.dispatch({
        type: 'ADD_ITEM',
        text,
    });
}

export function removeItem(id) {
    dispatcher.dispatch({
        type: 'REMOVE_ITEM',
        id,
    });
}

export function completeItem(id) {
    dispatcher.dispatch({
        type: 'COMPLETE_ITEM',
        id,
    });
}
